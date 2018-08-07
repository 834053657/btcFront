import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Divider } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { delay } from 'lodash';
import G2Validation from 'components/G2Validation';
import MobileForm from '../forms/MobileForm';
import styles from './EmailModal.less';

const { Step } = Steps;

export default class MobileModal extends Component {
  static defaultProps = {
    className: '',
    title: (PROMPT('mobileModal.phone_bind')||'手机绑定'),
    onCancel: () => {},
  };
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    onCancel: PropTypes.func,
  };

  state = {
    current: 0,
    verify_token: null,
    checkKey: null,
  };

  handleCheckSubmit = ({ code, nation_code, phone }) => {
    this.props.dispatch({
      type: 'global/verifyCaptcha',
      payload: {
        data: {
          nation_code,
          phone,
        },
        type: 'sms',
        code,
        usage: 4,
        verify_token: this.state.checkKey,
      },
      callback: data => {
        this.setState({
          verify_token: data.verify_token,
          current: this.state.current + 1,
        });
      },
    });
  };

  handleBindSubmit = values => {
    // this.setState({
    //   current: this.state.current + 1,
    // });
    // delay(this.props.onCancel, 1000);
    this.props.dispatch({
      type: 'user/submitChangeMobile',
      payload: {
        ...values,
        verify_token: this.state.verify_token,
      },
      callback: () => {
        // this.setState({
        //   current: this.state.current + 1,
        // });
        this.props.onCancel();
        // delay(this.props.onCancel, 1000);
      },
    });
  };

  handleSubmitG2 = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submit2Validate',
        payload: {
          usage: 2,
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

  handleSendCaptcha = (usage, { nation_code, telephone: phone }, callback) => {
    return this.props.dispatch({
      type: 'global/sendVerify',
      payload: {
        type: 'sms',
        usage,
        data: {
          nation_code,
          phone,
        },
      },
      callback,
    });
  };

  render() {
    const { className, form, submitting, visible, title, currentUser, onCancel } = this.props;
    const { user = {} } = currentUser || {};
    const { current } = this.state;
    let steps = [
      {
        title: (PROMPT('mobileModal.google_code_title')||'谷歌验证'),
        hide: !user.g2fa_on,
        component: (
          <G2Validation modal={false} onCancel={onCancel} onSubmit={this.handleSubmitG2} />
        ),
      },
      {
        title: (PROMPT('mobileModal.old_phone_verify')||'验证旧手机'),
        hide: !user.telephone,
        component: (
          <MobileForm
            key="1"
            onGetCaptcha={this.handleSendCaptcha.bind(this, 4)}
            initialValue={user}
            disabled
            onSubmit={this.handleCheckSubmit}
            onCancel={onCancel}
          />
        ),
      },
      {
        title: (PROMPT('mobileModal.new_phone_bind')||'绑定新手机'),
        component: (
          <MobileForm
            key="2"
            onGetCaptcha={this.handleSendCaptcha.bind(this, 5)}
            onSubmit={this.handleBindSubmit}
            onCancel={onCancel}
          />
        ),
      },
      {
        title: (PROMPT('mobileModal.bind_finish')||'完成'),
      },
    ];

    steps = steps.filter(item => !item.hide);

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
