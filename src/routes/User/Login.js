import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import { FormattedMessage as FM,defineMessages } from 'react-intl';
import { injectIntl } from 'components/_utils/decorator';
import { stringify } from 'qs';
import Login from 'components/Login';
import G2Validation from 'components/G2Validation';
import SecureValidation from 'components/SecureValidation';

import { getCaptcha } from '../../services/api';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, ImgCaptcha, Submit } = Login;

const msg = defineMessages({
  login_in_title:{
    id:"login.login_in_title",
    defaultMessage:"登录"
  },
  userName_email_mobile:{
    id:"login.userName_email_mobile",
    defaultMessage:"用户名/邮箱/手机号"
  },
    pwd_holder:{
    id:"login.pwd_holder",
    defaultMessage:"密码"
  },
  forget_pwd:{
    id:"login.forget_pwd",
    defaultMessage:"忘记密码"
  },
  pwd_code:{
    id:"login.pwd_code",
    defaultMessage:"验证码"
  },
  sign_in_account:{
    id:"login.sign_in_account",
    defaultMessage:"注册账户"
  },
  safe_G2:{
    id:"login.safe_G2",
    defaultMessage:"安全验证"
  },
  personal_verify:{
    id:"login.personal_verify",
    defaultMessage:"身份验证"
  },
})

@injectIntl()
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    image: '',
  };

  componentDidMount() {
    this.loadCaptcha();
  }

  handleSubmit = async (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
        callback: res => {
          if (res.code !== 0 && res.code < 1000) {
            this.loadCaptcha();
          }
        },
      });
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

  // changeAutoLogin = e => {
  //   this.setState({
  //     autoLogin: e.target.checked,
  //   });
  // };

  handleSubmitG2 = (err, values) => {
    const { loginInfo } = this.props.login;

    this.props.dispatch({
      type: 'login/login',
      payload: {
        ...loginInfo,
        g2fa_code: values.code,
      },
    });
  };

  handleCancel = () => {
    this.props.dispatch({
      type: 'login/changeLoginStatus',
      payload: {
        g2Visible: false,
      },
    });
  };

  handleSubmitSecure = (err, values) => {
    const { loginInfo } = this.props.login;
    this.props.dispatch({
      type: 'login/login',
      payload: {
        ...loginInfo,
        secure_code: values.code,
      },
    });
  };

  handleCancelSecure = () => {
    this.props.dispatch({
      type: 'login/changeLoginStatus',
      payload: {
        secureVisible: false,
      },
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  handleSendCaptcha = (values, callback) => {
    const { loginInfo } = this.props.login;
    return this.props.dispatch({
      type: 'global/sendVerify',
      payload: {
        data: {
          ...values,
          username: loginInfo.account,
        },
        type: values.type,
        usage: 6,
      },
      callback,
    });
  };

  render() {
    const { login, submitting } = this.props;
    const { image } = this.state;

    return (
      <div className={styles.main}>
        <h3>{this.props.intl.formatMessage(msg.login_in_title)}</h3>
        <Login onSubmit={this.handleSubmit}>
          {login.error && this.renderMessage(login.error)}
          <UserName name="account" placeholder={this.props.intl.formatMessage(msg.userName_email_mobile)} />
          <Password name="password" placeholder={this.props.intl.formatMessage(msg.pwd_holder)}  />
          <ImgCaptcha
            name="captcha"
            placeholder={this.props.intl.formatMessage(msg.pwd_code)}
            image={image}
            loadCaptcha={this.loadCaptcha}
          />
          <Submit loading={submitting}>{this.props.intl.formatMessage(msg.login_in_title)}</Submit>
          <div className={styles.other}>
            <Link to="/user/forget-password">{this.props.intl.formatMessage(msg.forget_pwd)}</Link>
            <Link className={styles.register} to="/user/register">
              {this.props.intl.formatMessage(msg.sign_in_account)}
            </Link>
          </div>
        </Login>

        <G2Validation
          title={this.props.intl.formatMessage(msg.safe_G2)}
          visible={login.g2Visible}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmitG2}
        />
        <SecureValidation
          title={this.props.intl.formatMessage(msg.personal_verify)}
          visible={login.secureVisible}
          onGetCaptcha={this.handleSendCaptcha}
          onCancel={this.handleCancelSecure}
          onSubmit={this.handleSubmitSecure}
        />
      </div>
    );
  }
}
