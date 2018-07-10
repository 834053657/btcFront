import React, { Component } from 'react';
import { Select, Button, Form, Input, Radio, Checkbox, Col, Card, Alert, Icon } from 'antd';
import { map } from 'lodash';
import InputNumber from 'components/InputNumber';
import styles from './EditForm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
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

const typeMap = {
  '1': '在线买入',
  '2': '在线卖出',
};

@Form.create()
export default class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grade: true,
    };
  }

  fetchRefresh = (obj = {}) => {
    // const { dispatch } = this.props;
    this.props.dispatch({
      type: 'ad/fetchNewPrice',
      payload: {
        currency: obj.currency || 'CNY',
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { id } = this.props.initialValues || {};
        this.props.onSubmit && this.props.onSubmit({ ...values, id });
      }
    });
  };
  handleChange = e => {};

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
    if (value > form.getFieldValue('max_volume')) {
      callback('不能大于最大可交易额');
    } else {
      callback();
    }
  };

  checkMaxPrice = (ruler, value, callback) => {
    const { form } = this.props;

    if (value < form.getFieldValue('min_volume')) {
      callback('不能小于于最小可交易额');
    } else {
      callback();
    }
  };

  handleChangeTrust = () => {
    const { grade } = this.state;
    this.setState({
      grade: !grade,
    });
  };

  handleChangePer = ratio => {
    const { form, price } = this.props;
    const trading_price = ratio * price / 100;

    const re = /^[+-]?\d*\.?\d*$/;
    if (re.test(ratio)) {
      form.setFieldsValue({ trading_price });
      return ratio;
    } else {
      console.log('请输入数字');
    }
  };
  handleChangeBtc = v => {
    const { form } = this.props;
    const nums = form.getFieldValue('trading_price');
    const numBTC = v || 100;

    const max_volume = numBTC * nums;

    const re = /^[+-]?\d*\.?\d*$/;
    if (re.test(numBTC)) {
      form.setFieldsValue({ max_volume });
      return v;
    } else {
      console.log('请输入数字');
    }
  };

  handleChangeMax = e => {
    const { form } = this.props;
    const num = form.getFieldValue('trading_price');
    const numMax = e;
    const max_count = numMax * (1 / num);
    const re = /^[+-]?\d*\.?\d*$/;

    if (re.test(numMax)) {
      form.setFieldsValue({ max_count });
      return e;
    } else {
      return '请输入数字';
    }
  };
  handleChangeRat = e => {
    const { form, price } = this.props;

    const numMax = e;
    const trading_price_ratio = numMax / price;
    const re = /^[+-]?\d*\.?\d*$/;

    if (re.test(numMax)) {
      form.setFieldsValue({ trading_price_ratio });
      return e;
    } else {
      return '请输入数字';
    }
  };

  handleChangeCur = currency => {
    this.setState({
      nowCurrency: currency,
    });
    return currency;
  };

  clickBtn = value => {};

  render() {
    const { payments = {} } = this.props.currentUser || {};
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { price, initialValues = {}, submitting } = this.props;
    const { form } = this.props;
    return (
      <Form className={styles.form} hideRequiredMark onSubmit={this.handleSubmit}>
        <FormItem>
          <div className={styles.chooseBtn}>
            {getFieldDecorator('ad_type', {
              initialValue: initialValues.ad_type ? initialValues.ad_type + '' : '1',
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            })(
              <RadioGroup size="large">
                {map(typeMap, (text, value) => (
                  <RadioButton
                    key={value}
                    value={value}
                    onClick={this.clickBtn.bind(this, value)}
                    className={styles.Btn}
                  >
                    {text}
                  </RadioButton>
                ))}
              </RadioGroup>
            )}
          </div>
        </FormItem>
        <div style={{ paddingLeft: '20px' }}>
          <Alert
            style={{ margin: '16px 0', width: '84%' }}
            message={
              <span>
                <span style={{ marginRight: '10px' }}>
                  <Icon type="exclamation-circle" />
                </span>
                <span>
                  您最多可以创建 4 条交易广告，在您创建广告的时候，请您创建适合您需求的广告条数
                </span>
              </span>
            }
          />
        </div>
        <Card style={{ margin: 15, width: 810 }} title="广告规则">
          <li>
            要想显示您的交易广告，您的【utomarket】钱包中需要有比特币。使用在线付款的交易广告至少需要
            0.05 BTC。
          </li>
          <li>特定付款方式要求您验证身份，然后您的交易广告才会显示。</li>
          <li>每笔完成的交易均会消耗广告主 1% 的总交易金额。查看我们费用页面上的所有费用。</li>
          <li>发起交易后，价格就会确定，除非定价中有明显的错误。</li>
          <li>您不能代表其他人（由经纪人处理）购买或出售比特币。</li>
          <li>您仅可以使用以自己名字注册的付款帐户（非第三方付款！）。</li>
          <li>您必须在交易广告或交易聊天中提供您的付款详细信息。</li>
          <li>所有交流必须在utomarket.com 上进行。</li>
          <li>
            标记为高风险的付款方式具有很大的欺诈风险。在使用高风险付款方式时，请务必小心且始终要求您的交易对方验证身份。
          </li>
        </Card>

        <FormItem {...formItemLayout} label="所在地">
          {getFieldDecorator('country_code', {
            initialValue: initialValues.country_code,
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
            onChange: this.handleChangeCur,
            initialValue: initialValues.currency || 'CNY',
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
          <Col span={9} className={styles.no_margin} style={{ position: 'relative' }}>
            <FormItem>
              {getFieldDecorator('trading_price_ratio', {
                initialValue: initialValues.trading_price_ratio,
                onChange: this.handleChangePer,
              })(
                <InputNumber
                  min={0}
                  style={{ width: 170, position: 'absolute', marginTop: '5px' }}
                  placeholder="市场价比例"
                  addonAfter="%"
                />
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
                <span style={{ marginRight: '20px' }}>
                  {price} {getFieldValue('currency')} / BTC
                </span>
                <Button type="primary" onClick={this.fetchRefresh}>
                  刷新
                </Button>
              </div>
            </FormItem>
          </Col>
        </FormItem>

        <FormItem {...formItemLayout} label="交易价格">
          {getFieldDecorator('trading_price', {
            initialValue: initialValues.trading_price,
            onChange: this.handleChangeRat,
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
              {getFieldDecorator('max_count', {
                initialValue: initialValues.max_count,
                onChange: this.handleChangeBtc,
                rules: [
                  {
                    required: true,
                    message: '请输入可交易数量',
                  },
                ],
              })(
                <InputNumber
                  disabled={!getFieldValue('trading_price')}
                  min={0}
                  step={0.1}
                  style={{ width: 170, position: 'absolute', marginTop: '5px' }}
                  placeholder="交易限额"
                  addonAfter="BTC"
                />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('min_volume', {
                initialValue: initialValues.min_volume || 0,
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
                <InputNumber
                  disabled={!getFieldValue('trading_price')}
                  min={0}
                  step={0.001}
                  style={{ width: 170, position: 'absolute', marginTop: '5px' }}
                  placeholder="最小交易额"
                  addonAfter={getFieldValue('currency')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={1}>
            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>--</span>
          </Col>
          <Col span={3}>
            <FormItem>
              {getFieldDecorator('max_volume', {
                initialValue: initialValues.max_volume,
                onChange: this.handleChangeMax,
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
                <InputNumber
                  disabled={!getFieldValue('trading_price')}
                  min={0}
                  step={0.001}
                  style={{ width: 170, position: 'absolute', marginTop: '5px' }}
                  placeholder="最大交易额"
                  addonAfter={getFieldValue('currency')}
                />
              )}
            </FormItem>
          </Col>
        </FormItem>

        <Col span={50}>
          <FormItem {...formItemLayout} label="付款期限">
            {getFieldDecorator('payment_limit', {
              initialValue: initialValues.payment_limit,
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(
              <InputNumber
                min={10}
                max={30}
                step={1}
                precision={0}
                style={{ width: 170 }}
                placeholder="付款期限"
                addonAfter="分钟"
              />
            )}
          </FormItem>
        </Col>
        {getFieldValue('ad_type') === '2' ? (
          <div>
            {payments.length === 0 ? (
              <FormItem {...formItemLayout} label="付款方式">
                <a>请先加入付款方式</a>
              </FormItem>
            ) : (
              <FormItem {...formItemLayout} label="付款方式">
                {getFieldDecorator('payment_methods', {
                  initialValue: initialValues.payment_methods,
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
            )}
          </div>
        ) : null}

        <FormItem {...formItemLayout} required label="安全选项">
          <div>
            <div>
              {getFieldDecorator('trusted_user', {})(
                <Checkbox onChange={this.handleChangeTrust}>仅限受信任的交易者</Checkbox>
              )}
            </div>
            {form.getFieldValue('trusted_user') ? (
              ''
            ) : (
              <div>
                <span className="bt-trade-level-auth">交易者的认证等级</span>
                <span style={{ marginLeft: 20 }}>
                  {getFieldDecorator('way', {
                    initialValue: '0',
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
            )}
          </div>
        </FormItem>

        <FormItem {...formItemLayout} label="交易条款">
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
        {getFieldValue('ad_type') === '1' ? (
          ''
        ) : (
          <div>
            <FormItem {...formItemLayout} label="最小交易量">
              {getFieldDecorator('min_trade_count', {})(
                <InputNumber
                  min={0}
                  step={0.0001}
                  placeholder="最小交易量"
                  style={{ width: 170 }}
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="最低评价得分">
              {getFieldDecorator('min_rating_score', {})(
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: 170, position: 'absolute', marginTop: '5px' }}
                  placeholder="最大交易额"
                  addonAfter="%"
                />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="新卖家限额">
              {getFieldDecorator('new_buyer_limit', {})(
                <InputNumber
                  min={0}
                  step={0.0001}
                  placeholder="新卖家限额"
                  style={{ width: 170 }}
                />
              )}
            </FormItem>
            {/*<FormItem {...formItemLayout} label="付款详细信息">*/}
            {/*{getFieldDecorator('trading_notes', {})(*/}
            {/*<TextArea placeholder="付款详细信息" rows={4} style={{ width: 390 }} />*/}
            {/*)}*/}
            {/*</FormItem>*/}
          </div>
        )}

        <FormItem>
          <div className={styles.btnBox}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {initialValues.id ? '确认修改' : '确认发布'}
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}
