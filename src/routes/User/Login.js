import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
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

  handleSendCaptcha = (usage = 2, { email }, callback) => {
    return this.props.dispatch({
      type: 'global/sendVerify',
      payload: {
        data: {
          mail: email,
        },
        type: 'mail',
        usage,
      },
      callback,
    });
  };


  render() {
    const { login, submitting } = this.props;
    const { image } = this.state;

    return (
      <div className={styles.main}>
        <h3>登录</h3>
        <Login onSubmit={this.handleSubmit}>
          {login.error && this.renderMessage(login.error)}
          <UserName name="account" placeholder="用户名或邮箱" />
          <Password name="password" placeholder="密码" />
          <ImgCaptcha
            name="captcha"
            placeholder="验证码"
            image={image}
            loadCaptcha={this.loadCaptcha}
          />
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link to="/user/forget-password">忘记密码?</Link>
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </Login>

        <G2Validation
          title="安全验证"
          visible={login.g2Visible}
          onCancel={this.handleCancel}
          onSubmit={this.handleSubmitG2}
        />
        <SecureValidation
          title="身份验证"
          visible={login.secureVisible}
          onGetCaptcha={this.handleSendCaptcha}
          onCancel={this.handleCancelSecure}
          onSubmit={this.handleSubmitSecure}
        />
      </div>
    );
  }
}
