import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Modal, Alert, Select, Row, Col } from 'antd';
import { map } from 'lodash';
import styles from './ForgetPassword.less';
import { getCaptcha } from '../../services/api';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

@connect(({ user, loading }) => ({
  submitting: loading.effects['user/submitForgetPassword'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
  };

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      console.log(values);
      if (!err) {
        this.props.dispatch({
          type: 'user/submitForgetPassword',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  onGetCaptcha = (values, callback) => {
    return this.props.dispatch({
      type: 'global/sendVerify',
      payload: {
        data: {
          ...values,
        },
        type: values.type,
        usage: 7,
      },
      callback,
    });
  };

  handleSendCaptcha = () => {
    const { validateFields, getFieldValue } = this.props.form;
    const type = getFieldValue('type');
    const fieldsName = type === 'mail' ? ['mail', 'type'] : ['nation_code', 'phone', 'type'];

    validateFields(fieldsName, { force: true }, (err, values) => {
      if (!err) {
        this.onGetCaptcha(values, () => {
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

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { count } = this.state;
    return (
      <div className={styles.main}>
        <h3>忘记密码</h3>
        <Form onSubmit={this.handleSubmit} hideRequiredMark>
          <FormItem>
            {getFieldDecorator('type', {
              initialValue: 'mail',
            })(
              <Select size="large">
                {map(CONFIG.verify_type, (text, val) => (
                  <Option key={val} value={val}>
                    {text}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          {getFieldValue('type') === 'sms' && (
            <FormItem>
              {getFieldDecorator('nation_code', {
                rules: [
                  {
                    required: true,
                    message: '请选择国家！',
                  },
                ],
              })(
                <Select size="large" placeholder="请选择国家">
                  {CONFIG.country.map(item => (
                    <Option key={item.code} value={item.nation_code}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          )}
          <FormItem>
            <Row gutter={24}>
              <Col span={14}>
                {getFieldValue('type') === 'mail'
                  ? getFieldDecorator('mail', {
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
                    })(<Input size="large" placeholder="请输入邮箱" />)
                  : getFieldDecorator('phone', {
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
                        placeholder="请输入手机号码"
                        size="large"
                        className={styles.mobile_input}
                        addonBefore={
                          form.getFieldValue('nation_code') ? (
                            <span>+{form.getFieldValue('nation_code')}</span>
                          ) : null
                        }
                        style={{ width: '100%' }}
                      />
                    )}
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
          <FormItem>
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ],
            })(<Input size="large" placeholder="验证码" />)}
          </FormItem>

          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              下一步
            </Button>
            <Link className={styles.login} to="/user/login">
              使用已有账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}
