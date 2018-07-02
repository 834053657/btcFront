import React, { Component, Fragment } from 'react';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  Card,
  Form,
  InputNumber,
} from 'antd';
import styles from './FilterDemoinForm.less';

const InputGroup = Input.Group;
const FormItem = Form.Item;

@Form.create()
export default class PicWithPass extends Component {
  state = {};

  checkMin = (rule, value, callback) => {
    const { form } = this.props;
    const max = form.getFieldValue('max');
    if (value && max && value > max) {
      callback('查询条件不正确!');
    } else {
      if (max) {
        // form.validateFields(['max'], { force: true });
      }
      callback();
    }
  };

  checkMax = (rule, value, callback) => {
    const { form } = this.props;
    const min = form.getFieldValue('min');
    if (value && min && value < min) {
      callback('查询条件不正确!');
    } else {
      if (min) {
        form.validateFields(['min'], { force: true });
      }
      callback();
    }
  };

  render() {
    const { form: { getFieldDecorator, resetForm, getFieldsError }, initialValues } = this.props;
    const { min, max } = initialValues || {};

    return (
      <Form className={styles.denoRange}>
        <InputGroup compact>
          <FormItem>
            {getFieldDecorator('min', {
              initialValue: min,
              rules: [
                {
                  validator: this.checkMin,
                },
              ],
            })(<Input style={{ width: 380, backgroundColor: '#fff' }} />)}
          </FormItem>
          <FormItem>
            <Input style={{ width: 380, backgroundColor: '#fff' }} />
          </FormItem>
          <FormItem>
            {getFieldDecorator('max', {
              initialValue: max,
              rules: [
                {
                  validator: this.checkMax,
                },
              ],
            })(<Input style={{ width: 380, backgroundColor: '#fff' }} />)}
          </FormItem>
        </InputGroup>
      </Form>
    );
  }
}
