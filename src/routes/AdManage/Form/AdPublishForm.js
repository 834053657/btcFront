import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Button, Form, Input, Radio, Checkbox, InputNumber, Col } from 'antd';
import { map } from 'lodash';

import styles from './AdPublishForm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

@Form.create({
  // onFieldsChange: (props, {trading_price_ratio}) => {
  //   console.log(props);
  //   if(trading_price_ratio ) {
  //     const ratio = trading_price_ratio.value || 100;
  //     const { price, form } = props;
  //     const tradind_price = (ratio/100) * price;
  //     console.log(ratio , price, tradind_price)
  //     form.setFields({tradind_price})
  //   }
  // }
})
export default class AdPublishForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grade: true,
    };
    this.fetchPrice();
    this.fetchRefresh();
  }

  fetchPrice = () => {
    this.props.dispatch({
      type: 'publish/fetchNewPrice',
    });
  };

  fetchRefresh = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'publish/fetchNewPrice',
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { id } = this.props.initialValues || {};
        this.props.onSubmit && this.props.onSubmit({ ...values });
      }
    });
  };
  handleChange = e => {
    console.log(e);
  };

  getUserAccount = info => {
    const { payment_method, payment_detail = {} } = info || {};
    if (payment_method === 'bank') {
      return payment_detail.bank_account;
    } else {
      return payment_detail.account;
    }
  };

  checkMinPrice = (ruler, value, callback) => {
    const { form } = this.props;
    if (value && value > form.getFieldValue('max_volume')) {
      callback('不能大于最大可交易额');
    } else {
      callback();
    }
  };

  checkMaxPrice = (ruler, value, callback) => {
    const { form } = this.props;
    if (value && value <= form.getFieldValue('min_volume')) {
      callback('不能小于于最小可交易额');
    } else {
      return value;
    }
  };

  handleChangeTrust = () => {
    const { grade } = this.state;
    this.setState({
      grade: !grade,
    });
  };

  handleChangePer = e => {
    const { form, price } = this.props;
    const ratio = e.target.value || 100;
    const tradind_price = ratio * price / 100;
    const re = /^[+-]?\d*\.?\d*$/;
    if (re.test(ratio)) {
      form.setFieldsValue({ tradind_price });
      return e.target.value;
    } else {
      console.log('请输入数字');
    }
  };

  handleChangeBtc = e => {
    const { form } = this.props;
    const nums = form.getFieldValue('tradind_price');

    console.log('以下是nums');
    console.log(nums);

    const ratio = e.target.value || 100;
    const max_volume = ratio * nums;

    console.log('以下是max_volume');
    console.log(max_volume);

    const re = /^[+-]?\d*\.?\d*$/;
    if (re.test(ratio)) {
      form.setFieldsValue({ max_volume });
      return e.target.value;
    } else {
      console.log('请输入数字');
    }
  };

  render() {
    const { payments = {} } = this.props.currentUser || {};
    const { getFieldDecorator } = this.props.form;
    const { formType, price } = this.props;
    const { grade } = this.state;

    return (
      <Form hideRequiredMark>
        <FormItem {...formItemLayout} label="所在地">
          {getFieldDecorator('country_code', {
            rules: [
              {
                required: true,
                message: '请选择所在地',
              },
            ],
          })(
            <Select style={{ width: 170 }}>
              {map(CONFIG.country, item => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="交易币种">
          {getFieldDecorator('currency', {
            rules: [
              {
                required: true,
                message: '请选择',
              },
            ],
          })(
            <Select style={{ width: 170 }}>
              {map(CONFIG.currencyList, (text, value) => (
                <Option key={value} value={value}>
                  {text}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem label="市场价比例" {...formItemLayout}>
          <Col span={9} className={styles.no_margin}>
            <FormItem>
              {getFieldDecorator('trading_price_ratio', {
                getValueFromEvent: this.handleChangePer,
              })(
                <div style={{ position: 'relative' }}>
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: 170, position: 'absolute', marginTop: '5px' }}
                    placeholder="最大交易额"
                  />
                  <a className={styles.afterTip}>%</a>
                </div>
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
              市场参考价格:
            </span>
          </Col>
          <Col span={7}>
            <FormItem>
              <div>
                <span style={{ marginRight: '20px' }}>{price} CNY / BTC</span>
                <Button type="primary" onClick={this.fetchRefresh}>
                  刷新
                </Button>
              </div>
            </FormItem>
          </Col>
        </FormItem>

        <FormItem {...formItemLayout} label="交易价格">
          {getFieldDecorator('tradind_price', {
            rules: [
              {
                required: true,
                message: '请输入交易价格',
              },
            ],
          })(
            <InputNumber
              min={0}
              step={0.0001}
              placeholder="交易价格"
              style={{ width: 170 }}
              onChange={this.handleChange}
            />
          )}
        </FormItem>

        <FormItem label="交易限额" {...formItemLayout}>
          <Col span={7} className={styles.no_margin}>
            <FormItem>
              {getFieldDecorator('limitBTC', {
                getValueFromEvent: this.handleChangeBtc,
                rules: [
                  {
                    required: true,
                    message: '请输入可交易数量',
                  },
                ],
              })(
                <div style={{ position: 'relative' }} onChange={this.handleInputsChange}>
                  <InputNumber
                    min={0}
                    step={0.1}
                    style={{ width: 170, position: 'absolute', marginTop: '5px' }}
                    placeholder="最大可交易数量"
                  />
                  <a className={styles.afterTip}>BTC</a>
                </div>
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('min_volume', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    validator: this.checkMinPrice,
                  },
                ],
              })(
                <div style={{ position: 'relative' }}>
                  <InputNumber
                    min={0}
                    step={0.001}
                    style={{ width: 170, position: 'absolute', marginTop: '5px' }}
                    placeholder="最小交易额"
                  />
                  <a className={styles.afterTip}>CNY</a>
                </div>
              )}
            </FormItem>
          </Col>
          <Col span={1}>
            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>--</span>
          </Col>
          <Col span={3}>
            <FormItem>
              {getFieldDecorator('max_volume', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                  {
                    validator: this.checkMaxPrice,
                  },
                ],
              })(
                <div style={{ position: 'relative' }}>
                  <InputNumber
                    min={0}
                    step={0.001}
                    style={{ width: 170, position: 'absolute', marginTop: '5px' }}
                    placeholder="最大交易额"
                  />
                  <a className={styles.afterTip}>CNY</a>
                </div>
              )}
            </FormItem>
          </Col>
        </FormItem>

        <Col span={50}>
          <FormItem {...formItemLayout} label="付款期限">
            {getFieldDecorator('payment_limit', {
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(
              <div style={{ position: 'relative' }} className={styles.input}>
                <InputNumber
                  min={10}
                  max={30}
                  style={{ width: 170, position: 'absolute', marginTop: '5px' }}
                  placeholder="付款期限"
                />
                <a className={styles.afterTip}>分钟</a>
              </div>
            )}
          </FormItem>
        </Col>
        <FormItem {...formItemLayout} label="付款方式">
          {getFieldDecorator('payment_methods', {
            rules: [
              {
                required: true,
                message: '请选择付款方式',
              },
            ],
          })(
            <Select
              mode="multiple"
              style={{ maxWidth: 286, width: '100%' }}
              placeholder="选择付款方式"
            >
              {map(payments, item => (
                <Option key={item.id} value={item.id}>
                  <span>
                    {item.payment_method && CONFIG.payments[item.payment_method]
                      ? CONFIG.payments[item.payment_method]
                      : item.payment_method}
                    <span> - </span>
                    {this.getUserAccount(item)}
                  </span>
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} required label="安全选项">
          <div>
            <div>
              {getFieldDecorator('trusted_user', {})(
                <Checkbox onChange={this.handleChangeTrust}>仅限受信任的交易者</Checkbox>
              )}
            </div>
            {grade ? (
              <div>
                <span className="bt-trade-level-auth">交易者的认证等级</span>
                <span style={{ marginLeft: 20 }}>
                  {getFieldDecorator('way', {
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(
                    <RadioGroup>
                      <Radio value="1">C1</Radio>
                      <Radio value="2">C2</Radio>
                      <Radio value="3">C3</Radio>
                      <Radio value="0">不限</Radio>
                    </RadioGroup>
                  )}
                </span>
              </div>
            ) : (
              ''
            )}
          </div>
        </FormItem>

        <FormItem {...formItemLayout} label="交易备注">
          {getFieldDecorator('trading_term', {
            rules: [
              {
                required: true,
                message: '请输入',
              },
            ],
          })(<TextArea placeholder="交易备注" rows={4} style={{ width: 390 }} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="自动回复">
          {getFieldDecorator('auto_replies', {
            rules: [
              {
                required: true,
                message: '请输入',
              },
            ],
          })(<TextArea placeholder="自动回复" rows={4} style={{ width: 390 }} />)}
        </FormItem>
        {formType === '1' ? (
          ''
        ) : (
          <div>
            <FormItem {...formItemLayout} label="最小交易量">
              {getFieldDecorator('min_trade_count', {})(
                <InputNumber
                  min={0}
                  max={10}
                  step={0.1}
                  placeholder="交易价格"
                  style={{ width: 170 }}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="最低评价得分">
              {getFieldDecorator('min_rating_score', {})(
                <InputNumber min={0} max={100} placeholder="最低评价得分" style={{ width: 170 }} />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="新卖家限额">
              {getFieldDecorator('new_buyer_limit', {})(
                <InputNumber
                  min={0}
                  max={10}
                  step={0.1}
                  placeholder="最低评价得分"
                  style={{ width: 170 }}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="付款详细信息">
              {getFieldDecorator('trading_notes', {})(
                <TextArea placeholder="付款详细信息" rows={4} style={{ width: 390 }} />
              )}
            </FormItem>
          </div>
        )}

        <FormItem>
          <div className={styles.btnBox}>
            <Button type="primary" onClick={this.handleSubmit} className={styles.btn}>
              确认发布
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}
