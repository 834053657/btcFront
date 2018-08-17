import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Modal, Alert, Select, Row, Col } from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import { map } from 'lodash';
import ImageValidation from 'components/ImageValidation';
import styles from './ForgetPassword.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const msg = defineMessages({
  h_forget_pwd: {
    id: 'Register.h_forget_pwd',
    defaultMessage: '忘记密码',
  },

  choose_country: {
    id: 'Register.choose_country',
    defaultMessage: '请选择国家！',
  },

  choose_country_holder: {
    id: 'Register.choose_country_holder',
    defaultMessage: '请选择国家',
  },

  email_input: {
    id: 'Register.email_input',
    defaultMessage: '请输入邮箱！',
  },

  email_error: {
    id: 'Register.email_error',
    defaultMessage: '邮箱地址格式错误！',
  },

    phone_number: {
    id: 'Register.phone_number',
    defaultMessage: '请输入手机号码！',
  },

  email_holder: {
    id: 'Register.email_holder',
    defaultMessage: '请输入邮箱',
  },
    phone_2: {
    id: 'Register.phone_2',
    defaultMessage: '请输入正确的手机号码',
  },

  phone_3: {
    id: 'Register.phone_3',
    defaultMessage: '请输入手机号码',
  },

  get_code: {
    id: 'Register.get_code',
    defaultMessage: '获取验证码',
  },

  code_holder: {
    id: 'Register.code_holder',
    defaultMessage: '验证码',
  },
  code_input: {
    id: 'Register.code_input',
    defaultMessage: '请输入验证码！',
  },

  account_exit: {
    id: 'Register.account_exit',
    defaultMessage: '使用已有账户登录',
  },

  safe_G2: {
    id: 'Register.safe_G2',
    defaultMessage: '安全验证',
  },

  next_step: {
    id: 'Register.next_step',
    defaultMessage: '下一步',
  },
});
@injectIntl()
@connect(({ user, loading }) => ({
  submitting: loading.effects['user/submitForgetPassword'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    imageValidationVisible: false,
  };

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
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

  onGetCaptcha = (captcha, loadCaptcha) => {
    const { validateFields, getFieldValue } = this.props.form;
    const type = getFieldValue('type');
    const fieldsName = type === 'mail' ? ['mail', 'type'] : ['nation_code', 'phone', 'type'];

    validateFields(fieldsName, { force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'global/sendVerify',
          payload: {
            captcha,
            data: {
              ...values,
            },
            type: values.type,
            usage: 7,
          },
          callback: () => {
            let count = 59;
            this.setState({ count, imageValidationVisible: false });
            this.interval = setInterval(() => {
              count -= 1;
              this.setState({ count });
              if (count === 0) {
                clearInterval(this.interval);
              }
            }, 1000);
          },
          onError: () => {
            loadCaptcha && loadCaptcha();
          },
        });
      }
    });
  };

  handleSendCaptcha = () => {
    const { validateFields, getFieldValue } = this.props.form;
    const type = getFieldValue('type');
    const fieldsName = type === 'mail' ? ['mail', 'type'] : ['nation_code', 'phone', 'type'];

    validateFields(fieldsName, { force: true }, (err) => {
      if (!err) {
        this.setState({
          imageValidationVisible: true,
        });
      }
    });
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { count, imageValidationVisible } = this.state;
    return (
      <div className={styles.main}>
        <h3>{this.props.intl.formatMessage(msg.h_forget_pwd)}</h3>
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
                    message: this.props.intl.formatMessage(msg.choose_country),
                  },
                ],
              })(
                <Select size="large" placeholder={this.props.intl.formatMessage(msg.choose_country_holder)}>
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
                          message: this.props.intl.formatMessage(msg.email_input),
                        },
                        {
                          type: 'email',
                          message: this.props.intl.formatMessage(msg.email_error),
                        },
                      ],
                    })(<Input size="large" placeholder={this.props.intl.formatMessage(msg.email_holder)} />)
                  : getFieldDecorator('phone', {
                      rules: [
                        {
                          required: true,
                          message: this.props.intl.formatMessage(msg.phone_number),
                        },
                        {
                          pattern: /^[1-9]\d*$/,
                          message: this.props.intl.formatMessage(msg.phone_2),
                        },
                      ],
                    })(
                      <Input
                        placeholder={this.props.intl.formatMessage(msg.phone_3)}
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
                  {count ? `${count} s` : this.props.intl.formatMessage(msg.get_code)}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: this.props.intl.formatMessage(msg.code_input),
                },
              ],
            })(<Input size="large" placeholder={this.props.intl.formatMessage(msg.code_holder)} />)}
          </FormItem>

          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              {this.props.intl.formatMessage(msg.next_step)}
            </Button>
            <Link className={styles.login} to="/user/login">
              {this.props.intl.formatMessage(msg.account_exit)}
            </Link>
          </FormItem>
        </Form>

        <ImageValidation
          title={this.props.intl.formatMessage(msg.safe_G2)}
          onCancel={() => {
            this.setState({ imageValidationVisible: false });
          }}
          onSubmit={this.onGetCaptcha}
          visible={imageValidationVisible}
        />
      </div>
    );
  }
}
