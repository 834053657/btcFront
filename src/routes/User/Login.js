import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { stringify } from 'qs';
import Login from 'components/Login';
import G2Validation from 'components/G2Validation';
import SecureValidation from 'components/SecureValidation';
import { getCaptcha } from '../../services/api';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, ImgCaptcha, Submit } = Login;

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
        <h3>{(PROMPT('login.login_in_title')||'登录')}</h3>
        <Login onSubmit={this.handleSubmit}>
          {login.error && this.renderMessage(login.error)}
          <UserName name="account" placeholder={(PROMPT('login.userName_email_mobile')||'用户名/邮箱/手机号')} />
          <Password name="password" placeholder={(PROMPT('login.pwd_holder')||'密码')}  />
          <ImgCaptcha
            name="captcha"
            placeholder={(PROMPT('login.pwd_code')||'验证码')}
            image={image}
            loadCaptcha={this.loadCaptcha}
          />
          <Submit loading={submitting}>{(PROMPT('login.login_in_title')||'登录')}</Submit>
          <div className={styles.other}>
            <Link to="/user/forget-password">{(PROMPT('login.forget_pwd')||'忘记密码')}</Link>
            <Link className={styles.register} to="/user/register">
              {(PROMPT('login.sign_in_account')||'注册账户')}
            </Link>
          </div>
        </Login>

        <G2Validation
          title={(PROMPT('login.safe_G2')||'安全验证')}
          visible={login.g2Visible}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmitG2}
        />
        <SecureValidation
          title={(PROMPT('login.personal_verify')||'身份验证')}
          visible={login.secureVisible}
          onGetCaptcha={this.handleSendCaptcha}
          onCancel={this.handleCancelSecure}
          onSubmit={this.handleSubmitSecure}
        />
      </div>
    );
  }
}
