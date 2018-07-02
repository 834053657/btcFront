import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Divider, Form, Input, Button } from 'antd';
import { delay } from 'lodash';
import styles from './TermsModal.less';

const FormItem = Form.Item;
const { TextArea } = Input;
@Form.create()
export default class TermsModal extends Component {
  static defaultProps = {
    className: '',
    title: '交易条款',
    onCancel: () => {},
  };
  static propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    onCancel: PropTypes.func,
  };

  handleSubmit = e => {
    const { action } = this.props;
    const id = action !== '_NEW' ? this.props.terms.id : null;

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        this.props.dispatch({
          type: 'ad/saveTerms',
          payload: {
            id,
            title: values.title,
            content: values.content,
          },
          callback: this.props.onOK,
        });
      }
    });
  };

  handleOk = e => {
    console.log(e);
    this.handleSubmit(e);
  };

  render() {
    const { className, form, submitting, visible, title, onCancel, action, terms } = this.props;
    const { getFieldDecorator } = this.props.form;

    let modalTitle = action === '_NEW' ? '添加' : action === '_EDIT' ? '编辑' : '查看';
    modalTitle += title;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const formItemLayoutTe = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
        md: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
      },
    };

    return (
      <Modal
        width={500}
        title={modalTitle}
        visible={visible}
        onCancel={this.props.onCancel}
        destroyOnClose
        maskClosable={false}
        footer={false}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="标题" {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: action === '_NEW' ? null : terms && terms.title,
              rules: [{ required: true, message: '请输入标题(1-20字符)' }],
            })(<Input placeholder="标题" maxLength={20} disabled={action === '_OPEN'} />)}
          </Form.Item>
          <FormItem label="交易条款" {...formItemLayout}>
            {getFieldDecorator('content', {
              initialValue: action === '_NEW' ? null : terms && terms.content,
              rules: [
                {
                  required: true,
                  message: '请输入交易条款(5-300字符)',
                },
              ],
            })(
              <TextArea
                style={{ minHeight: 32 }}
                placeholder="交易条款"
                maxLength={300}
                disabled={action === '_OPEN'}
                rows={4}
              />
            )}
          </FormItem>
          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.props.onCancel}>
              {action !== '_OPEN' ? '取消' : '确定'}
            </Button>
            {action !== '_OPEN' && (
              <Button
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                提交
              </Button>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
