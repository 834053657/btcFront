import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Button, Icon, Steps, Avatar, Select, Badge } from 'antd';
import styles from '../../MarketBuy/StepTwo.less';
import StepModel from '../../Step';
import QuickMsg from '../../QuickMsg';

const Step = Steps.Step;
const Option = Select.Option;

@connect(({ card, loading }) => ({
  card,
  releaseOrderBtn: loading.effects['card/releaseOrder'],
  appealBtn: loading.effects['card/appealOrder'],
}))
export default class EnsureBuyInfo extends Component {
  constructor(props) {
    super();
    this.state = {
      term: '快捷短语',
    };
  }

  previewCard = steps => {
    this.props.dispatch({
      type: 'card/changePageStatus',
      payload: { page: 16, header: steps },
    });
  };

  selectTerm = e => {
    if (!CONFIG.term) {
      return false;
    }
    this.setState({
      term: CONFIG.term[CONFIG.term.findIndex(t => t.id === e)].content || '-',
    });
    this.props.dispatch({
      type: 'card/sendQuickMsg',
      payload: {
        order_id: 'orderId',
        quick_message_id: e,
      },
    });
  };

  render() {
    const { detail, setStatus } = this.props;
    const { ad, cards, order, trader } = this.props.detail;

    const userInfo = trader;

    const steps = [{ title: '查收礼品卡' }, { title: '确认信息' }, { title: '完成' }];
    return (
      <div className={styles.stepTwoBox}>
        <StepModel steps={steps} current={1} />
        <div className={styles.bottom}>
          <div className={styles.bottomLeft}>
            <div className={styles.orderInfo}>
              <h5>
                <span>订单：</span>
                <span className={styles.text}>115216524713875</span>
              </h5>
              <div className={styles.orderDescribe}>
                {`${trader.nickname}向您出售总面额${order.money}的${
                  CONFIG.cardTypeMap[order.card_type].name
                }`}
              </div>
              <div className={styles.price}>
                <span>单价：</span>
                <span>{ad.unit_price}</span>RMB
              </div>
              <div>
                <span>总价：</span>
                <span>{order.amount}</span>RMB
              </div>
            </div>

            <div className={styles.guarantee}>
              <h5>
                保障时间剩余 &nbsp;
                <Icon type="clock-circle-o" />
                &nbsp;
                {'30'}分钟
              </h5>
              <Button
                type="danger"
                loading={this.props.appealBtn}
                onClick={() => {
                  this.props.dispatch({
                    type: 'card/appealOrder',
                    payload: { order_id: order.id },
                  });
                }}
              >
                申诉
              </Button>
              <Button
                onClick={() => {
                  this.props.dispatch({
                    type: 'card/releaseOrder',
                    payload: { order_id: order.id },
                  });
                }}
                type="primary"
                loading={this.props.releaseOrderBtn}
              >
                确认释放
              </Button>
            </div>

            {/*快捷短语*/}
            <QuickMsg detail={detail} />
          </div>
          <div className={styles.stepBottomRight}>
            <div className={styles.largeBtnBox}>
              <Button onClick={() => this.previewCard(steps)}>查看礼品卡清单</Button>
            </div>

            <div className={styles.ownerInfo}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  <Avatar size="large" src={userInfo.avatar} />
                </div>
                <div className={styles.avatarRight}>
                  <div className={styles.top}>
                    <Badge status={userInfo.online ? 'success' : 'default'} offset={[11, 10]} dot>
                      <span className={styles.name}>{userInfo.nickname}</span>
                    </Badge>
                  </div>
                  <div className={styles.infoBottom}>
                    <span className={styles.dealTit}>30日成单：</span>
                    <span className={styles.dealNum}>{userInfo.month_volume}</span>
                  </div>
                </div>
              </div>
              <div className={styles.term}>
                <h3>交易条款：</h3>
                <p>{order.term}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
