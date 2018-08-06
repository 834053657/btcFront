import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Divider } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { delay, map } from 'lodash';
import PayMethodForm from '../forms/PayMethodForm';
import styles from './EmailModal.less';

const { Step } = Steps;

export default class MobileModal extends Component {
  static defaultProps = {
    title: (PROMPT('payMethodModal.add_pay_method')||'添加支付方式'),
    onCancel: () => {},
  };
  static propTypes = {
    title: PropTypes.string,
    onCancel: PropTypes.func,
  };

  state = {};

  handleSubmit = values => {
    this.props.dispatch({
      type: 'user/submitUserPayMethod',
      payload: {
        ...values,
        id: this.props.data.id,
      },
      callback: this.props.onCancel,
    });
  };

  render() {
    const { title, data, onCancel, payMents = [] } = this.props;

    return (
      <Modal
        width={500}
        title={title}
        visible={!!data}
        onCancel={onCancel}
        maskClosable={false}
        footer={null}
      >
        {!!data && (
          <PayMethodForm
            payMents={payMents}
            initialValues={data}
            onSubmit={this.handleSubmit}
            onCancel={onCancel}
          />
        )}
      </Modal>
    );
  }
}
