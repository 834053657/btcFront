import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import classNames from 'classnames';
import styles from './index.less';

const FormItem = Form.Item;

class G2Validation extends Component {
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
    const { className, form, submitting, visible, title, modal=true } = this.props;
    const { getFieldDecorator } = form;

    if(modal) {
      return (
        <Modal
          width={360}
          title={title}
          visible={visible}
          maskClosable={false}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              <FM id='G2Index.btn_cancel' defaultMessage='取消' />
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={submitting}
              htmlType="submit"
              onClick={this.handleSubmit}
            >
              <FM id='G2Index.btn_confirm' defaultMessage='确定' />
            </Button>,
          ]}
        >
          <div className={classNames(className, styles.login)}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem>
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: <FM id='G2Index.google_code_please' defaultMessage='请输入谷歌验证码！' />,
                    },
                  ],
                })(<Input size="large" placeholder={(PROMPT('G2Index.google_code_holder')||'谷歌验证码')} />)}
              </FormItem>
            </Form>
          </div>
        </Modal>
      );
    }else {
      return (
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: <FM id='G2Index.google_code_input' defaultMessage='请输入谷歌验证码！' />,
                  },
                ],
              })(<Input size="large" placeholder={(PROMPT('G2Index.google_code_holder')||'谷歌验证码')} />)}
            </FormItem>

            <FormItem className={styles.buttonBox}>
              <Button className={styles.cancel} onClick={this.handleCancel}>
                <FM id='G2Index.btn_cancel_' defaultMessage='取消' />
              </Button>
              <Button
                key="submit"
                type="primary"
                loading={submitting}
                htmlType="submit"
                onClick={this.handleSubmit}
              >
                <FM id='G2Index.btn_confirm_' defaultMessage='确定' />
              </Button>
            </FormItem>
          </Form>
        </div>
      )
    }


  }
}

export default Form.create()(G2Validation);
