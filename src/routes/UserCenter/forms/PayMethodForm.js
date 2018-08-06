import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Select } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { omit, map, keys } from 'lodash';
import UploadQiNiu from 'components/UploadQiNiu';
import styles from './PayMethodForm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

@Form.create()
export default class PayMethodForm extends Component {
  static defaultProps = {
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };
  state = {};

  constructor(props) {
    super(props);
    const { payment_detail = {} } = props.initialValues || {};

    this.state = {
      formItemLayout: {
        labelCol: {
          sm: { span: 4 },
        },
        wrapperCol: {
          sm: { span: 20 },
        },
      },
      fieldList: {
        wechat: {
          'payment_detail.name': {
            lablel: <FM id='payMethodForm.user_name_we' defaultMessage='姓名' />,
            component: <Input size="large" maxLength={20} placeholder={(PROMPT('payMethodForm.user_name_holder')||'姓名')} />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.user_name_msg_we' defaultMessage='请输入姓名！' />,
                },
              ],
            },
          },
          'payment_detail.account': {
            lablel: <FM id='payMethodForm.user_account_we' defaultMessage='账号' />,
            component: <Input size="large" maxLength={30} placeholder={(PROMPT('payMethodForm.user_account_holder')||'账号')} />,
            options: {
              initialValue: payment_detail.account,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.user_account_input_we' defaultMessage='请输入账号！' />,
                },
                // {
                //   pattern: /^[0-9]{4,30}$/,
                //   message: '请输入4~30位的数字',
                // },
              ],
            },
          },
          'payment_detail.ercodeUrl': {
            lablel: <FM id='payMethodForm.user_ercodeUrl_we' defaultMessage='收款码' />,
            component: <UploadQiNiu />,
            options: {
              initialValue: payment_detail.ercodeUrl,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.user_ercodeUrl_we_input' defaultMessage='请上传微信收款码！' />,
                },
              ],
            },
          },
        },
        alipay: {
          'payment_detail.name': {
            lablel: <FM id='payMethodForm.user_name_ali' defaultMessage='姓名' />,
            component: <Input size="large" maxLength={20} placeholder={(PROMPT('payMethodForm.user_name_holder')||'姓名')} />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.user_name_msg_ali' defaultMessage='请输入姓名！' />,
                },
              ],
            },
          },
          'payment_detail.account': {
            lablel: <FM id='payMethodForm.account_ali' defaultMessage='账号' />,
            component: <Input size="large" maxLength={30} placeholder={(PROMPT('payMethodForm.user_account_holder')||'账号')} />,
            options: {
              initialValue: payment_detail.account,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.account_input_msg' defaultMessage='请输入账号！' />,
                },
                // {
                //   pattern: /^[0-9]{4,30}[a-z][A-Z]$/,
                //   message: '请输入4~30位的数字,字母',
                // },
              ],
            },
          },
          'payment_detail.ercodeUrl': {
            lablel: <FM id='payMethodForm.account_ercodeUrl' defaultMessage='收款码' />,
            component: <UploadQiNiu />,
            options: {
              initialValue: payment_detail.ercodeUrl,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.account_ercodeUrl_upload' defaultMessage='请上传支付宝收款码！' />,
                },
              ],
            },
          },
        },
        bank: {
          'payment_detail.name': {
            lablel: <FM id='payMethodForm.user_name_bank' defaultMessage='姓名' />,
            component: <Input size="large" maxLength={20} placeholder={(PROMPT('payMethodForm.user_name_holder')||'姓名')} />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.user_name_input_msg_bank' defaultMessage='请输入姓名！' />,
                },
              ],
            },
          },
          'payment_detail.bank_name': {
            lablel: <FM id='payMethodForm.open_bank' defaultMessage='开户行' />,
            component: <Input size="large" maxLength={20} placeholder={(PROMPT('payMethodForm.open_bank_holder')||'开户行')} />,
            options: {
              initialValue: payment_detail.bank_name,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.msg_bank_input' defaultMessage='请输入开户行！' />,
                },
              ],
            },
          },
          'payment_detail.bank_account': {
            lablel: <FM id='payMethodForm.bank_card' defaultMessage='银行卡号' />,
            component: <Input size="large" maxLength={30} placeholder={(PROMPT('payMethodForm.bank_card_num')||'银行卡号')} />,
            options: {
              initialValue: payment_detail.bank_account,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.card_bank_num_msg' defaultMessage='请输入银行卡号！' />,
                },
                {
                  pattern: /^[0-9]{4,30}$/,
                  message: <FM id='payMethodForm.input_limit_bank' defaultMessage='请输入4~30位的数字' />,
                },
              ],
            },
          },
        },
        westernunion: {
          'payment_detail.name': {
            lablel: <FM id='payMethodForm.user_name_west' defaultMessage='姓名' />,
            component: <Input size="large" maxLength={20} placeholder={(PROMPT('payMethodForm.user_name_holder')||'姓名')} />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.user_name_msg_west' defaultMessage='请输入姓名！' />,
                },
              ],
            },
          },
          'payment_detail.account': {
            lablel: <FM id='payMethodForm.mag_pay_west' defaultMessage='汇款信息' />,
            component: <TextArea rows={4} style={{ width: 390 }} />,
            options: {
              initialValue: payment_detail.account,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.mag_pay_west_input' defaultMessage='请输入西联汇款信息！' />,
                },
              ],
            },
          },
        },
        paytm: {
          'payment_detail.name': {
            lablel: <FM id='payMethodForm.user_name_paytm' defaultMessage='姓名' />,
            component: <Input size="large" maxLength={20} placeholder={(PROMPT('payMethodForm.user_name_holder')||'姓名')} />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.user_name_paytm_msg' defaultMessage='请输入姓名！' />,
                },
              ],
            },
          },
          'payment_detail.account': {
            lablel: <FM id='payMethodForm.user_account' defaultMessage='账号' />,
            component: <Input size="large" maxLength={30} placeholder={(PROMPT('payMethodForm.user_account_holder')||'账号')} />,
            options: {
              initialValue: payment_detail.account,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.user_account_input_msg' defaultMessage='请输入账号！' />,
                },
                // {
                //   pattern: /^[0-9]{4,30}$/,
                //   message: '请输入4~30位的数字',
                // },
              ],
            },
          },
          'payment_detail.ercodeUrl': {
            lablel: <FM id='payMethodForm.user_accpunt_img' defaultMessage='收款码' />,
            component: <UploadQiNiu />,
            options: {
              initialValue: payment_detail.ercodeUrl,
              rules: [
                {
                  required: true,
                  message: <FM id='payMethodForm.user_paytm_img' defaultMessage='请上传paytm收款码！' />,
                },
              ],
            },
          },
        },
      },
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { getFieldValue } = this.props.form;
    const { fieldList } = this.state;
    const payment_method = getFieldValue('payment_method');
    const fields = payment_method && fieldList[payment_method] ? fieldList[payment_method] : null;

    this.props.form.validateFields(
      [...keys(fields), 'payment_method'],
      { force: true },
      (err, values) => {
        if (!err) {
          this.props.onSubmit(values);
        }
      }
    );
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  getContent = () => {
    const { formItemLayout, fieldList } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const payment_method = getFieldValue('payment_method');
    const fields = payment_method && fieldList[payment_method] ? fieldList[payment_method] : null;

    const content = (
      <div>
        {map(fields, (item, key) => {
          const comp = typeof item.component === 'function' ? item.component() : item.component;

          return (
            <FormItem {...formItemLayout} label={item.lablel} key={key}>
              {getFieldDecorator(key, item.options)(comp)}
            </FormItem>
          );
        })}
      </div>
    );

    return content;
  };

  render() {
    const { formItemLayout } = this.state;
    const { form, submitting, initialValues = {}, payMents = [] } = this.props;
    const { id } = initialValues || {};
    const { getFieldDecorator } = form;
    const paymentsList = id ? CONFIG.payments : payMents; // 新增只能添加未添加的支付方式

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark>
          <Form.Item {...formItemLayout} label={<FM id='payMethodForm.pay_method_way_' defaultMessage='支付方式' />}>
            {getFieldDecorator('payment_method', {
              initialValue: initialValues.payment_method,
              rules: [{ required: true, message: <FM id='payMethodForm.pay_method_way_choose' defaultMessage='请选择支付方式' /> }],
            })(
              <Select
                size="large"
                placeholder={(PROMPT('payMethodForm.pay_method_way_choose_holder')||'请选择支付方式')}
                disabled={id}
              >
                {map(paymentsList, (text, key) => (
                  <Option key={key} value={key}>
                    {text}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {this.getContent()}

          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              <FM id='payMethodForm.btn_cancel' defaultMessage='取消' />
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              {id ? <FM id='payMethodForm.btn_refresh' defaultMessage='更新' /> : <FM id='payMethodForm.btn_confirm' defaultMessage='确定' />}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
