import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Row, Col, Steps, Divider } from 'antd';
import classNames from 'classnames';
import styles from './EmailForm.less';

const FormItem = Form.Item;
const { Step } = Steps;

class EmailForm extends Component {
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
    current: 0,
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleSendCaptcha = () => {
    this.props.form.validateFields(['email'], { force: true }, (err, values) => {
      if (!err) {
        this.props.onGetCaptcha(values, () => {
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
    this.props.form.validateFields({ force: true }, this.props.onSubmit);
  };

  render() {
    const { className, form, initialValue = {}, submitting, disabled } = this.props;
    const { count, current } = this.state;
    const { getFieldDecorator } = form;
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
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="邮箱">
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('email', {
                  initialValue: initialValue.email,
                  rules: [
                    {
                      required: true,
                      message: '请输入邮箱！',
                    },
                    {
                      type: 'email',
                      message: '邮箱地址格式错误！',
                    },
                  ],
                })(<Input size="large" disabled={disabled} placeholder="邮箱" />)}
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
          <FormItem {...formItemLayout} label="验证码">
            {getFieldDecorator('captcha', {
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
              下一步
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(EmailForm);
