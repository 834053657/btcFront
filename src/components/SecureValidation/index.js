import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Alert, Select, Row, Col } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import classNames from 'classnames';
import { map } from 'lodash';
import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

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
            {(PROMPT('secureValidation.btn_cancel')||'取消')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            htmlType="submit"
            onClick={this.handleSubmit}
          >
            {(PROMPT('secureValidation.btn_confirm')||'确定')}
          </Button>,
        ]}
      >
        <Alert
          showIcon
          className={styles.alert}
          message={(PROMPT('secureValidation.alert_safe')||'为保障您的账户安全，请进行身份验证。')}
          type="info"
        />
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={(PROMPT('secureValidation.verify_type')||'验证方式')} {...formItemLayout}>
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
              <FormItem {...formItemLayout} label={(PROMPT('secureValidation.country_')||'国家')}>
                {getFieldDecorator('nation_code', {
                  rules: [
                    {
                      required: true,
                      message: (PROMPT('secureValidation.country_choose')||'请选择国家！'),
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
              label={getFieldValue('type') === 'mail' ? (PROMPT('secureValidation.type_Email')||'邮箱') : (PROMPT('secureValidation.type_mobile')||'手机')}
            >
              <Row gutter={24}>
                <Col span={14}>
                  {getFieldValue('type') === 'mail'
                    ? getFieldDecorator('mail', {
                        rules: [
                          {
                            required: true,
                            message: (PROMPT('secureValidation.email_input')||'请输入邮箱！'),
                          },
                          {
                            type: 'email',
                            message: (PROMPT('secureValidation.error_email')||'邮箱地址格式错误！'),
                          },
                        ],
                      })(<Input size="large" placeholder={(PROMPT('secureValidation.email_holder')||'邮箱')} />)
                    : getFieldDecorator('phone', {
                        rules: [
                          {
                            required: true,
                            message: (PROMPT('secureValidation.mobile_input')||'请输入手机号码！'),
                          },
                          {
                            pattern: /^[1-9]\d*$/,
                            message: (PROMPT('secureValidation.mobile_input_right')||'请输入正确的手机号码'),
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
                    {count ? `${count} s` : (PROMPT('secureValidation.get_code')||'获取验证码')}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem label={(PROMPT('secureValidation.code')||'验证码')} {...formItemLayout}>
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: (PROMPT('secureValidation.code_input')||'请输入验证码！'),
                  },
                ],
              })(<Input size="large" placeholder={(PROMPT('secureValidation.code_holder')||'验证码')} />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(SecureValidation);
