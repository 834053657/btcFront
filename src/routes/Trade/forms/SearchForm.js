import React, { Component } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, Button, InputNumber } from 'antd';
import { map } from 'lodash';
import TagSelect from 'components/TagSelect';
import styles from './SearchForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
export default class SearchForm extends Component {
  // constructor(props) {
  //   super(props);
  // }

  submit = (e) => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.props.onSearch && this.props.onSearch(values);
      }
    });
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.onCancel && this.props.onCancel()
  }

  render() {
    const { onSearch, initialValues ={}, form: { getFieldDecorator } } = this.props;

    return (
      <Form onSubmit={this.submit} layout="horizontal" className={styles.tableListForm}>
        <FormItem label="所在国家">
          {getFieldDecorator('countries', {
            initialValue: initialValues.countries,
          })(
            <Select
              // mode="multiple"
              placeholder="选择所在国家"
            >
              <Option value="">
                全部国家
              </Option>
              {map(CONFIG.country, item => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="法币币种">
          {getFieldDecorator('currency', {
            initialValue: initialValues.currency,
          })(
            <Select>
              {map(CONFIG.currencyList, (text, val) => (
                <Option key={val} value={val}>
                  {text}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="支付方式">
          {getFieldDecorator('pay_methods', {
              initialValue: initialValues.pay_methods,
            }
          )(
            <Select>
              <Option value="">全部支付方式</Option>
              {map(CONFIG.payments, (text, val) => (
                <Option key={val} value={val}>
                  {text}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label="交易金额">
          {getFieldDecorator('money', {
            initialValue: initialValues.money,
          })(
            <InputNumber step={1} style={{width: '100%'}} />
          )}
        </FormItem>
        <div style={{ overflow: 'hidden' }}>
          <Button type="primary" htmlType="submit">查询</Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>取消</Button>
        </div>
      </Form>
    );
  }
}

