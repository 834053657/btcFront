import React, { Component, Fragment } from 'react';
import { filter, last } from 'lodash';
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
import SellForm from './SellForm';

const InputGroup = Input.Group;
const FormItem = Form.Item;

@Form.create({
  // mapPropsToFields(props) {
  //
  // },
  onFieldsChange(props, changedFields) {
    const i = Object.keys(changedFields.items).map(n => {
      return n;
    })[0];
    const item = changedFields.items[i];
    props.changeData(i, item);

    console.log('onFieldsChange', changedFields);
    // props.onChange(changedFields)
  },
  onValuesChange(props, changedFields) {
    console.log(changedFields);
    const { items } = changedFields || {};
    console.log('onValuesChange', items);
    // props.onChange(items)
  },
})
export default class OnlyPassWord extends Component {
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

  handleDelete = id => {
    const items = this.props.form.getFieldValue('items[]');
    const newItems = filter(items, i => i.id !== id);
    console.log(newItems, items);
    this.props.form.setFieldsValue({
      'items[]': newItems,
    });
  };

  handleAdd = () => {
    const items = this.props.form.getFieldValue('items[]');
    const lastId = last(items, {}).id || 0;
    items.push({
      id: lastId + 1,
      password: '',
    });
    this.props.form.setFieldsValue({
      'items[]': items,
    });
  };

  render() {
    const {
      form: { getFieldDecorator, resetForm, getFieldValue },
      initialValues,
      data,
      filedName,
    } = this.props;
    const { min, max } = initialValues || {};
    const formItemLayoutBtn = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    const { money, items = [] } = data || {};
    const title = (
      <div>
        <span>{money}面额</span>
        <span>({this.props.num})</span>
      </div>
    );

    getFieldDecorator('items[]', {
      initialValue: items || [],
    });
    const list = getFieldValue('items[]');

    return (
      <Form className={styles.denoRange}>
        <Card title={title} className={styles.card}>
          {list.map((i, index) => {
            return (
              <FormItem key={i.id}>
                {getFieldDecorator(`items[${i.id}].password`, {
                  // initialValue: min,
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入面额',
                    },
                  ],
                })(<Input style={{ width: 380, backgroundColor: '#fff' }} />)}

                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={this.handleDelete.bind(this, i.id)}
                />
              </FormItem>
            );
          })}

          <FormItem {...formItemLayoutBtn}>
            <Button type="dashed" onClick={this.handleAdd} style={{ width: '60%' }}>
              <Icon type="plus" /> 添加卡密
            </Button>
          </FormItem>
        </Card>
      </Form>
    );
  }
}
