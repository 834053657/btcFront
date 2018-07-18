import React, { Component } from 'react';
import { Select, Button, Form, Input, Radio, Checkbox, Col, Card, Alert, Icon } from 'antd';
import { map, floor } from 'lodash';
import { Link } from 'dva/router';
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
    console.log(obj);
    this.props.dispatch({
      type: 'ad/fetchNewPrice',
      payload: {
        currency: obj || 'CNY',
      },
    });
    this.setState({ freshLoading: true });
    setTimeout(() => {
      this.setState({ freshLoading: false });
    }, 1000);
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { id } = this.props.initialValues || {};
        this.props.onSubmit && this.props.onSubmit({ ...values });
      }
    });
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  };
  handleChange = e => {};

  getUserAccount = info => {
    console.log(info);
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
      callback('不能小于最小可交易额');
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
    const newPrice =
      form.getFieldValue('currency') === 'CNY' ? price.ad_price_cny : price.ad_price_usd;
    const trading_price = floor(ratio * newPrice / 100, 4);

    const numBTC = form.getFieldValue('max_count');
    const max_volume = floor(numBTC * trading_price, 2);

    const re = /^[+-]?\d*\.?\d*$/;
    if (re.test(ratio)) {
      form.setFieldsValue({ trading_price });
      if (numBTC !== null) {
        if (!isNaN(max_volume)) {
          form.setFieldsValue({ max_volume });
        }
      }
    }
  };

  // 计算最大发布交易额
  handleChangeBtc = v => {
    const { form } = this.props;
    const nums = form.getFieldValue('trading_price');
    const numBTC = v;

    const max_volume = floor(numBTC * nums, 2);

    const re = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (re.test(numBTC)) {
      form.setFieldsValue({ max_volume });
    }
  };

  // 计算交易比特币限额
  handleChangeMax = e => {
    const { form } = this.props;
    const num = form.getFieldValue('trading_price');
    const numMax = e;
    const max_count = floor(numMax * (1 / num), 4);
    const re = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;

    if (re.test(numMax)) {
      form.setFieldsValue({ max_count });
    }
  };
  // 计算交易价格
  handleChangeRat = e => {
    const { form, price } = this.props;
    const numBTC = form.getFieldValue('max_count');
    const numMax = e;
    const newPrice =
      form.getFieldValue('currency') === 'CNY' ? price.ad_price_cny : price.ad_price_usd;
    const trading_price_ratio = floor(numMax / newPrice * 100, 4);

    const re = /^[+-]?\d*\.?\d*$/;

    if (re.test(numMax)) {
      form.setFieldsValue({ trading_price_ratio }, () => {
        this.handleChangeBtc(numBTC);
      });
    }
  };

  handleChangeCur = currency => {
    const { form } = this.props;
    form.setFieldsValue({ trading_price: 0 });
    form.setFieldsValue({ trading_price_ratio: 0 });
    form.setFieldsValue({ max_volume: 0 });

    this.setState({
      nowCurrency: currency,
    });
    return currency;
  };

  clickBtn = value => {};

  render() {
    console.log(this.props);
    const { form, num, price = {}, initialValues = {}, submitting, currentUser } = this.props;
    const { getFieldDecorator, getFieldValue } = form || {};
    const { payments = {} } = currentUser || {};

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
                  precision={4}
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
                  {getFieldValue('currency') === 'CNY' ? price.ad_price_cny : price.ad_price_usd}{' '}
                  {getFieldValue('currency')} / BTC
                </span>
                <Button
                  type="primary"
                  onClick={this.fetchRefresh.bind(this, getFieldValue('currency'))}
                  loading={this.state.freshLoading}
                >
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
              precision={4}
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
                  { type: 'number', min: 0.0001, message: '最少交易0.0001BTC' },
                ],
              })(
                <InputNumber
                  disabled={!getFieldValue('trading_price')}
                  min={0}
                  precision={4}
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
                initialValue: initialValues.min_volume || 100,
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
                  min={100}
                  precision={2}
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
                  precision={2}
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
                <span>
                  <Link to="/user-center/index">请先加入付款方式</Link>
                </span>
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

        <FormItem {...formItemLayout} label="安全选项">
          <div>
            <FormItem>
              <div>
                {getFieldDecorator('trusted_user', {})(
                  <Checkbox onChange={this.handleChangeTrust}>仅限受信任的交易者</Checkbox>
                )}
              </div>
            </FormItem>
            <FormItem>
              {form.getFieldValue('trusted_user') ? (
                ''
              ) : (
                <div>
                  <span className="bt-trade-level-auth">交易者的认证等级</span>
                  <span style={{ marginLeft: 20 }}>
                    {getFieldDecorator('user_auth_level', {
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
            </FormItem>
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
                  placeholder="最低评价得分"
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
            {initialValues.id ? (
              <Button type="primary" htmlType="submit" loading={this.state.loading}>
                确认修改
              </Button>
            ) : num && num > 0 ? (
              <Button type="primary" htmlType="submit" loading={this.state.loading}>
                确认发布
              </Button>
            ) : (
              `您的剩余可发布广告条数为 ${num}`
            )}
          </div>
        </FormItem>
      </Form>
    );
  }
}
