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
import ImageValidation from 'components/ImageValidation';
import styles from './Register.less';
import { getCaptcha } from '../../services/api';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>{PROMPT('register.pwd_high')||'强度：强'}</div>,
  pass: <div className={styles.warning}>{PROMPT('register.pwd_middle')||'强度：中'}</div>,
  poor: <div className={styles.error}>{PROMPT('register.pwd_low')||'强度：太短'}</div>,
  noPass: <div className={styles.error}>{PROMPT('register.pwd_not_safe')||'强度：不安全'}</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
  noPass: 'exception',
};

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
      callback(PROMPT('register.pwd_not_match')||'两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const regex = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;

    if (!value) {
      this.setState({
        help: (PROMPT('register.pwd_input')||'请输入密码！'),
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

  render() {
    const { form, submitting, local = 'zh_CN' } = this.props;
    const { getFieldDecorator } = form;
    const { count, agree, imageValidationVisible, infoVisible } = this.state;
    return (
      <div className={styles.main}>
        <h3>{(PROMPT('register.title_sign_')||'注册')}</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: (PROMPT('register.email_input')||'请输入邮箱地址！'),
                },
                {
                  type: 'email',
                  message: (PROMPT('register.email_error')||'邮箱地址格式错误！'),
                },
              ],
            })(<Input size="large" placeholder={(PROMPT('register.email_')||'邮箱')} />)}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('verify_code', {
                  rules: [
                    {
                      required: true,
                      message: (PROMPT('register.code_input')||'请输入验证码！'),
                    },
                  ],
                })(<Input size="large" placeholder={(PROMPT('register.code_')||'验证码')} />)}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.showImageValidationModal}
                >
                  {count ? `${count} s` : (PROMPT('register.get_code')||'获取验证码')}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            {getFieldDecorator('nickname', {
              rules: [
                {
                  required: true,
                  message: (PROMPT('register.userName_input')||'请输入用户名！'),
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
                  message: (PROMPT('register.input_limit')||'用户名只能包含 2~20位的字母，数字，下划线，减号'),
                },
              ],
            })(<Input size="large" placeholder={(PROMPT('register.userName_limit')||'用户名 2-20位')} />)}
          </FormItem>
          <FormItem help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    {(PROMPT('register.pwd_limit')||'请输入6 ~ 16 个字母，数字组合字符。请不要使用容易被猜到的密码。')}
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
                    message: (PROMPT('register.num_letter_input')||'请输入6 ~ 16 位字母，数字组合。！'),
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  maxLength={16}
                  placeholder={(PROMPT('register.num_and_letter')||'6~16位字母数字组合,并区分大小写')}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: (PROMPT('register.pwd_again')||'请确认密码！'),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder={(PROMPT('register.pwd_again_input')||'确认密码')} />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('invite_code', {
              rules: [
                {
                  required: true,
                  message: (PROMPT('register.code_input_')||'请输入邀请码！'),

                },
              ],
            })(<Input size="large" placeholder={(PROMPT('register.code_input_holder')||'邀请码')} />)}
          </FormItem>

          <FormItem>
            <Checkbox checked={agree} onChange={this.changeAgree}>
              {(PROMPT('register.readAndAgree')||'我已阅读并同意')}
            </Checkbox>
            <a onClick={this.handleShowInfo.bind(this, 'agreement')}>《{(PROMPT('register.serve_rule')||'服务条款')}》</a>{' '}
            <a onClick={this.handleShowInfo.bind(this, 'duty')}>《{(PROMPT('register.liability_exemption')||'免责申明')}》</a>
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
              {(PROMPT('register.sign_in')||'注册')}
            </Button>
            <Link className={styles.login} to="/user/login">
              {(PROMPT('register.sign_in_use_own')||'使用已有账户登录')}
            </Link>
          </FormItem>
        </Form>
        <ImageValidation
          title={(PROMPT('register.safe_')||'安全验证')}
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
