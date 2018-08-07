import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

import classNames from 'classnames';
import { map } from 'lodash';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;

class ConfirmModal extends Component {
  static defaultProps = {
    className: '',
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {};

  componentDidMount() {}

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      this.props.onSubmit(err, values);
    });
  };
  render() {
    const { className, form, submitting, visible, title } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        width={460}
        destroyOnClose
        title={title}
        visible={visible}
        maskClosable={false}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            <FM id='index.cancel' defaultMessage='取消' />
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            htmlType="submit"
            onClick={this.handleSubmit}
          >
            <FM id='index.submit' defaultMessage='确定' />
          </Button>,
        ]}
      >
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem>
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: <FM id='index.input_reason' defaultMessage='请填写原因' />,
                  },
                ],
              })(<TextArea rows={6} placeholder={(PROMPT('index.please_input')||'请填写原因')} />)}
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(ConfirmModal);
