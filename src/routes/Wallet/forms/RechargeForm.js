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
  Icon
} from 'antd';
import { map, filter } from 'lodash';
import classNames from 'classnames';
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
    fee: 0
  }

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

  render() {
    const { className, form, rechargSubmitting, sysPayments = [], currentUser } = this.props;
    const { wallet={} } = currentUser || {};
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    const customPanelStyle = {
      background: '#f7f7f7',
      // borderRadius: 4,
      // marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };

    return (
      <Row gutter={24}>
        <Col span={14} className={classNames(className, styles.form)}>
          <Alert
            style={{marginBottom: 15}}
            message={<span>您最多可以发送 <a>{`${wallet.amount} 个BTC`}</a></span>}
            type="info"
            showIcon
          />
          <Form hideRequiredMark onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="接收地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '请输入接收比特币的地址！',
                  },
                ],
              })(
                <Input size="large" placeholder="接收比特币的地址"  />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="转出数量">
              {getFieldDecorator('amount', {
                rules: [
                  {
                    required: true,
                    message: '请输入转出数量！',
                  },
                ],
              })(
                <InputNumber
                  onBlur={this.handleGetFee}
                  // formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  // parser={value => value.replace(/￥\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                  precision={2}
                  size="large"
                  placeholder="请输入转出比特币数"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="到账确认次数">
              {getFieldDecorator('count', {
                rules: [
                  {
                    required: true,
                    message: '请选择到账确认次数！',
                  },
                ],
              })(
                <Select size="large" placeholder="请选择到账确认次数">
                  {map(CONFIG.feeList, (text, value) => (
                    <Option key={value} value={value}>
                      {text} 次
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>


            <FormItem {...formItemLayout} label="手续费">
              <span className="text-blue">{`${this.state.fee}`}</span>
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
        </Col>
        <Col span={10}>
          <Card  title={<span>帮助 <Icon type="question-circle" /></span>} >
            <Collapse className={styles.collapse} defaultActiveKey={['1']} >
              <Panel header="交易需多长时间？" key="1" style={customPanelStyle}>
                <p>发送比特币交易通常需要 30 至 60 分钟，有时比特币网络比较慢，可能需要几个小时。</p>
              </Panel>
              <Panel header="退款和支出" key="2" style={customPanelStyle}>
                <p>321</p>
              </Panel>
              <Panel header="转出费用" key="3" style={customPanelStyle}>
                <p>111</p>
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default Form.create()(RechargeForm);
