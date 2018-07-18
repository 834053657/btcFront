import React, { PureComponent } from 'react';
import { map } from 'lodash';
import { Button, Card, Row, Col, Badge, Radio, Input, Steps, Icon } from 'antd';
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
    console.log('1', values);
    const { dispatch } = this.props;
    dispatch({
      type: 'trade/postContent',
      payload: values,
    });
  };

  renderPaymentMethodInfo = info => {
    const { payment_detail = {}, payment_method = {} } = info || {};
    let content = null;

    switch (payment_method) {
      case 'bank':
        content = (
          <Card style={{ marginTop: 15 }}>
            <DescriptionList size="large" col="1">
              <Description term="支付方式">{CONFIG.payments[payment_method] || '-'}</Description>
              <Description term="姓名">{payment_detail.name}</Description>
              <Description term="卡号">{payment_detail.bank_account}</Description>
              <Description term="开户行">{payment_detail.bank_name}</Description>
              <Description term="开户支行">{payment_detail.bank_branch_name}</Description>
            </DescriptionList>
          </Card>
        );
        break;
      case 'westernunion':
        content = (
          <Card style={{ marginTop: 15 }}>
            <DescriptionList size="large" col="1">
              <Description term="支付方式">{CONFIG.payments[payment_method] || '-'}</Description>
              <Description term="姓名">{payment_detail.name}</Description>
              <Description term="汇款信息">{payment_detail.account}</Description>
            </DescriptionList>
          </Card>
        );
        break;
      default:
        content = (
          <Card style={{ marginTop: 15 }}>
            <DescriptionList size="large" col="1">
              <Description term="支付方式">{CONFIG.payments[payment_method] || '-'}</Description>
              <Description term="姓名">{payment_detail.name}</Description>
              <Description term="账户">{payment_detail.account}</Description>
              <Description term="收款码" />
              <img className={styles.codeUrl} src={payment_detail.ercodeUrl} alt="收款码" />
            </DescriptionList>
          </Card>
        );
        break;
    }
    return content;
  };

  render() {
    const { orderDetail, renderButtons, handleReport } = this.props;
    const { ad = {}, order = {}, rating = {} } = orderDetail || {};
    const { trading_price, owner = {}, currency, trading_term, payment_methods = [] } = ad || {};
    const { id, status, pay_limit_at, trading_count, trading_volume, order_type } = order || {};
    const order_status = CONFIG.orderEngStatus[status];

    return (
      <div className={styles.page}>
        <Card bordered={false} className={styles.info}>
          <Meta
            title={`${trading_volume} ${currency} ${
              CONFIG.order_type_desc[order_type]
            } ${trading_count} BTC`}
            // description="中国"
          />
          <DescriptionList style={{ marginTop: 15 }} size="large" col="1">
            <Description term="汇率">
              {trading_price} {currency} / BTC
            </Description>
            {/*<Description term="交易限额"> {trading_price_ratio} BTC ({min_volume} {currency} ~ {max_volume} {currency})</Description>*/}
            {order_status === 'wait_pay' && (
              <Description term="付款倒计时">
                {pay_limit_at && (
                  <CountDown
                    target={new Date().getTime() + pay_limit_at * 1000}
                    formatstr="mm:ss"
                  />
                )}
              </Description>
            )}
            <Description term="付款方式">
              <Radio.Group onChange={this.handleModeChange} value={this.state.payType}>
                {map(payment_methods, (item, index) => (
                  <Radio.Button key={index} value={index}>
                    <Icon className={styles.pay_method} type={getPayIcon(item.payment_method)} />
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Description>
          </DescriptionList>
          {order_status !== 'cancel' &&
            this.renderPaymentMethodInfo(payment_methods[this.state.payType])}
          <div className={styles.buttonBox}>{renderButtons && renderButtons(orderDetail)}</div>
          <Card
            className={styles.term_box}
            title={`用户 ${owner.nickname} 的交易条款`}
            actions={[
              <a className={styles.report} onClick={handleReport}>
                <Icon type="flag" /> 举报这则交易信息
              </a>,
            ]}
          >
            <p>{trading_term}</p>
          </Card>
          <Card
            style={{ marginTop: '20px' }}
            className={styles.term_box}
            title={`对用户${owner.nickname}留下评价`}
          >
            {id && (
              <EvaluateForm id={id} initialValues={rating} onSubmit={this.handleSubmitEvaluate} />
            )}
          </Card>
        </Card>
      </div>
    );
  }
}
