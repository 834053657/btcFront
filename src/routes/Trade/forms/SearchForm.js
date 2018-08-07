import React, { Component } from 'react';
import { Row, Col, Form, Input, Select, DatePicker, Button, InputNumber } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
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

  submit = e => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.props.onSearch && this.props.onSearch(values);
      }
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  render() {
    const { onSearch, initialValues = {}, form: { getFieldDecorator } } = this.props;

    return (
      <Form onSubmit={this.submit} layout="horizontal" className={styles.tableListForm}>
        <FormItem label={<FM id='searchForm.user_country' defaultMessage='所在国家' />}>
          {getFieldDecorator('countries', {
            initialValue: initialValues.countries,
          })(
            <Select
              // mode="multiple"
              placeholder={(PROMPT('searchForm.country_choose')||'选择所在国家')}
            >
              <Option value=""><FM id='magList.all_country' defaultMessage='全部国家' /></Option>
              {map(CONFIG.country, item => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label={<FM id='magList.currency_type' defaultMessage='法币币种' />}>
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
        <FormItem label={<FM id='magList.pay_methods' defaultMessage='支付方式' />}>
          {getFieldDecorator('pay_methods', {
            initialValue: initialValues.pay_methods,
          })(
            <Select>
              <Option value=""><FM id='magList.all_pay_way' defaultMessage='全部支付方式' /></Option>
              {map(CONFIG.payments, (text, val) => (
                <Option key={val} value={val}>
                  {text}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem label={<FM id='magList.deal_money' defaultMessage='交易金额' />}>
          {getFieldDecorator('money', {
            initialValue: initialValues.money,
          })(<InputNumber step={1} style={{ width: '100%' }} />)}
        </FormItem>
        <div style={{ overflow: 'hidden' }}>
          <Button type="primary" htmlType="submit">
            <FM id='magList.btn_refer' defaultMessage='查询' />
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
            <FM id='magList.btn_cancel' defaultMessage='取消' />
          </Button>
        </div>
      </Form>
    );
  }
}
