import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Button, Input, Form } from 'antd';
import { map } from 'lodash';

import styles from './ReportForm.less';

const FormItem = Form.Item;

@Form.create()
export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { id } = this.props.initialValues || {};
        this.props.onSubmit && this.props.onSubmit({ ...values, id });
      }
    });
  };

  handleCancelForm = () => {
    this.props.form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form>
          <FormItem {...formItemLayout} label="举报">
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入举报内容',
                },
              ],
            })(<Input placeholder="请输入举报内容" />)}
          </FormItem>
          <FormItem>
            <div className={styles.btnBox}>
              <Button type="primary" onClick={this.handleSubmit} className={styles.btn}>
                提交
              </Button>
              <Button onClick={this.handleCancelForm}>取消</Button>
            </div>
          </FormItem>
        </Form>
      </div>
    );
  }
}
