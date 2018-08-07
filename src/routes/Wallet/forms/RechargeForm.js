import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Alert,
  Row,
  Col,
  Collapse,
  Select,
  InputNumber,
  message,
  Card,
  Icon,
  Slider,
  Spin,
} from 'antd';
import { map, find, filter, minBy, maxBy } from 'lodash';
import { FormattedMessage as FM } from 'react-intl';
import classNames from 'classnames';
import { formatBTC } from '../../../utils/utils';

import styles from './RechargeForm.less';

const Panel = Collapse.Panel;
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

  state = {
    fee: 0,
  };

  constructor(props) {
    super(props);
    props.dispatch({
      type: 'wallet/fetchBlockConfirmFee',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'wallet/sendSendBtc',
          payload: values,
          callback: res => {
            if (res.code === 0) {
              message.success(PROMPT('reChargeForm.wait_')||'已提交转账申请，请等待平台处理');
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

  formatter = count => {
    const { blockConfirmFee = [] } = this.props;
    const feeObj = find(blockConfirmFee, item => item.count === count) || {};
    // console.log(feeObj);
    return <FM id='reChargeForm.back_pack_in' defaultMessage='在{count_}个区块内打包，费率为{fee}比特币/byte' values={{count_:count,fee:feeObj.fee}} />
    ;
  };

  handleGetFee = v => {
    const { form } = this.props;
    this.props.form.validateFields({ force: true }, (err, value) => {
      if (!err) {
        this.props.dispatch({
          type: 'wallet/fetchFee',
          payload: value,
          callback: (data = {}) => {
            this.setState({
              fee: data.fees,
            });
          },
        });
      }
    });
  };

  render() {
    const {
      className,
      form,
      rechargSubmitting,
      feeLoading,
      currentUser,
      blockConfirmFee = {},
    } = this.props;
    const { wallet = {} } = currentUser || {};
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const customPanelStyle = {
      background: '#f7f7f7',
      // borderRadius: 4,
      // marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };
    const maxBlock = maxBy(blockConfirmFee, item => item.count) || {};
    const minBlock = minBy(blockConfirmFee, item => item.count) || {};
    // console.log(blockConfirmFee, maxBlock, maxBlock);

    return (
      <Row gutter={24}>
        <Col span={14} className={classNames(className, styles.form)}>
          <Alert
            style={{ marginBottom: 15 }}
            message={
              <span>
                <FM id='reChargeForm.max_msg' defaultMessage='您最多可以发送' />
                <span
                  className="text-blue"
                  dangerouslySetInnerHTML={{
                    __html: `${formatBTC(wallet.amount)} BTC`,
                  }}
                />
              </span>
            }
            type="info"
            showIcon
          />
          <Form hideRequiredMark onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label={<FM id='reChargeForm.get_site' defaultMessage='接收地址' />}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: <FM id='reChargeForm.input_address_msg' defaultMessage='请输入接收比特币的地址！' />,
                  },
                ],
              })(<Input size="large" placeholder={PROMPT('reChargeForm.get_site_holder')||'接收比特币的地址'}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label={<FM id='reChargeForm.transfer_num' defaultMessage='转出数量' />}>
              {getFieldDecorator('amount', {
                rules: [
                  {
                    required: true,
                    message: <FM id='reChargeForm.transfer_num_input' defaultMessage='请输入转出数量！' />,
                  },
                ],
              })(
                <InputNumber
                  // onBlur={this.handleGetFee}
                  // formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // parser={value => value.replace(/￥\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                  max={wallet.amount || 0}
                  precision={8}
                  size="large"
                  placeholder={PROMPT('reChargeForm.transfer_num_holder')||'请输入转出比特币数'}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={<FM id='reChargeForm.transfer_fee' defaultMessage='费率' />}>
              {getFieldDecorator('count', {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: <FM id='reChargeForm.transfer_fee_choose' defaultMessage='请选择费率！' />,
                  },
                ],
              })(
                <Slider
                  tipFormatter={this.formatter}
                  step={1}
                  max={maxBlock.count}
                  min={minBlock.count}
                />
              )}
            </FormItem>
            {/* <Select size="large" placeholder="请选择到账确认次数">
                  {map(CONFIG.feeList, (text, value) => (
                    <Option key={value} value={value}>
                      {text} 次
                    </Option>
                  ))}
                </Select>*/}

            <FormItem {...formItemLayout} label={<FM id='reChargeForm.transfer_fee_real' defaultMessage='实际手续费' />}>
              <span className="text-red">{`${formatBTC(this.state.fee)} `}</span> BTC
              <Button
                type="primary"
                loading={feeLoading}
                style={{ marginLeft: 15 }}
                onClick={this.handleGetFee}
              >
                <FM id='reChargeForm.transfer_fee_get' defaultMessage='获取手续费' />
              </Button>
            </FormItem>

            <FormItem className={styles.buttonBox}>
              <Button
                loading={rechargSubmitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <FM id='reChargeForm.transfer_fee_btn_submit' defaultMessage='提交' />
              </Button>
            </FormItem>
          </Form>
        </Col>
        <Col span={10}>
          <Card
            title={
              <span>
                <FM id='reChargeForm.transfer_fee_help' defaultMessage='帮助' /> <Icon type="question-circle" />
              </span>
            }
          >
            <Collapse className={styles.collapse} defaultActiveKey={['1']}>
              <Panel header={<FM id='reChargeForm.warning_1' defaultMessage='注意事项' />} key="1" style={customPanelStyle}>
                <p><FM id='reChargeForm.waring_1_' defaultMessage='BTC 钱包只能向 BTC 地址发送资产，如果向非 BTC 地址发送资产将不可找回。' /></p>
              </Panel>
              <Panel header={<FM id='reChargeForm.warning_2' defaultMessage='交易需多长时间？' />} key="2" style={customPanelStyle}>
                <p>
                  <FM id='reChargeForm.warning_2_' defaultMessage='发送比特币交易通常需要 30 至 60 分钟，有时比特币网络比较慢，可能需要几个小时。' />
                </p>
              </Panel>
              <Panel header={<FM id='reChargeForm.warning_3' defaultMessage='退款和支出' />} key="3" style={customPanelStyle}>
                <p>
                  <FM id='reChargeForm.warning_3_' defaultMessage='从utomarket的钱包发送资金时，会在您的余额中预留和扣除比特币网络转账费。与其他utomarket用户的钱包进行交易免费。' />
                </p>
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Form.create()(RechargeForm);
