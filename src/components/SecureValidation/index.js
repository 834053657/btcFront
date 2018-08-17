import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Alert, Select, Row, Col } from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import classNames from 'classnames';
import { map } from 'lodash';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const msg = defineMessages({
  btn_cancel: {
    id: 'secureValidation.btn_cancel',
    defaultMessage: '取消',
  },
  //
  btn_confirm: {
    id: 'secureValidation.btn_confirm',
    defaultMessage: '确定',
  },
  alert_safe: {
    id: 'secureValidation.alert_safe',
    defaultMessage: '为保障您的账户安全，请进行身份验证。',
  },
  verify_type: {
    id: 'secureValidation.verify_type',
    defaultMessage: '验证方式',
  },
  country: {
    id: 'secureValidation.country',
    defaultMessage: '国家',
  },
  country_choose: {
    id: 'secureValidation.country_choose',
    defaultMessage: '请选择国家！',
  },
  type_Email: {
    id: 'secureValidation.type_Email',
    defaultMessage: '邮箱',
  },
  type_mobile: {
    id: 'secureValidation.type_mobile',
    defaultMessage: '手机',
  },
  email_input: {
    id: 'secureValidation.email_input',
    defaultMessage: '请输入邮箱！',
  },
  error_email: {
    id: 'secureValidation.error_email',
    defaultMessage: '邮箱地址格式错误！',
  },
  email_holder: {
    id: 'secureValidation.email_holder',
    defaultMessage: '邮箱',
  },
  mobile_input: {
    id: 'secureValidation.mobile_input',
    defaultMessage: '请输入手机号码！',
  },
  mobile_input_right: {
    id: 'secureValidation.mobile_input_right',
    defaultMessage: '请输入正确的手机号码',
  },
  get_code: {
    id: 'secureValidation.get_code',
    defaultMessage: '获取验证码',
  },
  code: {
    id: 'secureValidation.code',
    defaultMessage: '验证码',
  },
  code_input: {
    id: 'secureValidation.code_input',
    defaultMessage: '请输入验证码！',
  },
  code_holder: {
    id: 'secureValidation.code_holder',
    defaultMessage: '验证码',
  },
});
@injectIntl()
class SecureValidation extends Component {
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
    const type = getFieldValue('type');
    const fieldsName = type === 'mail' ? ['mail', 'type'] : ['nation_code', 'phone', 'type'];

    validateFields(fieldsName, { force: true }, (err, values) => {
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
            {this.props.intl.formatMessage(msg.btn_cancel)}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            htmlType="submit"
            onClick={this.handleSubmit}
          >
            {this.props.intl.formatMessage(msg.btn_confirm)}
          </Button>,
        ]}
      >
        <Alert
          showIcon
          className={styles.alert}
          message={this.props.intl.formatMessage(msg.alert_safe)}
          type="info"
        />
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={this.props.intl.formatMessage(msg.verify_type)} {...formItemLayout}>
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
              <FormItem {...formItemLayout} label={this.props.intl.formatMessage(msg.country)}>
                {getFieldDecorator('nation_code', {
                  rules: [
                    {
                      required: true,
                      message: this.props.intl.formatMessage(msg.country_choose),
                    },
                  ],
                })(
                  <Select size="large">
                    {CONFIG.country.map(item => (
                      <Option key={item.code} value={item.nation_code}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            )}
            <FormItem
              {...formItemLayout}
              label={getFieldValue('type') === 'mail' ? this.props.intl.formatMessage(msg.type_Email) : this.props.intl.formatMessage(msg.type_mobile)}
            >
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
                            message: this.props.intl.formatMessage(msg.error_email),
                          },
                        ],
                      })(<Input size="large" placeholder={this.props.intl.formatMessage(msg.email_holder)} />)
                    : getFieldDecorator('phone', {
                        rules: [
                          {
                            required: true,
                            message: this.props.intl.formatMessage(msg.mobile_input),
                          },
                          {
                            pattern: /^[1-9]\d*$/,
                            message: this.props.intl.formatMessage(msg.mobile_input_right),
                          },
                        ],
                      })(
                        <Input
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
            <FormItem label={this.props.intl.formatMessage(msg.code)} {...formItemLayout}>
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: this.props.intl.formatMessage(msg.code_input),
                  },
                ],
              })(<Input size="large" placeholder={this.props.intl.formatMessage(msg.code_holder)} />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(SecureValidation);
