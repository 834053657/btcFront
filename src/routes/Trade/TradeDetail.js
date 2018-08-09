import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Row, Col, Badge, Form, Input, Avatar, Icon, Checkbox } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { map, isNumber, floor, omit } from 'lodash';
import DescriptionList from 'components/DescriptionList';
import { routerRedux } from 'dva/router';
import InputNumber from 'components/InputNumber';
import ConfirmModal from 'components/ConfirmModal';
import PayMethodModal from '../UserCenter/modals/PayMethodModal';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TradeDetail.less';
import { getPayIcon } from '../../utils/utils';

const { Description } = DescriptionList;
const { Meta } = Card;
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
  },
  wrapperCol: {
    sm: { span: 20 },
  },
};

@connect(({ trade, user, loading }) => ({
  currentUser: user.currentUser,
  detail: trade.detail,
  loading: loading.effects['trade/fetchDetail'],
  submitting: loading.effects['trade/createOrder'],
}))
@Form.create()
export default class TradeDetail extends PureComponent {
  state = {
    reportAdModal: false,
    payMethodModalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'trade/fetchDetail',
      payload: { id: this.props.match.params.id },
    });
  }

  handleSubmitReport = (err, values) => {
    if (!err) {
      const { dispatch, match: { params = {} } } = this.props;
      dispatch({
        type: 'trade/reportAd',
        payload: { ...values, ad_id: params.id },
        callback: this.handleHideReportModal,
      });
    }
  };

  handleChangeVolume = v => {
    if (!isNumber(v)) {
      return;
    }
    const { detail = {}, form } = this.props;
    const trading_count = floor(v / detail.trading_price, 4);

    form.setFieldsValue({ trading_count });
  };

  handleChangeCount = v => {
    if (!isNumber(v)) {
      return;
    }
    const { detail = {}, form } = this.props;
    const trading_volume = floor(v * detail.trading_price, 2);

    form.setFieldsValue({ trading_volume });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { detail = {}, match: { params } } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'trade/createOrder',
          payload: {
            ad_id: params.id,
            ...values,
          },
        });
      }
    });
  };

  hidePayMethodModal = () => {
    this.setState({
      payMethodModalVisible: false,
    });
  };

  getUserAccount = info => {
    const { payment_method, payment_detail = {} } = info || {};
    if (payment_method === 'bank') {
      return payment_detail.bank_account;
    } else {
      return payment_detail.account;
    }
  };

  showReportModal = () => {
    this.setState({
      reportAdModal: true,
    });
  };

  handleHideReportModal = () => {
    this.setState({
      reportAdModal: false,
    });
  };

  showAddPaymentsModal = () => {
    this.setState({
      payMethodModalVisible: true,
    });
  };

  render() {
    const { submitting, detail = {}, currentUser } = this.props;
    console.log(detail.max_count,typeof(detail.max_count) ,'detail.max_count')
    const { getFieldDecorator } = this.props.form;
    const { payments = {} } = currentUser || {};
    const { owner = {}, ad_type } = detail || {};
    const breadcrumbList = [{ title: <FM id='tradeDetail.main_page' defaultMessage='首页' />, href: '/' }, { title: <FM id='tradeDetail.ad_detail' defaultMessage='广告详情' /> }];
    // const currencyDes =  detail.currency ? CONFIG.currencyList[detail.currency]: '-';
    const existsPayments = map(payments, item => item.payment_method);
    const ENABLE_PAY_MENTS = omit(CONFIG.payments, existsPayments);

    return (
      <PageHeaderLayout
        className="ant-layout-content"
        title={ad_type ? <FM id='tradeDetail.buy_sell_title' defaultMessage='{buyOrSell}比特币' values={{buyOrSell:CONFIG.trade_ad_type[ad_type]}} /> : null}
        breadcrumbList={breadcrumbList}
      >
        <div className={styles.page}>
          <Row gutter={24}>
            <Col span={14} className={styles.left}>
              <Card bordered={false} className={styles.info}>
                <Meta
                  avatar={
                    <Badge status={owner.online ? 'success' : 'default'} offset={[35, -5]} dot>
                      <Avatar
                        size="large"
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      />
                    </Badge>
                  }
                  title={owner.nickname}
                  description={
                    owner.country_code && CONFIG.countrysMap[owner.country_code]
                      ? CONFIG.countrysMap[owner.country_code].name
                      : '-'
                  }
                />
                <DescriptionList style={{ marginTop: 15 }} size="large" col="2">
                  <Description term={<FM id='tradeDetail.trading_price_' defaultMessage='交易价格' />}>
                    {detail.trading_price} {detail.currency} / BTC
                  </Description>
                  <Description term={<FM id='tradeDetail.deal_price_limit' defaultMessage='交易限额' />}>
                    {' '}
                    {detail.max_count} BTC ({detail.min_volume} {detail.currency} ~{' '}
                    {detail.max_volume} {detail.currency})
                  </Description>
                  <Description term={<FM id='tradeDetail.user_good_ratio' defaultMessage='交易笔数 / 好评率' />}>
                    {' '}
                    {owner.trade_times} / {owner.good_ratio}%
                  </Description>
                  <Description term={<FM id='tradeDetail.user_payment_limit' defaultMessage='付款期限' />}>{detail.payment_limit} <FM id='tradeDetail.payment_minute' defaultMessage='分钟' /></Description>
                  {ad_type === 2 && (
                    <Description term={<FM id='tradeDetail.user_payment_methods' defaultMessage='付款方式' />}>
                      {map(detail.payment_methods, item => (
                        <Icon className={styles.pay_method} key={item} type={getPayIcon(item)} />
                      ))}
                    </Description>
                  )}
                </DescriptionList>
                <Form hideRequiredMark style={{ marginTop: 15 }} onSubmit={this.handleSubmit}>
                  {ad_type === 1 ? ( // 买入的广告类型 才需要用户添加收款方式
                    <div>
                      {
                        <FormItem {...formItemLayout} label={<FM id='tradeDetail.payment_methods_get' defaultMessage='收款方式' />}>
                          {//   payments.length <= 0 ? (
                          //   <a onClick={this.showAddPaymentsModal}>请先添加收款方式</a>
                          // ) : (
                          getFieldDecorator('payment_methods', {
                            rules: [
                              {
                                required: true,
                                message: <FM id='tradeDetail.payment_methods_choose' defaultMessage='请选择收款方式' />,
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
                              <Checkbox value=""><FM id='tradeDetail.payment_methods_other' defaultMessage='其他' /></Checkbox>
                            </Checkbox.Group>
                          )}
                        </FormItem>
                      }
                    </div>
                  ) : null}
                  <FormItem label={<FM id='tradeDetail.user_buyOrSell_title' defaultMessage='我要{buyOrSell}' values={{buyOrSell:CONFIG.trade_ad_type[ad_type]}} />} {...formItemLayout}>
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('trading_volume', {
                          onChange: this.handleChangeVolume,
                          rules: [
                            { required: true, message: <FM id='tradeDetail.trading_volume_please' defaultMessage='请输入' /> },
                            {
                              type: 'number',
                              min: detail.min_volume,
                              max: detail.max_volume,
                              message: <FM id='tradeDetail.deal_limit_price_' defaultMessage='交易限额为{min} ~ {max}' values={{min:detail.min_volume,max:detail.max_volume}} />,
                            },
                          ],
                        })(
                          <InputNumber
                            min={0}
                            precision={2}
                            size="large"
                            addonAfter={detail.currency}
                          />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={2}>
                      <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                        -
                      </span>
                    </Col>
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('trading_count', {
                          onChange: this.handleChangeCount,
                          rules: [
                            { required: true, message: <FM id='tradeDetail.trading_count_please' defaultMessage='请输入' /> },
                            {
                              type: 'number',
                              max: detail.max_count,
                              message: <FM id='tradeDetail.trading_count_max' defaultMessage='最大可交易数量为{max}' values={{max:detail.max_count}} />,
                            },
                          ],
                        })(<InputNumber precision={4} size="large" addonAfter="BTC" />)}
                      </FormItem>
                    </Col>
                  </FormItem>
                  <FormItem label={<FM id='tradeDetail.trading_notes_title' defaultMessage='交易备注' />} {...formItemLayout}>
                    {getFieldDecorator('trading_notes', {
                      rules: [],
                    })(<TextArea rows={6} />)}
                  </FormItem>

                  <FormItem className={styles.buttonBox}>
                    <Button key="back" onClick={() => this.props.dispatch(routerRedux.goBack())}>
                      <FM id='tradeDetail.btn_cancel' defaultMessage='取消' />
                    </Button>
                    <Button
                      loading={submitting}
                      style={{ marginLeft: 15 }}
                      type="primary"
                      htmlType="submit"
                    >
                      <FM id='tradeDetail.btn_submit' defaultMessage='提交' />
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            </Col>
            <Col span={10} className={styles.right}>
              <Card
                className={styles.term_box}
                title={<FM id='tradeDetail.use_name' defaultMessage='用户{name}的交易条款' values={{name:owner.nickname}} />}
                actions={[
                  <a className={styles.report} onClick={this.showReportModal}>
                    <Icon type="flag" /> <FM id='tradeDetail.report_order' defaultMessage='举报这则交易信息' />
                  </a>,
                ]}
              >
                <p>{detail.trading_term}</p>
              </Card>
            </Col>
          </Row>
        </div>

        <ConfirmModal
          visible={this.state.reportAdModal}
          title={<FM id='tradeDetail.report' defaultMessage='举报' />}
          onSubmit={this.handleSubmitReport}
          onCancel={this.handleHideReportModal}
        />

        <PayMethodModal
          {...this.props}
          payMents={ENABLE_PAY_MENTS}
          title={<FM id='tradeDetail.add_pay_method' defaultMessage='添加支付方式' />}
          data={this.state.payMethodModalVisible}
          onCancel={this.hidePayMethodModal}
        />
      </PageHeaderLayout>
    );
  }
}
