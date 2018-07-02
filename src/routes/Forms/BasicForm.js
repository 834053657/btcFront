import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { map, filter } from 'lodash';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class Item1 extends PureComponent {
  handleAdd = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;

    const items = getFieldValue('items') || [];
    items.push({
      money: 2,
      max: 1,
      min: 2,
    });

    setFieldsValue({
      items,
    });
  };

  render() {
    const { data = {} } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    getFieldDecorator('items', {
      initialValue: data.items,
    });

    return (
      <div>
        <FormItem {...formItemLayout} label="money">
          {getFieldDecorator(`money`, {
            initialValue: data.money,
            rules: [{ required: true, message: 'money is required!' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="min">
          {getFieldDecorator(`min`, {
            initialValue: data.min,
            rules: [{ required: true, message: 'money is required!' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="max">
          {getFieldDecorator(`max`, {
            initialValue: data.max,
            rules: [{ required: true, message: 'money is required!' }],
          })(<Input />)}
        </FormItem>
        <a onClick={this.props.onDelete}>del</a>
      </div>
    );
  }
}
const ItemForm = Form.create({
  onFieldsChange(props, changedFields) {
    // console.log(changedFields);
    // props.onChange(changedFields);
  },
  onValuesChange(props, values) {
    // console.log(props, values);
    props.onChange(values);
  },
})(Item1);

class Item extends PureComponent {
  handleAdd = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;

    const items = getFieldValue('items') || [];
    items.push({
      money: 2,
      max: 1,
      min: 2,
    });

    setFieldsValue({
      items,
    });
  };

  handleDel = index => {
    const { getFieldValue, setFieldsValue } = this.props.form;

    let items = getFieldValue('items') || [];
    delete items[index];
    items = filter(items, (i, j) => j !== index);

    setFieldsValue({
      items,
    });
  };

  handleFormChange = (index, changedFields) => {
    const { getFieldValue, setFieldsValue } = this.props.form;

    const items = getFieldValue('items') || [];
    items[index] = { ...items[index], ...changedFields };

    setFieldsValue({
      items,
    });
  };

  render() {
    const { data = {} } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    getFieldDecorator('items', {
      initialValue: data.items,
    });

    return (
      <div>
        <FormItem {...formItemLayout} label="Username">
          {getFieldDecorator('name', {
            initialValue: data.name,
            rules: [{ required: true, message: 'Username is required!' }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="id">
          {getFieldDecorator('id', {
            initialValue: data.id,
            rules: [{ required: true, message: 'Username is required!' }],
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label=" ">
          {map(getFieldValue('items'), (item, index) => {
            return (
              <ItemForm
                key={index}
                data={item}
                onChange={this.handleFormChange.bind(this, index)}
                onDelete={this.handleDel.bind(this, index)}
              />
            );
          })}
        </FormItem>
        <Button onClick={this.handleAdd}>add</Button>
      </div>
    );
  }
}

const CustomizedForm = Form.create({
  onFieldsChange(props, changedFields) {
    // console.log(changedFields);
    // props.onChange(changedFields);
  },
  onValuesChange(props, values) {
    // console.log(props, values);
    props.onChange(values);
  },
})(Item);

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  state = {};

  handleFormChange = (index, changedFields) => {
    console.log(changedFields);
    const { getFieldValue, setFieldsValue } = this.props.form;

    const cards = getFieldValue('cards') || [];
    cards[index] = { ...cards[index], ...changedFields };

    setFieldsValue({
      cards,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      // if (!err) {
      //   this.props.dispatch({
      //     type: 'form/submitRegularForm',
      //     payload: values,
      //   });
      // }
    });
  };

  handleAdd = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;

    const cards = getFieldValue('cards') || [];
    cards.push({
      id: 1,
      name: 'xxxx',
      items: [
        {
          money: 1,
          max: 1,
          min: 2,
        },
        {
          money: 12,
          max: 12,
          min: 22,
        },
      ],
    });

    setFieldsValue({
      cards,
    });
  };
  render() {
    const { submitting } = this.props;
    const { getFieldDecorator, getFieldValue, getFieldProps } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    getFieldDecorator('cards', {
      initialValue: [
        {
          id: 0,
          name: 'fff',
          items: [
            {
              money: 1,
              max: 1,
              min: 2,
            },
          ],
        },
      ],
    });
    const cards = getFieldValue('cards') || [];

    console.log(cards);

    return (
      <PageHeaderLayout
        title="基础表单"
        content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            {map(cards, (item, index) => {
              return (
                <CustomizedForm
                  key={index}
                  data={item}
                  onChange={this.handleFormChange.bind(this, index)}
                />
              );
            })}
            <Button onClick={this.handleAdd}>add</Button>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Form>
          {JSON.stringify(cards, null, 2)}
        </Card>
      </PageHeaderLayout>
    );
  }
}
