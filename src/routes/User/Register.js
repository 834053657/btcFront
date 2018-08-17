import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Popover,
  Progress,
  message,
  Checkbox,
  Modal,
} from 'antd';
import { defineMessages } from 'react-intl';
import ImageValidation from 'components/ImageValidation';
import { injectIntl } from 'components/_utils/decorator';
import styles from './Register.less';
import { getCaptcha } from '../../services/api';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const msg = defineMessages({
  pwd_high:{
    id:"register.pwd_high",
    defaultMessage:"强度：强"
  },

  pwd_middle:{
    id:"register.pwd_middle",
    defaultMessage:"强度：中"
  },

  pwd_low:{
    id:"register.pwd_low",
    defaultMessage:"强度：太短"
  },

  pwd_not_safe:{
    id:"register.pwd_not_safe",
    defaultMessage:"强度：不安全"
  },

  title_sign_:{
    id:"register.title_sign_",
    defaultMessage:"注册"
  },

  pwd_not_match:{
    id:"register.pwd_not_match",
    defaultMessage:"两次输入的密码不匹配!"
  },
  pwd_input:{
    id:"register.pwd_input",
    defaultMessage:"请输入密码！"
  },
  email_input:{
    id:"register.email_input",
    defaultMessage:"请输入邮箱地址！"
  },
  email_error:{
    id:"register.email_error",
    defaultMessage:"邮箱地址格式错误！"
  },
  email:{
    id:"register.email",
    defaultMessage:"邮箱"
  },
  code_input:{
    id:"register.code_input",
    defaultMessage:"请输入验证码！"
  },
  code:{
    id:"register.code",
    defaultMessage:"验证码"
  },
  get_code:{
    id:"register.get_code",
    defaultMessage:"获取验证码"
  },
  userName_input:{
    id:"register.userName_input",
    defaultMessage:"请输入用户名！"
  },
  input_limit:{
    id:"register.input_limit",
    defaultMessage:"用户名只能包含 2~20位的字母，数字，下划线，减号"
  },
  userName_limit:{
    id:"register.userName_limit",
    defaultMessage:"用户名 2-20位"
  },
  pwd_limit:{
    id:"register.pwd_limit",
    defaultMessage:"请输入6 ~ 16 个字母，数字组合字符。请不要使用容易被猜到的密码。"
  },
  num_letter_input:{
    id:"register.num_letter_input",
    defaultMessage:"请输入6 ~ 16 位字母，数字组合。！"
  },
  num_and_letter:{
    id:"register.num_and_letter",
    defaultMessage:"6~16位字母数字组合,并区分大小写"
  },
  pwd_again:{
    id:"register.pwd_again",
    defaultMessage:"请确认密码！"
  },
  pwd_again_input:{
    id:"register.pwd_again_input",
    defaultMessage:"确认密码"
  },
  code_input_holder:{
    id:"register.code_input_holder",
    defaultMessage:"邀请码"
  },
  serve_rule:{
    id:"register.serve_rule",
    defaultMessage:"服务条款"
  },
  readAndAgree:{
    id:"register.readAndAgree",
    defaultMessage:"我已阅读并同意"
  },
  liability_exemption:{
    id:"register.liability_exemption",
    defaultMessage:"免责申明"
  },
  sign_in:{
    id:"register.sign_in",
    defaultMessage:"注册"
  },
  sign_in_use_own:{
    id:"register.sign_in_use_own",
    defaultMessage:"使用已有账户登录"
  },
  safe:{
    id:"register.safe",
    defaultMessage:"安全验证"
  },


})



const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
  noPass: 'exception',
};



