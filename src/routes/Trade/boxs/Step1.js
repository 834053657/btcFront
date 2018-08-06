import React, { PureComponent } from 'react';
import { map, size } from 'lodash';
import { Button, Card, Row, Col, Badge, Radio, Input, Steps, Icon } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import DescriptionList from 'components/DescriptionList';
import CountDown from 'components/CountDown';
import { getPayIcon } from '../../../utils/utils';
import EvaluateForm from '../forms/EvaluateForm';
import styles from './Step1.less';

const { Description } = DescriptionList;
const { Meta } = Card;

export default class Step1 extends PureComponent {
  state = {
    payType: 0,
  };

  componentDidMount() {}

  handleModeChange = e => {
    const payType = e.target.value;
    this.setState({
      payType,
    });
  };

  handleSubmitEvaluate = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'trade/postContent',
      payload: values,
    });
  };

  renderPaymentMethodInfo = info => {
    const { payment_detail = {}, payment_method } = info || {};
    let content = null;

    if (size(payment_detail) === 0) {
      return (
        <Card style={{ marginTop: 15 }}>
          <DescriptionList size="large" col="1">
            <Description>
              {this.checkIsBuyer()
                ? <FM id='step1.connect_setMessage' defaultMessage='暂未设置详细的交易信息，请联系对方。' />
                : <FM id='step1.not_message' defaultMessage='暂未设置详细的交易信息。' />}
            </Description>
          </DescriptionList>
        </Card>
      );
    }

    switch (payment_method) {
      case 'bank':
        content = (
          <Card style={{ marginTop: 15 }}>
            <DescriptionList size="large" col="1">
              <Description term={<FM id='step1.payment_method_bank' defaultMessage='支付方式' />}>{CONFIG.payments[payment_method] || '-'}</Description>
              <Description term={<FM id='step1.user_name_bank' defaultMessage='姓名' />}>{payment_detail.name}</Description>
              <Description term={<FM id='step1.card_bank' defaultMessage='卡号' />}>{payment_detail.bank_account}</Description>
              <Description term={<FM id='step1.open_main_bank' defaultMessage='开户行' />}>{payment_detail.bank_name}</Description>
              <Description term={<FM id='step1.open_bank' defaultMessage='开户支行' />}>{payment_detail.bank_branch_name}</Description>
            </DescriptionList>
          </Card>
        );
        break;
      case 'westernunion':
        content = (
          <Card style={{ marginTop: 15 }}>
            <DescriptionList size="large" col="1">
              <Description term={<FM id='step1.payment_method_we' defaultMessage='支付方式' />}>{CONFIG.payments[payment_method] || '-'}</Description>
              <Description term={<FM id='step1.name_we' defaultMessage='姓名' />}>{payment_detail.name}</Description>
              <Description term={<FM id='step1.pay_msg_we' defaultMessage='汇款信息' />}>{payment_detail.account}</Description>
            </DescriptionList>
          </Card>
        );
        break;
      case '':
        content = (
          <Card style={{ marginTop: 15 }}>
            <DescriptionList size="large" col="1">
              <Description term={<FM id='step1.pay_other' defaultMessage='支付方式' />}>请与买家沟通</Description>
            </DescriptionList>
          </Card>
        );
        break;
      default:
        content = (
          <Card style={{ marginTop: 15 }}>
            <DescriptionList size="large" col="1">
              <Description term={<FM id='step1.payment_method_' defaultMessage='支付方式' />}>{CONFIG.payments[payment_method] || '-'}</Description>
              <Description term={<FM id='step1.user_name_' defaultMessage='姓名' />}>{payment_detail.name}</Description>
              <Description term={<FM id='step1.account_' defaultMessage='账户' />}>{payment_detail.account}</Description>
              <Description term={<FM id='step1.code_img_' defaultMessage='收款码' />} />
              <img className={styles.codeUrl} src={payment_detail.ercodeUrl} alt={<FM id='step1.img_code' defaultMessage='收款码' />} />
            </DescriptionList>
          </Card>
        );
        break;
    }
    return content;
  };

  // 判断当前登录用户是否是买家
  checkIsBuyer = () => {
    const { ad = {}, trader = {}, order = {} } = this.props.orderDetail || {};
    const { user = {} } = this.props.currentUser || {};
    const { ad_type, owner = {} } = ad || {};
    const { id } = user || {};
    // ------- start 根据广告主 和 广告类型 以及当前登录人 判断谁是买家 start--------
    // if(登录人 ===  owner && 买入) || (登录人 !== owner   出售) {
    // console.log(`${CONFIG.ad_type[ad_type]}广告 当前登录人是 ${id === owner.id ? '广告主': '交易人'}`)
    // console.log(((id === owner.id && ad_type === 1) || (id !== owner.id && ad_type === 2))? '买家': '卖家')
    // return ((id === owner.id && ad_type === 1) || (id !== owner.id && ad_type === 2))
    // ------- end 根据广告主 和 广告类型 以及当前登录人 判断谁是买家 end--------

    // ------- start 根据下单人 和 订单类型 以及当前登录人 判断谁是买家 start--------
    return (
      (id === trader.id && order.order_type === 1) || (id !== trader.id && order.order_type === 2)
    );
    // ------- end 根据下单人 和 订单类型 以及当前登录人 判断谁是买家 end--------
  };

  render() {
    const { orderDetail, renderButtons, handleReport, currentUser } = this.props;
    const { ad = {}, order = {}, rating = {}, trader = {} } = orderDetail || {};
    const { user = {} } = currentUser || {};

    const { trading_price, owner = {}, currency, trading_term, payment_methods = [] } = ad || {};
    const { id, status, pay_limit_at, trading_count, trading_volume, order_type } = order || {};
    const order_status = CONFIG.orderEngStatus[status];
    const traderUser = trader.id === user.id ? owner : trader;

    return (
      <div className={styles.page}>
        <Card bordered={false} className={styles.info}>
          <Meta
            title={`${trading_volume} ${currency} ${
              // CONFIG.order_type_desc[order_type]
              this.checkIsBuyer() ? <FM id='step1.btc_buy' defaultMessage='买' /> : <FM id='step1.btc_sell' defaultMessage='卖' />
            } ${trading_count} BTC`}
            // description="中国"
          />
          <DescriptionList style={{ marginTop: 15 }} size="large" col="1">
            <Description term={<FM id='step1.trading_price_now' defaultMessage='汇率' />}>
              {trading_price} {currency} / BTC
            </Description>
            {/*<Description term="交易限额"> {trading_price_ratio} BTC ({min_volume} {currency} ~ {max_volume} {currency})</Description>*/}
            {order_status === 'wait_pay' && (
              <Description term={<FM id='step1.pay_time' defaultMessage='付款倒计时' />}>
                {pay_limit_at ? <CountDown target={pay_limit_at} formatstr="mm:ss" /> : null}
              </Description>
            )}
            {order_status !== 'cancel' ? (
              <Description term={<FM id='step1.pay_method' defaultMessage='付款方式' />}>
                <Radio.Group onChange={this.handleModeChange} value={this.state.payType}>
                  {map(payment_methods, (item, index) => (
                    <Radio.Button key={index} value={index}>
                      <Icon className={styles.pay_method} type={getPayIcon(item.payment_method)} />
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Description>
            ) : null}
          </DescriptionList>
          {order_status !== 'cancel' &&
            this.renderPaymentMethodInfo(payment_methods[this.state.payType])}
          <div className={styles.buttonBox}>{renderButtons && renderButtons(orderDetail)}</div>
          <Card
            className={styles.term_box}
            title={<FM id='step1.user_msg' defaultMessage='用户 {name} 的交易条款' values={{name:owner.nickname}} />}
            actions={[
              <a className={styles.report} onClick={handleReport}>
                <Icon type="flag" /> <FM id='step1.report_msg' defaultMessage='举报这则交易信息' />
              </a>,
            ]}
          >
            <p>{trading_term}</p>
          </Card>
          {!!~['done', 'cancel'].indexOf(order_status) && (
            <Card
              style={{ marginTop: '20px' }}
              className={styles.term_box}
              title={PROMPT('step1.to_user_evaluate',{evaluate:traderUser.nickname})
              // <FM id='step1.to_user_evaluate' defaultMessage='对用户{evaluate}留下评价' values={{evaluate:traderUser.nickname}} />
              }
            >
              {id && (
                <EvaluateForm
                  id={id}
                  initialValues={rating || {}}
                  onSubmit={this.handleSubmitEvaluate}
                />
              )}
            </Card>
          )}
        </Card>
      </div>
    );
  }
}
