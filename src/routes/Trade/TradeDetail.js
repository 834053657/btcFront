import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, Row, Col, Badge, Form, Input, Avatar, Icon, Select } from 'antd';
import { map, isNumber, floor,omit } from 'lodash';
import DescriptionList from 'components/DescriptionList';
import { routerRedux } from 'dva/router';
import InputNumber from 'components/InputNumber';
import ConfirmModal from 'components/ConfirmModal';
import PayMethodModal from '../UserCenter/modals/PayMethodModal';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TradeDetail.less';
import { getPayIcon } from '../../utils/utils';

const { Description } = DescriptionList;
const Option = Select.Option;
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
    payMethodModalVisible: false
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
      reportAdModal: true
    })
  }

  handleHideReportModal = () => {
    this.setState({
      reportAdModal: false
    })
  }

  showAddPaymentsModal = () => {
    this.setState({
      payMethodModalVisible: true
    })
  }

  render() {
    const { submitting, detail = {}, currentUser } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { payments = {} } = currentUser || {};
    const { owner = {}, ad_type } = detail || {};
    const breadcrumbList = [{ title: '首页', href: '/' }, { title: '广告详情'}];
    // const currencyDes =  detail.currency ? CONFIG.currencyList[detail.currency]: '-';
    const existsPayments = map(payments, item => item.payment_method)
    const ENABLE_PAY_MENTS = omit(CONFIG.payments, existsPayments);

    return (
      <PageHeaderLayout className="ant-layout-content" title={ad_type ?  `${CONFIG.trade_ad_type[ad_type]}比特币` : null} breadcrumbList={breadcrumbList}>
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
                  <Description term="交易价格">
                    {detail.trading_price} {detail.currency} / BTC
                  </Description>
                  <Description term="交易限额">
                    {' '}
                    {detail.max_count} BTC ({detail.min_volume} {detail.currency} ~{' '}
                    {detail.max_volume} {detail.currency})
                  </Description>
                  <Description term="交易笔数 / 好评率">
                    {' '}
                    {owner.trade_times} / {owner.good_ratio}%
                  </Description>
                  <Description term="付款期限">{detail.payment_limit} 分钟</Description>
                  {ad_type === 2 && (
                    <Description term="付款方式">
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
                        <FormItem {...formItemLayout} label="收款方式">
                          {payments.length <= 0 ? (
                            <a onClick={this.showAddPaymentsModal}>请先添加收款方式</a>
                          ) : (
                            getFieldDecorator('payment_methods', {
                              rules: [
                                {
                                  required: true,
                                  message: '请选择收款方式',
                                },
                              ],
                            })(
                              <Select size="large" mode="multiple" placeholder="请选择收款方式">
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
                            )
                          )}
                        </FormItem>
                      }
                    </div>
                  ) : null}
                  <FormItem label={`我要${CONFIG.order_type[ad_type]}`} {...formItemLayout}>
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('trading_volume', {
                          onChange: this.handleChangeVolume,
                          rules: [
                            { required: true, message: '请输入' },
                            {
                              type: 'number',
                              min: detail.min_volume,
                              max: detail.max_volume,
                              message: `交易限额为${detail.min_volume} ~ ${detail.max_volume}`,
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
                            { required: true, message: '请输入' },
                            {
                              type: 'number',
                              max: detail.max_count,
                              message: `最大可交易数量为${detail.max_count}`,
                            },
                          ],
                        })(<InputNumber precision={4} size="large" addonAfter="BTC" />)}
                      </FormItem>
                    </Col>
                  </FormItem>
                  <FormItem label="交易备注" {...formItemLayout}>
                    {getFieldDecorator('trading_notes', {
                      rules: [],
                    })(<TextArea rows={6} />)}
                  </FormItem>

                  <FormItem className={styles.buttonBox}>
                    <Button key="back" onClick={() => this.props.dispatch(routerRedux.goBack())}>
                      取消
                    </Button>
                    <Button
                      loading={submitting}
                      style={{ marginLeft: 15 }}
                      type="primary"
                      htmlType="submit"
                    >
                      提交
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            </Col>
            <Col span={10} className={styles.right}>
              <Card
                className={styles.term_box}
                title={`用户${owner.nickname}的交易条款`}
                actions={[
                  <a className={styles.report} onClick={this.showReportModal}>
                    <Icon type="flag" /> 举报这则交易信息
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
          title="举报"
          onSubmit={this.handleSubmitReport}
          onCancel={this.handleHideReportModal}
        />

        <PayMethodModal
          {...this.props}
          payMents={ENABLE_PAY_MENTS}
          title='添加支付方式'
          data={this.state.payMethodModalVisible}
          onCancel={this.hidePayMethodModal}
        />
      </PageHeaderLayout>
    );
  }
}
