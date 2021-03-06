import React, { Component } from 'react';
import { Select, Button, Form, Input, Radio, Checkbox, Row, Col, Card, Tooltip, Icon } from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import { map, floor, omit } from 'lodash';
import { Link } from 'dva/router';
import InputNumber from 'components/InputNumber';
import styles from './EditForm.less';
import { getLocale } from '../../../utils/authority';

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

const formItemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};

const typeMap = {
  '1': <FM id='editForm.buy_inline' defaultMessage='在线买入' />,
  '2': <FM id='editForm.sell_inline' defaultMessage='在线卖出' />,
};

const CheckboxGroup = Checkbox.Group;
const msg = defineMessages({
  user_local_choose_please: {
    id: 'editForm.user_local_choose_please',
    defaultMessage: '请选择所在地',
  },
  float_price_limit_radio: {
    id: 'editForm.float_price_limit_radio',
    defaultMessage: '市场价比例',
  },
  ad_deal_num: {
    id: 'editForm.ad_deal_num',
    defaultMessage: '广告总交易数额',
  },
  order_min_deal: {
    id: 'editForm.order_min_deal',
    defaultMessage: '单笔最小交易额',
  },
  max_volume_input_once: {
    id: 'editForm.max_volume_input_once',
    defaultMessage: '单笔最大交易额',
  },
  payment_limit_title_input: {
    id: 'editForm.payment_limit_title_input',
    defaultMessage: '付款期限',
  },
  input_limit_max_word: {
    id: 'editForm.input_limit_max_word',
    defaultMessage: '交易条款(最多200个字符)',
  },
  min_trade_count_num: {
    id: 'editForm.min_trade_count_num',
    defaultMessage: '最小成交数',
  },
  min_rating_score_holder: {
    id: 'editForm.min_rating_score_holder',
    defaultMessage: '最低评价得分',
  },
  new_buyer_limit: {
    id: 'editForm.new_buyer_limit',
    defaultMessage: '新卖家限额',
  },
});
@injectIntl()
@Form.create()
export default class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grade: true,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      const valued = omit(values, ['trading_price_ratio_choose']);
      if (!err) {
        const { id } = this.props.initialValues || {};
        this.props.onSubmit && this.props.onSubmit({ ...valued, id });
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
      callback(<FM id='editForm.max_limit_num' defaultMessage='不能大于最大可交易额' />);
    } else {
      callback();
    }
  };

  checkMaxPrice = (ruler, value, callback) => {
    const { form } = this.props;

    if (value < form.getFieldValue('min_volume')) {
      callback(<FM id='editForm.min_limit_num' defaultMessage='不能小于最小可交易额' />);
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
    // const max_volume = floor(numBTC * trading_price, 2);

    const re = /^[+-]?\d*\.?\d*$/;
    if (re.test(ratio)) {
      form.setFieldsValue({ trading_price });
      // if (numBTC !== null) {
      //   if (!isNaN(max_volume)) {
      //     form.setFieldsValue({ max_volume });
      //   }
      // }
    }
  };

  // 计算最大发布交易额
  // handleChangeBtc = v => {
  //   const { form } = this.props;
  //   const nums = form.getFieldValue('trading_price');
  //   const numBTC = v;
  //
  //   const max_volume = floor(numBTC * nums, 2);
  //
  //   const re = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
  //   if (re.test(numBTC)) {
  //     form.setFieldsValue({ max_volume });
  //   }
  // };

  // 计算交易比特币限额
  // handleChangeMax = e => {
  //   const { form } = this.props;
  //   const num = form.getFieldValue('trading_price');
  //   const numMax = e;
  //   const max_count = floor(numMax * (1 / num), 4);
  //   const re = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
  //
  //   if (re.test(numMax)) {
  //     form.setFieldsValue({ max_count });
  //   }
  // };
  // 计算交易价格
  // handleChangeRat = e => {
  //   const { form, price } = this.props;
  //   const numBTC = form.getFieldValue('max_count');
  //   const numMax = e;
  //   const newPrice =
  //     form.getFieldValue('currency') === 'CNY' ? price.ad_price_cny : price.ad_price_usd;
  //   const trading_price_ratio = floor(numMax / newPrice * 100, 4);
  //
  //   const re = /^[+-]?\d*\.?\d*$/;
  //
  //   if (re.test(numMax)) {
  //     form.setFieldsValue({ trading_price_ratio }, () => {
  //       this.handleChangeBtc(numBTC);
  //     });
  //   }
  // };

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
    const {
      form,
      num,
      price = {},
      initialValues = {},
      freshLoading,
      submitting,
      currentUser,
      getPrice,
    } = this.props;
    const { getFieldDecorator, getFieldValue } = form || {};
    const { payments = {} } = currentUser || {};
    // const FloatPriceDom = (
    //
    // )
    const floatPrice = !!getFieldValue('trading_price_ratio_choose');

    const lang = getLocale() || 'zh_CN';
    const autoRespond = CONFIG[`auto_replies_msg_${lang}`]
    return (
      <Form className={styles.form} hideRequiredMark onSubmit={this.handleSubmit}>
        <FormItem>
          <div className={styles.chooseBtn}>
            {getFieldDecorator('ad_type', {
              initialValue: initialValues.ad_type ? initialValues.ad_type : 1,
              rules: [
                {
                  required: true,
                  message: <FM id='editForm.ad_type_choose' defaultMessage='请选择' />,
                },
              ],
            })(
              <RadioGroup size="large" disabled={!!initialValues.id}>
                {map(typeMap, (text, value) => (
                  <RadioButton
                    key={value}
                    value={+value}
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

        <Card style={{ margin: 15, width: 810 }} title={<FM id='editForm.ad_rules' defaultMessage='广告规则' />}>
          <li>
            <FM id='tradeDetail.main_page' defaultMessage='要想显示您的交易广告，您的【utomarket】钱包中需要有比特币。使用在线付款的交易广告至少需要0.05 BTC。' />
          </li>
          <li><FM id='editForm.ad_rule_1' defaultMessage='特定付款方式要求您验证身份，然后您的交易广告才会显示。' /></li>
          <li><FM id='editForm.ad_rule_2' defaultMessage='每笔完成的交易均会消耗广告主 1% 的总交易金额。查看我们费用页面上的所有费用。' /></li>
          <li><FM id='editForm.ad_rule_3' defaultMessage='发起交易后，价格就会确定，除非定价中有明显的错误。' /></li>
          <li><FM id='editForm.ad_rule_4' defaultMessage='您不能代表其他人（由经纪人处理）购买或出售比特币。' /></li>
          <li><FM id='editForm.ad_rule_5' defaultMessage='您仅可以使用以自己名字注册的付款帐户（非第三方付款！）。' /></li>
          <li><FM id='editForm.ad_rule_6' defaultMessage='您必须在交易广告或交易聊天中提供您的付款详细信息。' /></li>
          <li><FM id='editForm.ad_rule_7' defaultMessage='所有交流必须在utomarket.com 上进行。' /></li>
          <li>

            <FM id='editForm.ad_rule_8' defaultMessage='标记为高风险的付款方式具有很大的欺诈风险。在使用高风险付款方式时，请务必小心且始终要求您的交易对方验证身份。' />
          </li>
        </Card>

        <FormItem {...formItemLayout} label={<FM id='editForm.user_local' defaultMessage='所在地' />}>
          {getFieldDecorator('country_code', {
            initialValue: initialValues.country_code,
            rules: [
              {
                required: true,
                message: <FM id='editForm.user_local_choose' defaultMessage='请选择所在地' />,
              },
            ],
          })(
            <Select style={{ width: 185 }} placeholder={this.props.intl.formatMessage(msg.user_local_choose_please)}>
              {/*请选择所在地*/}
              {map(CONFIG.country, item => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
          <span style={{ marginLeft: '20px' }}>
            <Tooltip title={CONFIG.tooltip[1]}>
              <Icon className="bt-icon-question" type="question-circle" title="" />
            </Tooltip>
          </span>
        </FormItem>

        <FormItem {...formItemLayout} label={<FM id='editForm.deal_currency' defaultMessage='交易币种' />}>
          {getFieldDecorator('currency', {
            onChange: this.handleChangeCur,
            initialValue: initialValues.currency || 'CNY',
            rules: [
              {
                required: true,
                message: <FM id='editForm.deal_currency_choose' defaultMessage='请选择' />,
              },
            ],
          })(
            <Select style={{ width: 185 }}>
              {map(CONFIG.currencyList, (text, value) => (
                <Option key={value} value={value}>
                  {text}
                </Option>
              ))}
            </Select>
          )}
          <span style={{ marginLeft: '20px' }}>
            <Tooltip title={CONFIG.tooltip[2]}>
              <Icon className="bt-icon-question" type="question-circle" title="" />
            </Tooltip>
          </span>
        </FormItem>

        <FormItem {...formItemLayout} label={<FM id='editForm.market_choose_price' defaultMessage='市场参考价格' />}>
          <Col span={7} className={styles.market_price}>
            <FormItem>
              <span style={{ marginRight: '20px' }}>
                {getFieldValue('currency') === 'CNY' ? price.ad_price_cny : price.ad_price_usd}{' '}
                {getFieldValue('currency')} / BTC
              </span>
              <Button
                type="ghost"
                onClick={getPrice.bind(this, getFieldValue('currency'))}
                loading={freshLoading}
              >
                <FM id='editForm.btn_refresh' defaultMessage='刷新' />
              </Button>
            </FormItem>
          </Col>
          <Col>
            <span style={{ marginLeft: '40px' }}>
              <Tooltip title={CONFIG.tooltip[5]}>
                <Icon className="bt-icon-question" type="question-circle" title="" />
              </Tooltip>
            </span>
          </Col>
        </FormItem>

        <FormItem label={<FM id='editForm.deal_price_' defaultMessage='交易价格' />} {...formItemLayout}>
          <Col span={6}>
            {getFieldDecorator('trading_price', {
              initialValue: initialValues.trading_price,
              onChange: this.handleChangeRat,
              rules: [
                {
                  required: true,
                  type: 'number',
                  min: 0.0001,
                  message: <FM id='editForm.deal_price_input' defaultMessage='请输入交易价格' />,
                },
              ],
            })(
              <InputNumber
                min={0}
                precision={4}
                placeholder={`${getFieldValue('currency')}/BTC`}
                style={{ width: 185 }}
                onChange={this.handleChange}
                disabled={floatPrice}
              />
            )}
          </Col>
          <span style={{ marginLeft: '32px' }}>
            <Tooltip title={CONFIG.tooltip[6]}>
              <Icon className="bt-icon-question" type="question-circle" title="" />
            </Tooltip>
          </span>
        </FormItem>

        {floatPrice ? (
          <FormItem label={<FM id='editForm.float_price' defaultMessage='浮动比例' />} {...formItemLayout}>
            <Col span={7} className={styles.no_margin_floatPrice_input}>
              <FormItem>
                {getFieldDecorator('trading_price_ratio', {
                  initialValue: initialValues.trading_price_ratio,
                  onChange: this.handleChangePer,
                  rules: [
                    {
                      required: true,
                      message: <FM id='editForm.float_price_input' defaultMessage='请输入浮动比例' />,
                    },
                    {
                      type: 'number',
                      max: 170,
                      min: 30,
                      message: <FM id='editForm.float_price_limit' defaultMessage='浮动比例 30% ~ 170%' />,
                    },
                  ],
                })(
                  <InputNumber
                    // min={30}
                    // max={170}
                    precision={2}
                    style={{ width: 185 }}
                    placeholder={this.props.intl.formatMessage(msg.float_price_limit_radio)}
                    addonAfter="%"
                  />
                )}
              </FormItem>
            </Col>
            <Col span={1}>
              <span style={{ marginLeft: '15px' }}>
                <Tooltip title={CONFIG.tooltip[17]}>
                  <Icon className="bt-icon-question" type="question-circle" title="" />
                </Tooltip>
              </span>
            </Col>
          </FormItem>
        ) : null}

        <FormItem {...formItemLayout} label={<FM id='editForm.float_check_price' defaultMessage='浮动价格' />}>
          <Col span={7} className={styles.no_margin_floatPrice}>
            <FormItem>
              {getFieldDecorator('trading_price_ratio_choose', {
                initialValue: !!initialValues.trading_price_ratio,
                valuePropName: 'checked',
                rules: [],
              })(<Checkbox><FM id='editForm.float_check_price_please' defaultMessage='使用浮动价格' /></Checkbox>)}
            </FormItem>
          </Col>
          <Col span={1}>
            <span>
              <Tooltip title={CONFIG.tooltip[4]}>
                <Icon className="bt-icon-question" type="question-circle" title="" />
              </Tooltip>
            </span>
          </Col>
        </FormItem>

        <FormItem label={<FM id='editForm.ad_order_num' defaultMessage='广告交易数量' />} {...formItemLayout}>
          <Col span={7} className={styles.no_margin_num}>
            <FormItem>
              {getFieldDecorator('max_count', {
                initialValue: initialValues.max_count,
                onChange: this.handleChangeBtc,
                rules: [
                  {
                    required: true,
                    message: <FM id='editForm.ad_order_num_input' defaultMessage='请输入可交易数量' />,
                  },
                  { type: 'number', min: 0.0001, message: <FM id='editForm.ad_order_num_limit' defaultMessage='最少交易0.0001BTC' /> },
                ],
              })(
                <InputNumber
                  // disabled={!getFieldValue('trading_price')}
                  min={0}
                  precision={4}
                  style={{ width: 185, position: 'absolute', marginTop: '5px' }}
                  placeholder={this.props.intl.formatMessage(msg.ad_deal_num)}
                  addonAfter="BTC"
                />
              )}
            </FormItem>
          </Col>
          <span style={{ marginLeft: '18px' }}>
            <Tooltip title={CONFIG.tooltip[16]}>
              <Icon className="bt-icon-question" type="question-circle" title="" />
            </Tooltip>
          </span>
        </FormItem>

        <FormItem label={<FM id='editForm.deal_order_limit_once' defaultMessage='单笔交易限额' />} {...formItemLayout}>
          {/*<Col span={7} className={styles.no_margin}>*/}
          {/*<FormItem>*/}
          {/*{getFieldDecorator('max_count', {*/}
          {/*initialValue: initialValues.max_count,*/}
          {/*onChange: this.handleChangeBtc,*/}
          {/*rules: [*/}
          {/*{*/}
          {/*required: true,*/}
          {/*message: '请输入可交易数量',*/}
          {/*},*/}
          {/*{ type: 'number', min: 0.0001, message: '最少交易0.0001BTC' },*/}
          {/*],*/}
          {/*})(*/}
          {/*<InputNumber*/}
          {/*// disabled={!getFieldValue('trading_price')}*/}
          {/*min={0}*/}
          {/*precision={4}*/}
          {/*style={{ width: 170, position: 'absolute', marginTop: '5px' }}*/}
          {/*placeholder="广告总交易数"*/}
          {/*addonAfter="BTC"*/}
          {/*/>*/}
          {/*)}*/}
          {/*</FormItem>*/}
          {/*</Col>*/}
          <Col span={7} className={styles.no_margin}>
            <FormItem>
              {getFieldDecorator('min_volume', {
                initialValue: initialValues.min_volume || 100,
                rules: [
                  {
                    required: true,
                    message: <FM id='editForm.deal_order_limit_once_please' defaultMessage='请输入' />,
                  },
                  {
                    validator: this.checkMinPrice,
                  },
                ],
              })(
                <InputNumber
                  // disabled={!getFieldValue('trading_price')}
                  min={100}
                  precision={2}
                  style={{ width: 185, position: 'absolute', marginTop: '5px' }}
                  placeholder={this.props.intl.formatMessage(msg.order_min_deal)}
                  addonAfter={getFieldValue('currency')}
                />
              )}
            </FormItem>
          </Col>
          <Col span={2}>
            <span style={{ display: 'inline-block', width: '135%', textAlign: 'center' }}>--</span>
          </Col>
          <Col span={3}>
            <FormItem>
              {getFieldDecorator('max_volume', {
                initialValue: initialValues.max_volume,
                onChange: this.handleChangeMax,
                rules: [
                  {
                    required: true,
                    message: <FM id='editForm.max_volume_input_please' defaultMessage='请输入' />,
                  },
                  {
                    validator: this.checkMaxPrice,
                  },
                ],
              })(
                <InputNumber
                  // disabled={!getFieldValue('trading_price')}
                  min={0}
                  precision={2}
                  style={{ width: 185, position: 'absolute', marginTop: '5px' }}
                  placeholder={this.props.intl.formatMessage(msg.max_volume_input_once)}
                  addonAfter={getFieldValue('currency')}
                />
              )}
            </FormItem>
          </Col>
          <div style={{ marginLeft: '475px' }}>
            <Tooltip title={CONFIG.tooltip[7]}>
              <Icon className="bt-icon-question" type="question-circle" title="" />
            </Tooltip>
          </div>
        </FormItem>

        <FormItem {...formItemLayout} label={<FM id='editForm.payment_limit_title' defaultMessage='付款期限' />}>
          <Col span={6}>
            {getFieldDecorator('payment_limit', {
              initialValue: initialValues.payment_limit,
              rules: [
                {
                  required: true,
                  message: <FM id='editForm.payment_limit_title_please' defaultMessage='请输入' />,
                },
              ],
            })(
              <InputNumber
                min={10}
                max={30}
                step={1}
                precision={0}
                style={{ width: 185 }}
                placeholder={this.props.intl.formatMessage(msg.payment_limit_title_input)}
                addonAfter="分钟"
              />
            )}
          </Col>
          <span style={{ marginLeft: '30px' }}>
            <Tooltip title={CONFIG.tooltip[12]}>
              <Icon className="bt-icon-question" type="question-circle" title="" />
            </Tooltip>
          </span>
        </FormItem>

        {getFieldValue('ad_type') === 2 ? (
          <div>
            {/*{payments.length === 0 ? (*/}
            {/*<FormItem {...formItemLayout} label="收款方式">*/}
            {/*<span>*/}
            {/*<Link to="/user-center/index">请先添加收款方式</Link>*/}
            {/*</span>*/}
            {/*<span style={{ marginLeft: '16px' }}>*/}
            {/*<Tooltip title={CONFIG.tooltip[14]}>*/}
            {/*<Icon className="bt-icon-question" type="question-circle" title="" />*/}
            {/*</Tooltip>*/}
            {/*</span>*/}
            {/*</FormItem>*/}
            {/*) : (*/}
            <FormItem {...formItemLayout} label={<FM id='editForm.payment_methods_title' defaultMessage='收款方式' />}>
              {getFieldDecorator('payment_methods', {
                initialValue: initialValues.payment_methods,
                rules: [
                  {
                    required: true,
                    message: <FM id='editForm.payment_methods_please' defaultMessage='请选择收款方式' />,
                  },
                ],
              })(
                <Checkbox.Group>
                  {map(CONFIG.payments, (text, value) => {
                    return (
                      <Checkbox key={value} value={value}>
                        {text}
                      </Checkbox>
                    );
                  })}
                  <Checkbox value=""><FM id='editForm.payment_methods_other' defaultMessage='其他' /></Checkbox>
                </Checkbox.Group>

                // <Select
                //   mode="multiple"
                //   style={{ maxWidth: 286, width: '100%' }}
                //   placeholder="选择收款方式"
                // >
                //   {map(payments, item => (
                //     <Option key={item.id} value={+item.id}>
                //       <span>
                //         {item.payment_method && CONFIG.payments[item.payment_method]
                //           ? CONFIG.payments[item.payment_method]
                //           : item.payment_method}
                //         <span> - </span>
                //         {this.getUserAccount(item)}
                //       </span>
                //     </Option>
                //   ))}
                // </Select>
                //
              )}
              <span style={{ marginLeft: '10px' }}>
                <Tooltip title={CONFIG.tooltip[3]}>
                  <Icon className="bt-icon-question" type="question-circle" title="" />
                </Tooltip>
              </span>
            </FormItem>
            {/*   )}   */}
          </div>
        ) : null}

        <FormItem {...formItemLayout} label={<FM id='editForm.trusted_user_title' defaultMessage='安全选项' />}>
          <div className={styles.trust_person}>
            <FormItem>
              <div>
                {getFieldDecorator('trusted_user', {
                  initialValue: initialValues.trusted_user,
                })(<Checkbox onChange={this.handleChangeTrust}><FM id='editForm.trusted_user_limit' defaultMessage='仅限受信任的交易者' /></Checkbox>)}
                <span style={{ marginLeft: '10px' }}>
                  <Tooltip title={CONFIG.tooltip[13]}>
                    <Icon className="bt-icon-question" type="question-circle" title="" />
                  </Tooltip>
                </span>
              </div>
            </FormItem>
            <FormItem>
              {getFieldValue('trusted_user') ? (
                ''
              ) : (
                <div>
                  <span className="bt-trade-level-auth"><FM id='editForm.user_auth_level_title' defaultMessage='交易者的认证等级' /></span>
                  <span style={{ marginLeft: 20 }}>
                    {getFieldDecorator('user_auth_level', {
                      initialValue: initialValues.user_auth_level || 0,
                      rules: [
                        {
                          required: true,
                          message: <FM id='editForm.user_auth_level_choose' defaultMessage='请选择' />,
                        },
                      ],
                    })(
                      <RadioGroup>
                        {map(CONFIG.auth_level, (text, value) => (
                          <Radio key={value} value={+value}>
                            {text}
                          </Radio>
                        ))}
                        <Radio value={0}><FM id='editForm.user_auth_level_unLimit' defaultMessage='不限' /></Radio>
                      </RadioGroup>
                    )}
                  </span>
                </div>
              )}
            </FormItem>
          </div>
        </FormItem>

        <FormItem {...formItemLayout} label={<FM id='editForm.deal_rules_title' defaultMessage='交易条款' />}>
          {getFieldDecorator('trading_term', {
            initialValue: initialValues.trading_term,
            rules: [
              // {
              //   required: true,
              //   message: '请输入',
              // },
              {
                max: 200,
                message: <FM id='editForm.input_limit_max' defaultMessage='最多输入200个字符' />,
              },
            ],
          })(<TextArea placeholder={this.props.intl.formatMessage(msg.input_limit_max_word)} rows={4} style={{ width: 390 }} />)}
          <span style={{ marginLeft: '10px' }}>
            <Tooltip title={CONFIG.tooltip[8]}>
              <Icon className="bt-icon-question" type="question-circle" title="" />
            </Tooltip>
          </span>
        </FormItem>

        <FormItem {...formItemLayout} label={<FM id='editForm.auto_replies_title' defaultMessage='自动回复' />}>
          {getFieldDecorator('auto_replies', {
            initialValue:
              initialValues.auto_replies,
            rules: [
              // {
              //   required: true,
              //   message: '请输入',
              // },
              {
                max: 200,
                message: <FM id='editForm.auto_replies_max_input' defaultMessage='最多输入200个字符' />,
              },
            ],
          })(
            <TextArea placeholder={autoRespond[getFieldValue('ad_type')]} rows={4} style={{ width: 390 }} />
          )}
          <span style={{ marginLeft: '10px' }}>
            <Tooltip title={CONFIG.tooltip[15]}>
              <Icon className="bt-icon-question" type="question-circle" title="" />
            </Tooltip>
          </span>
        </FormItem>
        {getFieldValue('ad_type') === 2 && (
          <div>
            <FormItem {...formItemLayout} label={<FM id='editForm.min_trade_count_title' defaultMessage='最小成交数' />}>
              <Col span={6}>
                {getFieldDecorator('min_trade_count', {
                  initialValue: initialValues.min_trade_count,
                })(
                  <InputNumber
                    min={0}
                    step={0.0001}
                    placeholder={this.props.intl.formatMessage(msg.min_trade_count_num)}
                    style={{ width: 185 }}
                  />
                )}
              </Col>
              <span style={{ marginLeft: '25px' }}>
                <Tooltip title={CONFIG.tooltip[9]}>
                  <Icon className="bt-icon-question" type="question-circle" title="" />
                </Tooltip>
              </span>
            </FormItem>

            <FormItem {...formItemLayout} label={<FM id='editForm.min_rating_score_title' defaultMessage='最低评价得分' />}>
              <Col span={6}>
                {getFieldDecorator('min_rating_score', {
                  initialValue: initialValues.min_rating_score,
                })(
                  <InputNumber
                    min={0.01}
                    precision={2}
                    max={100}
                    style={{ width: 185, position: 'absolute', marginTop: '5px' }}
                    placeholder={this.props.intl.formatMessage(msg.min_rating_score_holder)}
                    addonAfter="%"
                  />
                )}
              </Col>
              <span style={{ marginLeft: '25px' }}>
                <Tooltip title={CONFIG.tooltip[10]}>
                  <Icon className="bt-icon-question" type="question-circle" title="" />
                </Tooltip>
              </span>
            </FormItem>

            <FormItem {...formItemLayout} label={<FM id='editForm.new_buyer_limit_title' defaultMessage='新卖家限额' />}>
              <Col span={6}>
                {getFieldDecorator('new_buyer_limit', {
                  initialValue: initialValues.new_buyer_limit,
                })(
                  <InputNumber
                    min={0}
                    step={0.0001}
                    placeholder={this.props.intl.formatMessage(msg.new_buyer_limit)}
                    style={{ width: 185 }}
                  />
                )}
              </Col>
              <span style={{ marginLeft: '25px' }}>
                <Tooltip title={CONFIG.tooltip[11]}>
                  <Icon className="bt-icon-question" type="question-circle" title="" />
                </Tooltip>
              </span>
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
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FM id='editForm.btn_submit_change' defaultMessage='确认修改' />
              </Button>
            ) : num && num > 0 ? (
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FM id='editForm.btn_submit_publish' defaultMessage='确认发布' />
              </Button>
            ) : (
              <FM id='editForm.remain_order_num' defaultMessage='您的剩余可发布广告条数为 {num_}' values={{num_:num}} />
            )}
          </div>
        </FormItem>
      </Form>
    );
  }
}
