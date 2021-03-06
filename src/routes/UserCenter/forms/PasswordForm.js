import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form, Input, Button, Popover, Progress } from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import styles from './PasswordForm.less';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
  noPass: <div className={styles.error}>强度：不安全</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
  noPass: 'exception',
};
const msg = defineMessages({
  old_pwd_holder: {
    id: 'passWordForm.old_pwd_holder',
    defaultMessage: '旧密码',
  },
  pwd_limit_holder: {
    id: 'pwd_limit_holder',
    defaultMessage: '6~16位字母数字组合,并区分大小写',
  },
  confirm_pwd_holder: {
    id: 'passWordForm.confirm_pwd_holder',
    defaultMessage: '确认密码',
  },
  
});
@injectIntl()

@connect(({ user, loading }) => ({
  result: user.changePassword.result,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class PasswordForm extends Component {
  static defaultProps = {
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };
  state = {
    confirmDirty: false,
    visible: false,
    help: '',
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    if (!regex.test(value)) {
      return 'noPass';
    }
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, this.props.onSubmit);
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(<FM id='passWordForm.error' defaultMessage='两次输入的密码不匹配!' />);
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
    if (!value) {
      this.setState({
        help: <FM id='passWordForm.input_pwd' defaultMessage='请输入密码！' />,
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6 || !regex.test(value)) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  render() {
    const { form, submitting } = this.props;
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
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label={<FM id='passWordForm.old_pwd' defaultMessage='旧密码' />}>
            {getFieldDecorator('old_password', {
              rules: [
                {
                  required: true,
                  message: <FM id='passWordForm.old_pwd_again' defaultMessage='请输入旧密码！' />,
                },
              ],
            })(<Input size="large" type="password" placeholder={this.props.intl.formatMessage(msg.old_pwd_holder)} />)}
          </FormItem>
          <FormItem {...formItemLayout} label={<FM id='passWordForm.new_pwd' defaultMessage='新密码' />} help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FM id='passWordForm.tip_new_pwd' defaultMessage='请输入6 ~ 16 个字母，数字组合字符。请不要使用容易被猜到的密码。' />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: <FM id='passWordForm.new_pwd_again' defaultMessage='请输入新密码！' />,
                  },
                  {
                    min: 6,
                    message: <FM id='passWordForm.pwd_limit' defaultMessage='请输入6 ~ 16 位字母，数字组合。！' />,
                  },
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  maxLength={16}
                  placeholder={this.props.intl.formatMessage(msg.pwd_limit_holder)}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem {...formItemLayout} label={<FM id='passWordForm.confirm_pwd' defaultMessage='确认密码' />}>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: <FM id='passWordForm.confirm_pwd_again' defaultMessage='请确认密码！' />,
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder={this.props.intl.formatMessage(msg.confirm_pwd_holder)} />)}
          </FormItem>

          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              <FM id='passWordForm.btn_cancel' defaultMessage='取消' />
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              <FM id='passWordForm.btn_next_step' defaultMessage='下一步' />
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
