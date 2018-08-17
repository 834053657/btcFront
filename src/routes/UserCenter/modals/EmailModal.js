import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Divider } from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import { delay } from 'lodash';
import G2Validation from 'components/G2Validation';
import CheckEmailForm from '../forms/EmailForm';
import styles from './EmailModal.less';

const { Step } = Steps;
const msg = defineMessages({
  user_email_bind: {
    id: 'EmailModal.user_email_bind',
    defaultMessage: '邮箱绑定',
  },
  G2_approve: {
    id: 'EmailModal.G2_approve',
    defaultMessage: '谷歌验证',
  },
  old_email_approve: {
    id: 'EmailModal.old_email_approve',
    defaultMessage: '验证旧邮箱',
  },
  new_email_bind: {
    id: 'EmailModal.new_email_bind',
    defaultMessage: '绑定新邮箱',
  },
  bind_finish: {
    id: 'EmailModal.bind_finish',
    defaultMessage: '完成',
  },
});
@injectIntl()
export default class EmailModal extends Component {
  static defaultProps = {
    className: '',
    // title: this.props.intl.formatMessage(msg.user_email_bind),
    onCancel: () => {},
  };
  static propTypes = {
    // title: PropTypes.string,
    className: PropTypes.string,
    onCancel: PropTypes.func,
  };

  state = {
    current: 0,
    updateKey: null,
    checkKey: null,
  };

  handleCheckSubmit = (err, { email, captcha }) => {
    if (!err) {
      this.props.dispatch({
        type: 'global/verifyCaptcha',
        payload: {
          data: {
            mail: email,
          },
          type: 'mail',
          code: captcha,
          usage: 2,
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

  handleBindSubmit = (err, { captcha: code, email }) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submitChangeEmail',
        payload: {
          email,
          code,
          verify_token: this.state.updateKey,
        },
        callback: () => {
          // this.setState({
          //   current: this.state.current + 1,
          // });
          // delay(this.props.onCancel, 1000);
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
          usage: 1,
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
    const { className, form, submitting, visible, title, currentUser, onCancel } = this.props;
    const { user = {} } = currentUser || {};
    const { current } = this.state;
    let steps = [
      {
        title: this.props.intl.formatMessage(msg.G2_approve),
        hide: !user.g2fa_on,
        component: (
          <G2Validation modal={false} onCancel={onCancel} onSubmit={this.handleSubmitG2} />
        ),
      },
      {
        title: this.props.intl.formatMessage(msg.old_email_approve),
        hide: !user.email,
        component: (
          <CheckEmailForm
            key="1"
            onGetCaptcha={this.handleSendCaptcha.bind(this, 2)}
            initialValue={user}
            disabled
            onSubmit={this.handleCheckSubmit}
            onCancel={onCancel}
          />
        ),
      },
      {
        title: this.props.intl.formatMessage(msg.new_email_bind),
        component: (
          <CheckEmailForm
            key="2"
            onGetCaptcha={this.handleSendCaptcha.bind(this, 3)}
            onSubmit={this.handleBindSubmit}
            onCancel={onCancel}
          />
        ),
      },
      {
        title:  this.props.intl.formatMessage(msg.bind_finish),
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
