import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Alert, Select, Row, Col } from 'antd';
import classNames from 'classnames';
import { map } from 'lodash';
import styles from './SecureValidationForm.less';

const FormItem = Form.Item;
const { Option } = Select;

class SecureValidationForm extends Component {
  static defaultProps = {
    className: '',
    onGetCaptcha: () => {},
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    className: PropTypes.string,
    onGetCaptcha: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    count: 0,
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSendCaptcha = () => {
    const { validateFields, getFieldValue } = this.props.form;

    validateFields(['type'], { force: true }, (err, values) => {
      if (!err) {
        const params = {
          ...values,
          data: this.props.verify_data[values.type].data,
        };

        this.props.onGetCaptcha(params, () => {
          let count = 59;
          this.setState({ count });
          this.interval = setInterval(() => {
            count -= 1;
            this.setState({ count });
            if (count === 0) {
              clearInterval(this.interval);
            }
          }, 1000);
        });
      }
    });
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      const params = {
        ...values,
        data: this.props.verify_data[values.type].data,
      };
      this.props.onSubmit(err, params);
    });
  };
  render() {
    const { className, form, submitting, verify_data } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { count, current } = this.state;

    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };

    return (
      <div className={classNames(className, styles.login)}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark>
          <FormItem label="验证方式" {...formItemLayout}>
            <Row gutter={24}>
              <Col span={16}>
                {getFieldDecorator('type', {
                  initialValue: 'mail',
                })(
                  <Select size="large">
                    {map(verify_data, (obj, val) => (
                      <Option key={val} value={val}>
                        {obj.text}
                      </Option>
                    ))}
                  </Select>
                )}
              </Col>
              <Col span={8}>
                <Button
                  disabled={count}
                  className={styles.getCaptcha}
                  size="large"
                  onClick={this.handleSendCaptcha}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </FormItem>

          <FormItem label="验证码" {...formItemLayout}>
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ],
            })(<Input size="large" placeholder="验证码" />)}
          </FormItem>

          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              确定
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(SecureValidationForm);
