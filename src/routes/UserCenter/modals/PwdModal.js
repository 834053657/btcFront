import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Divider } from 'antd';
import { delay } from 'lodash';
import G2Validation from 'components/G2Validation';
import PasswordForm from '../forms/PasswordForm';
import SecureValidationForm from '../forms/SecureValidationForm';
import styles from './EmailModal.less';

const { Step } = Steps;

export default class EmailModal extends Component {
  static defaultProps = {
    className: '',
    title: '修改密码',
    onCancel: () => {},
  };
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    onCancel: PropTypes.func,
  };

  state = {
    current: 0,
    updateKey: null,
    checkKey: null,
  };

  handleCheckSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'global/verifyCaptcha',
        payload: {
          ...values,
          usage: 8,
          verify_token: this.state.checkKey,
        },
        callback: (data = {}) => {
          this.setState({
            current: this.state.current + 1,
            updateKey: data.verify_token,
          });
        },
      });
    }
  };

  handleBindSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submitUpdatePassword',
        payload: {
          ...values,
          verify_token: this.state.updateKey,
        },
        callback: () => {
          // this.setState({
          //   current: this.state.current + 1,
          // });
          this.props.onCancel();
        },
      });
    }
  };

  handleSubmitG2 = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submit2Validate',
        payload: {
          code: values.code,
        },
        callback: (data = {}) => {
          this.setState({
            current: this.state.current + 1,
            checkKey: data.verify_token,
          });
        },
      });
    }
  };

  handleSendCaptcha = (values, callback) => {
    return this.props.dispatch({
      type: 'global/sendVerify',
      payload: {
        ...values,
        usage: 8, //  8：用户主动修改登录密码
      },
      callback,
    });
  };

  getSecureValidationData = user => {
    const { email, telephone, telephone_code } = user || {};
    const verify_data = {};

    if (email) {
      verify_data.mail = {
        text: `${CONFIG.verify_type.mail} ${email}`,
        data: {
          mail: email,
        },
      };
    }
    if (telephone && telephone_code) {
      verify_data.sms = {
        text: `${CONFIG.verify_type.sms}+${telephone_code}${telephone}`,
        data: {
          nation_code: telephone_code,
          phone: telephone,
        },
      };
    }

    return verify_data;
  };

  render() {
    const { className, form, submitting, visible, title, currentUser, onCancel } = this.props;
    const { user = {} } = currentUser || {};
    const { current } = this.state;
    const verify_data = this.getSecureValidationData(user);
    let steps = [
      {
        title: '谷歌验证',
        hide: !user.g2fa_on,
        component: (
          <G2Validation modal={false} onCancel={onCancel} onSubmit={this.handleSubmitG2} />
        ),
      },
      {
        title: '安全验证',
        hide: !user.email,
        component: (
          <SecureValidationForm
            verify_data={verify_data}
            onGetCaptcha={this.handleSendCaptcha}
            onCancel={onCancel}
            onSubmit={this.handleCheckSubmit}
          />
        ),
      },
      {
        title: '修改密码',
        component: <PasswordForm onCancel={onCancel} onSubmit={this.handleBindSubmit} />,
      },
      {
        title: '完成',
      },
    ];

    steps = steps.filter(item => !item.hide);

    console.log(this.state);

    return (
      <Modal
        width={500}
        title={title}
        visible={visible}
        onCancel={onCancel}
        maskClosable={false}
        footer={null}
      >
        <Steps current={current} className={styles.steps}>
          {steps.map(item => {
            return !item.hide ? <Step key={item.title} title={item.title} /> : null;
          })}
        </Steps>
        <Divider />
        {steps[current] && steps[current].component}
      </Modal>
    );
  }
}
