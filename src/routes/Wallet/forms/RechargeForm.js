import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Col,
  Steps,
  Divider,
  Select,
  InputNumber,
  message,
} from 'antd';
import { map, filter } from 'lodash';
import classNames from 'classnames';
import styles from './RechargeForm.less';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

class RechargeForm extends Component {
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

  constructor(props) {
    super(props);
    props.dispatch({
      type: 'wallet/fetchSysPayments',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'wallet/sendRecharge',
          payload: values,
          callback: res => {
            if (res.code === 0) {
              message.success('已提交充值申请，请等待平台处理');
              this.props.form.resetFields();
              this.props.onSubmit && this.props.onSubmit();
            } else {
              message.success(res.msg);
            }
          },
        });
      }
    });
  };

  renderPaymentInfo = () => {
    const { form, sysPayments } = this.props;
    const id = form.getFieldValue('platform_payment_id');
    if (!id) {
      return null;
    }

    const { payment_detail = {}, payment_method } = (id && sysPayments[id]) || {};

    if (payment_method === 'bank') {
      return (
        <div>
          <FormItem {...formItemLayout} label="平台账号">
            <span>{payment_detail.bank}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="开户人">
            <span>{payment_detail.name}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="开户行">
            <span>{payment_detail.cardno}</span>
          </FormItem>
        </div>
      );
    } else {
      return (
        <FormItem {...formItemLayout} label="收款二维码">
          <img className={styles.qrcode} src={payment_detail.qrcode} alt="收款二维码" />
        </FormItem>
      );
    }
  };

  getUserAccount = info => {
    const { payment_method, payment_detail = {} } = info || {};
    if (payment_method === 'bank') {
      return payment_detail.bank_account;
    } else {
      return payment_detail.account;
    }
  };

  render() {
    const { className, form, rechargSubmitting, sysPayments = [], currentUser } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const { payments: userPayments } = currentUser || {};
    const ppid = getFieldValue('platform_payment_id');
    const platform_payments = ppid && sysPayments[ppid] ? sysPayments[ppid].payment_method : null;

    console.log(userPayments, filter(userPayments, i => i.payment_method === platform_payments));

    return (
      <div className={classNames(className, styles.form)}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="充值方式">
            {getFieldDecorator('platform_payment_id', {
              rules: [
                {
                  required: true,
                  message: '请选择充值方式！',
                },
              ],
              onChange: () => {
                setFieldsValue({
                  user_payment_id: null,
                });
              },
            })(
              <Select size="large">
                {map(sysPayments, ({ id, payment_method }) => (
                  <Option key={id} value={id}>
                    {payment_method && CONFIG.payments[payment_method]
                      ? CONFIG.payments[payment_method]
                      : payment_method}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          {this.renderPaymentInfo()}
          <FormItem {...formItemLayout} label="充值账号">
            {getFieldDecorator('user_payment_id', {
              rules: [
                {
                  required: true,
                  message: '请选择您的充值账号！',
                },
              ],
            })(
              <Select size="large" disabled={!platform_payments}>
                {map(
                  filter(
                    userPayments,
                    i => i.payment_method === platform_payments && i.status === 4
                  ),
                  item => (
                    <Option key={item.id} value={item.id}>
                      <span>
                        {item.payment_method && CONFIG.payments[item.payment_method]
                          ? CONFIG.payments[item.payment_method]
                          : item.payment_method}
                        <span> - </span>
                        {this.getUserAccount(item)}
                      </span>
                    </Option>
                  )
                )}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="充值金额">
            {getFieldDecorator('amount', {
              rules: [
                {
                  required: true,
                  message: '请输入充值金额！',
                },
              ],
            })(<InputNumber precision={2} style={{ width: '100%' }} size="large" />)}
          </FormItem>
          <FormItem className={styles.buttonBox}>
            <Button
              loading={rechargSubmitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(RechargeForm);