@injectIntl()
@connect(({ register, global, loading }) => ({
  local: global.local,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    agree: false,
    count: 0,
    confirmDirty: false,
    visible: false,
    imageValidationVisible: false,
    help: '',
    image: '',
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  showImageValidationModal = () => {
    this.props.form.validateFieldsAndScroll(['email'], {}, (err, values) => {
      if (!err) {
        this.setState({
          imageValidationVisible: true,
        });
      }
    });
  };

  onGetCaptcha = (captcha, loadCaptcha) => {
    const { form } = this.props;
    const mail = form.getFieldValue('email');
    this.props.dispatch({
      type: 'register/sendVerify',
      payload: {
        captcha,
        data: {
          mail,
        },
        type: 'mail',
        usage: 1,
      },
      callback: res => {
        if (res.code === 0) {
          let count = 59;
          this.setState({ count, imageValidationVisible: false });
          this.interval = setInterval(() => {
            count -= 1;
            this.setState({ count });
            if (count === 0) {
              clearInterval(this.interval);
            }
          }, 1000);
        } else {
          loadCaptcha();
          message.error(res.msg);
        }
      },
    });
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
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'register/submit',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(this.props.intl.formatMessage(msg.pwd_not_match));
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;

    if (!value) {
      this.setState({
        help: (this.props.intl.formatMessage(msg.pwd_input)),
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

  loadCaptcha = async () => {
    const params = {
      r: Math.random(),
      usage: 'login',
    };
    const res = await getCaptcha(params);
    if (res.data) {
      this.setState({
        image: res.data.img,
      });
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

  changeAgree = e => {
    const value = e.target.checked;

    this.setState({
      agree: value,
    });
  };

  hideModal = () => {
    this.setState({
      infoVisible: false,
    });
  };

  handleShowInfo = type => {
    this.props.dispatch({
      type: 'global/getArticle',
      payload: {
        type,
        local: this.props.local,
      },
      callback: content => {
        this.setState({
          infoVisible: {
            title: CONFIG.articleList[type],
            content,
          },
        });
      },
    });
  };

  passwordStatusMap = {
    ok: <div className={styles.success}>{this.props.intl.formatMessage(msg.pwd_high)}</div>,
    pass: <div className={styles.warning}>{this.props.intl.formatMessage(msg.pwd_middle)}</div>,
    poor: <div className={styles.error}>{this.props.intl.formatMessage(msg.pwd_low)}</div>,
    noPass: <div className={styles.error}>{this.props.intl.formatMessage(msg.pwd_not_safe)}</div>,
  };

  render() {
    const { form, submitting, local = 'zh_CN' } = this.props;
    const { getFieldDecorator } = form;
    const { count, agree, imageValidationVisible, infoVisible } = this.state;
    return (
      <div className={styles.main}>
        <h3>this.props.intl.formatMessage(msg.title_sign_)</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: (this.props.intl.formatMessage(msg.email_input)),
                },
                {
                  type: 'email',
                  message: (this.props.intl.formatMessage(msg.email_error)),
                },
              ],
            })(<Input size="large" placeholder={this.props.intl.formatMessage(msg.email)} />)}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('verify_code', {
                  rules: [
                    {
                      required: true,
                      message: (this.props.intl.formatMessage(msg.code_input)),
                    },
                  ],
                })(<Input size="large" placeholder={this.props.intl.formatMessage(msg.code)} />)}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.showImageValidationModal}
                >
                  {count ? `${count} s` : this.props.intl.formatMessage(msg.get_code)}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            {getFieldDecorator('nickname', {
              rules: [
                {
                  required: true,
                  message: (this.props.intl.formatMessage(msg.userName_input)),
                },
                // {
                //   min: 2,
                //   message: '请输入至少2位字符！',
                // },
                // {
                //   max: 20,
                //   message: '请输入最多20位字符！',
                // },
                {
                  // pattern: /^[\u4E00-\u9FA5_a-zA-Z0-9/-]{2,20}$/,
                  pattern: /^[a-zA-Z0-9_-]{2,20}$/,
                  message: (this.props.intl.formatMessage(msg.input_limit)),
                },
              ],
            })(<Input size="large" placeholder={this.props.intl.formatMessage(msg.userName_limit)} />)}
          </FormItem>
          <FormItem help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {this.passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    {this.props.intl.formatMessage(msg.pwd_limit)}
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
                    validator: this.checkPassword,
                  },
                  {
                    min: 6,
                    message: this.props.intl.formatMessage(msg.num_letter_input),
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  maxLength={16}
                  placeholder={this.props.intl.formatMessage(msg.num_and_letter)}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: this.props.intl.formatMessage(msg.pwd_again),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder={this.props.intl.formatMessage(msg.pwd_again_input)} />) }
          </FormItem>
          <FormItem>
            {getFieldDecorator('invite_code', {
              rules: [
                {
                  required: true,
                  message: this.props.intl.formatMessage(msg.code_input),

                },
              ],
            })(<Input size="large" placeholder={this.props.intl.formatMessage(msg.code_input_holder)} />)}
          </FormItem>

          <FormItem>
            <Checkbox checked={agree} onChange={this.changeAgree}>
              {this.props.intl.formatMessage(msg.readAndAgree)}
            </Checkbox>
            <a onClick={this.handleShowInfo.bind(this, 'agreement')}>《{this.props.intl.formatMessage(msg.serve_rule)}》</a>{' '}
            <a onClick={this.handleShowInfo.bind(this, 'duty')}>《{this.props.intl.formatMessage(msg.liability_exemption)}》</a>
          </FormItem>

          <FormItem>
            <Button
              size="large"
              disabled={!agree}
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              {this.props.intl.formatMessage(msg.sign_in)}
            </Button>
            <Link className={styles.login} to="/user/login">
              {this.props.intl.formatMessage(msg.sign_in_use_own)}
            </Link>
          </FormItem>
        </Form>
        <ImageValidation
          title={this.props.intl.formatMessage(msg.safe)}
          onCancel={() => {
            this.setState({ imageValidationVisible: false });
          }}
          onSubmit={this.onGetCaptcha}
          visible={imageValidationVisible}
        />

        {!!infoVisible && (
          <Modal
            destroyOnClose
            visible
            zIndex={1032}
            maskClosable={false}
            title={infoVisible.title}
            onOk={this.hideModal}
            onCancel={this.hideModal}
          >
            <div
              className={styles.info_content}
              dangerouslySetInnerHTML={{ __html: infoVisible.content }}
            />
          </Modal>
        )}
      </div>
    );
  }
}
