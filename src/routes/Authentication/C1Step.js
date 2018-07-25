import { AuthStep } from 'components/Authentication';
import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, Input, Button } from 'antd';
import { connect } from 'dva';
import { map, includes } from 'lodash';
import styles from './AuthenticationPage.less';

const FormItem = Form.Item;
const Option = Select.Option;

// styles
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
  required: false,
};
const buttonItemLayout = {
  wrapperCol: { span: 20 },
  style: { textAlign: 'right' },
};

@connect(({ authentication }) => ({
  authentication,
}))
@Form.create()
export default class C1Step extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'authentication/submitInfo',
          payload: values,
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      default_card,
      default_country,
      country_code,
      card_type,
      name,
      number,
      status,
    } = this.props.authentication;
    const disabledForm = includes([2, 4], status);
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="所在国家">
          {getFieldDecorator('country_code', {
            initialValue: country_code || default_country || '获取失败',
          })(
            <Select placeholder="请选择所在国家/地区" disabled={disabledForm}>
              {map(CONFIG.country, country => {
                return (
                  <Option key={country.code} value={country.code}>
                    {country.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="证件类型">
          {getFieldDecorator('card_type', {
            initialValue: card_type || default_card || '获取失败',
          })(
            <Select placeholder="请选择证件类型" disabled={disabledForm}>
              {map(CONFIG.card_types, (card, type) => {
                return (
                  <Option key={type} value={type}>
                    {card}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="真实姓名">
          {getFieldDecorator('name', {
            rules: [
              { type: 'string', required: true, message: '请输入正确的姓名', min: 1, max: 20 },
            ],
            initialValue: name,
          })(<Input placeholder="请输入与证件信息一致的姓名" disabled={disabledForm} />)}
        </FormItem>
        <FormItem {...formItemLayout} label="证件号码">
          {getFieldDecorator('number', {
            rules: [
              { type: 'string', required: true, message: '请输入正确的证件号码', min: 5, max: 50 },
            ],
            initialValue: number,
          })(<Input placeholder="请输入与证件信息一致的证件号码" disabled={disabledForm} />)}
        </FormItem>
        <FormItem {...buttonItemLayout}>
          <Button type="primary" htmlType="submit" disabled={disabledForm}>
            提交审核
          </Button>
        </FormItem>
      </Form>
    );
  }
}
