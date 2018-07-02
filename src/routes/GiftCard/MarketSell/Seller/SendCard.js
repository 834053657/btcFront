import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Icon, Input, Avatar, Badge, Modal } from 'antd';
import CountDown from 'components/CountDown';
import styles from './SendCard.less';
import StepModel from '../../Step';
import { sendCDK } from '../../../../services/api';
import SendOnlyPicture from './OnlyPic';
import SendPicWithText from './PicWithText';

@connect(({ loading, card }) => ({
  card,
  submitting: loading.effects['card/sendCDK'],
}))
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {
      detail: props.detail,
      user: props.user,
      time: props.detail.ad.deadline,
      termView: false,
    };
    this.cardsData = [];
    this.data = {
      order_id: this.state.detail.order.id,
      cards: [],
    };
    this.targetTime = new Date().getTime() + props.detail.order.deadline_at * 1000;
  }

  componentWillMount() {
    const { order_detail = {} } = this.state.detail.order;
    order_detail.map(o => {
      return this.cardsData.push({
        money: o.money,
        cards: [],
      });
    });
  }

  renderInput = (item, index) => {
    const iptArr = [];
    for (let i = 0; i < item.count; i++) {
      iptArr.push({
        password: null,
        picture: null,
      });
    }
    this.cardsData[index].cards = iptArr;
    return iptArr;
  };

  writePassword = (e, item, index, i) => {
    this.cardsData[index].cards[i].password = e.target.value;
  };

  //只有图片 上传图片
  sendPic = (info, url, i, index) => {
    this.cardsData[index].cards[i].picture = url;
  };

  //只有图片 上传密码
  sendRec = (info, url, index) => {
    this.cardsData[index].receipt = url;
  };

  changePTPass = (e, i, index) => {
    this.cardsData[index].cards[i].password = e.target.value;
  };

  sendPicWithText = (info, url, i, index) => {
    this.cardsData[index].cards[i].picture = url;
  };

  sendRecWithText = (info, url, index) => {
    this.cardsData[index].receipt = url;
  };

  sendCDK = () => {
    this.data.cards = this.cardsData;
    this.props.dispatch({
      type: 'card/sendCDK',
      payload: this.data,
    });
  };

  deadline = () => {
    // setInterval(this.timeChange(), 1 * 1000)
    // return this.timeChange()
  };

  timeChange = () => {
    // let a = this.state.time
    // this.setState({
    //   time: a - 1
    // })
  };

  render() {
    const { user, detail, submitting, setStatus } = this.props;
    const { ad = {}, cards = {}, order = {} } = detail;

    const userInfo = ad.owner;
    const steps = [{ title: '发送礼品卡' }, { title: '确认信息' }, { title: '完成' }];
    return (
      <div className={styles.sendBox}>
        <StepModel steps={steps} current={0} />
        <div className={styles.top}>
          <div className={styles.orderInfo}>
            <div className={styles.price}>
              <span>类型：</span>
              <p>
                {CONFIG.cardTypeMap && order.card_type
                  ? CONFIG.cardTypeMap[ad.card_type].name || '-'
                  : '-'}
              </p>
            </div>
            <div className={styles.price}>
              <span>要求：</span>
              <p>{(CONFIG.cardPwdType && CONFIG.cardPwdType[ad.password_type]) || '-'}</p>
            </div>
            <div className={styles.price}>
              <span>保障时间：</span>
              <p>{ad.guarantee_time}</p>分钟
            </div>
          </div>

          <div className={styles.topRight}>
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
                <Button
                  onClick={() => {
                    this.setState({
                      termView: true,
                    });
                  }}
                >
                  查看交易条款
                </Button>
                <Modal
                  title="交易条款"
                  visible={this.state.termView}
                  onCancel={() => this.setState({ termView: false })}
                  footer={null}
                >
                  <p>{order.term}</p>
                </Modal>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.denomination}>
          <div className={styles.bottom}>
            {CONFIG.cardPwdType[ad.password_type] === '有卡密'
              ? order.order_detail.map((item, index) => {
                  return (
                    <div key={index} className={styles.denomination}>
                      <header>
                        <span>{item.money}</span>
                        面额 ({item.count})
                        {/*<div>
                          <Button>导入</Button>
                        </div>*/}
                      </header>
                      <section className={styles.iptSection}>
                        <div className={styles.left}>
                          <span>卡密：</span>
                        </div>
                        <div className={styles.right}>
                          <div className={styles.iptBox}>
                            <div className={styles.input}>
                              {this.renderInput(item, index).map((n, i) => {
                                return (
                                  <Input
                                    key={i}
                                    type="text"
                                    onChange={e => this.writePassword(e, item, index, i)}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  );
                })
              : null}

            {CONFIG.cardPwdType[ad.password_type] === '有卡图'
              ? order.order_detail.map((item, index) => {
                  return (
                    <SendOnlyPicture
                      key={index}
                      item={item}
                      renderInput={this.renderInput(item, index)}
                      sendPic={(info, url, i) => this.sendPic(info, url, i, index)}
                      sendRec={(info, url) => this.sendRec(info, url, index)}
                    />
                  );
                })
              : null}

            {CONFIG.cardPwdType[ad.password_type] === '有图有卡密'
              ? order.order_detail.map((item, index) => {
                  return (
                    <SendPicWithText
                      key={index}
                      item={item}
                      renderInput={this.renderInput(item, index)}
                      changePTPass={(e, i) => this.changePTPass(e, i, index)}
                      sendPicWithText={(info, url, i) => this.sendPicWithText(info, url, i, index)}
                      sendRecWithText={(info, url) => this.sendRecWithText(info, url, index)}
                    />
                  );
                })
              : null}

            <div>
              <div className={styles.amount}>
                <h4>
                  <span className={styles.title}>{order.money}</span>
                  <span>总面额：</span>
                </h4>
                <h4>
                  <span className={styles.title}>{ad.unit_price}RMB</span>
                  <span>单价：</span>
                </h4>
                <h4>
                  <span className={styles.title}>{order.amount}RMB</span>
                  <span>总价：</span>
                </h4>
              </div>
              <div className={styles.footer}>
                <div>
                  请在&nbsp;
                  <Icon type="clock-circle-o" />
                  &nbsp;
                  <CountDown formatStr="mm" target={this.targetTime} />
                  分钟内发卡
                </div>
                <Button
                  onClick={() => {
                    this.props.dispatch({
                      type: 'card/cacelOrder',
                      payload: { order_id: order.id },
                    });
                  }}
                >
                  取消订单
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    this.sendCDK();
                  }}
                  loading={submitting}
                >
                  发卡
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
