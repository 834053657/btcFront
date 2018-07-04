import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Alert, Select, Row, Col } from 'antd';
import classNames from 'classnames';
import { map } from 'lodash';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
class G2Validation extends Component {
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

  componentDidMount() {
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
    this.props.form.validateFields({ force: true }, (err, values) => {
      this.props.onSubmit(err, values);
    });
  };
  render() {
    const { className, form, submitting, visible, title } = this.props;
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
      <Modal
        width={460}
        title={title}
        visible={visible}
        maskClosable={false}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            htmlType="submit"
            onClick={this.handleSubmit}
          >
            确定
          </Button>,
        ]}
      >
        <Alert showIcon className={styles.alert} message="为保障您的账户安全，请进行身份验证。" type="info" />
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="支付方式" {...formItemLayout}>
              {getFieldDecorator('type',{
                initialValue: 'mail'
                }
              )(
                <Select>
                  {map(CONFIG.verify_type, (text, val) => (
                    <Option key={val} value={val}>
                      {text}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            {
              getFieldValue('type') === 'sms' && (
                <FormItem {...formItemLayout} label="国家">
                  {getFieldDecorator('nation_code', {
                    rules: [
                      {
                        required: true,
                        message: '请选择国家！',
                      },
                    ],
                  })(
                    <Select >
                      {CONFIG.country.map(item => (
                        <Option key={item.code} value={item.nation_code}>
                          {item.name_cn}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              )
            }
            <FormItem {...formItemLayout} label="邮箱">
              <Row gutter={24}>
                <Col span={14}>
                  {
                    getFieldValue('type') === 'mail' ?
                      getFieldDecorator('mail', {
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
                      })(<Input size="large" placeholder="邮箱" />)
                      :
                      getFieldDecorator('phone', {
                        rules: [
                          {
                            required: true,
                            message: '请输入手机号码！',
                          },
                          {
                            pattern: /^[1-9]\d*$/,
                            message: '请输入正确的手机号码',
                          },
                        ],
                      })(
                        <Input
                          className={styles.mobile_input}
                          addonBefore={
                            form.getFieldValue('telephone_code') ? (
                              <span>+{form.getFieldValue('telephone_code')}</span>
                            ) : null
                          }
                          style={{ width: '100%' }}
                        />
                      )
                  }
                </Col>
                <Col span={10}>
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
              {getFieldDecorator('验证码', {
                rules: [
                  {
                    required: true,
                    message: '请输入验证码！',
                  },
                ],
              })(<Input size="large" placeholder="验证码" />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(G2Validation);
