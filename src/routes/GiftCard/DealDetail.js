import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { sumBy } from 'lodash';
import { Badge, Button, message, InputNumber, Avatar, Popover, Icon, Input, Spin } from 'antd';
import { postSellOrder } from '../../services/api';
import styles from './DealDetail.less';

@connect(({ card, loading }) => ({
  card,
  detail: card.adDetail,
  toBuyOrder: loading.effects['card/createBuyOrder'],
  toSellOrder: loading.effects['card/createSellOrder'],
}))
export default class DealDeatil extends Component {
  constructor(props) {
    super();
    this.state = {
      orderId: null,
      addDenoVisible: false,
      denoValue: '',
      orderData: [],
      totalPrice: 0,
      loading: true,
    };
    this.postData = {
      ad_id: +props.match.params.id, //广告ID
      order_detail: [], // 订单详情
    };
  }

  componentDidMount() {
    const { params: { id } } = this.props.match || {};
    this.fetch({ id });
  }

  fetch = param => {
    this.props.dispatch({
      type: 'card/fetchAdDetail',
      payload: param,
      callback: res => {
        this.setState({
          loading: false,
        });
      },
    });
  };

  ensureOrder = () => {
    this.postData.updated_at = this.props.detail.updated_at;
    this.props
      .dispatch({
        type: 'card/createBuyOrder',
        payload: this.postData,
      })
      .then(res => {
        if (!res) {
          return false;
        }
        if (res && res.code === 0) {
          this.setState({
            orderId: res.data.order_id,
          });
          this.props.dispatch(routerRedux.push(`/card/deal-line/${res.data.order_id}`));
        } else if (res && res.msg === '广告数据已变化') {
          this.postData = {
            ad_id: +this.props.match.params.id, //广告ID
            order_detail: [], // 订单详情
          };
          const { params: { id } } = this.props.match || {};
          this.fetch({ id });
          message.error(res.msg + '，请重新填写订单数据');
        } else {
          message.error(res.msg);
        }
      });
  };

  handlerSell = async () => {
    this.postData.order_detail = this.postData.order_detail.filter(i => i.count > 0);
    if (this.postData.order_detail.length === 0) {
      return false;
    }
    this.postData.updated_at = this.props.detail.updated_at;
    this.props
      .dispatch({
        type: 'card/createSellOrder',
        payload: this.postData,
      })
      .then(res => {
        if (res) {
          this.setState({
            orderId: res.order_id,
          });
          this.props.dispatch(routerRedux.push(`/card/deal-line/${res.order_id}`));
        }
      });
  };

  changeNum = (e, d, stock) => {
    const re = /^[1-9]+[0-9]*]*$/;
    if (re.test(e)) {
      if (e > stock) {
        message.warning(d + '面额的库存仅为' + stock + ',数量将会调整为最大库存' + stock);
      }
      const index = this.postData.order_detail.findIndex(t => {
        return t.money === d;
      });
      if (index >= 0) {
        this.postData.order_detail[index].count = e;
      } else {
        this.postData.order_detail.push({
          money: d,
          count: e,
        });
      }
      this.setState({
        buyData: this.postData.order_detail,
      });
    } else if (e === '') {
      const index = this.postData.order_detail.findIndex(t => {
        return t.money === d;
      });
      if (index >= 0) {
        this.postData.order_detail.splice(index, 1);
      }
      this.setState({
        buyData: this.postData.order_detail,
      });
    } else if (!re.test(e) && !e === '') {
      message.warning('请输入数字格式');
    }
  };

  changeFixedNum = (e, c) => {
    e = parseInt(e);
    const re = /^[1-9]+[0-9]*]*$/;
    if (re.test(e)) {
      if (e > c.max_count) {
        message.warning('最高出售数量为' + c.max_count);
      }
      const index = this.postData.order_detail.findIndex(t => {
        return +t.money === +c.money;
      });
      if (index >= 0) {
        this.postData.order_detail[index].count = +e;
      } else {
        this.postData.order_detail.push({
          money: parseInt(c.money),
          count: parseInt(e),
        });
      }
      this.setState({
        buyData: this.postData.order_detail,
      });
    } else if (e === '') {
      const index = this.postData.order_detail.findIndex(t => {
        return +t.money === +c.money;
      });
      if (index >= 0) {
        this.postData.order_detail.splice(index, 1);
        this.setState({
          num: 0,
        });
      }
      this.setState({
        buyData: this.postData.order_detail,
      });
    } else if (!re.test(e) && !e === '') {
      message.warning('请输入数字格式');
    }
  };

  changeRangeDataNum = (e, index) => {
    const { orderData } = this.state;
    orderData[index].count = e;
    this.postData.order_detail = this.state.orderData;
    this.setState({ orderData });
  };

  calcuBuyTotal = () => {
    const userBuySum = sumBy(this.postData.order_detail, row => {
      return row.money * row.count * this.props.detail.unit_price || 0;
    });
    return userBuySum;
  };

  addDenoInRange = condition => {
    const { orderData, denoValue } = this.state;
    if (denoValue >= condition.min_money && denoValue <= condition.max_money) {
      orderData.push({
        money: +denoValue,
      });
      this.setState({
        orderData,
      });
    } else {
      message.warning('面额未符合要求');
    }
  };

  calcuMaxCountBuy = item => {
    const { detail } = this.props;
    const accountBalance = detail.owner.amount;
    const { money, count } = item || {};
    const userBuySum = sumBy(this.state.orderData, row => {
      return row.money * row.count || 0;
    });
    const result = (accountBalance - userBuySum) * 10000 / money / 10000;
    return parseInt(result);
  };

  calcuTotalCount = () => {
    const userBuySum = sumBy(this.state.orderData, row => {
      return row.money * row.count || 0;
    });
    return userBuySum;
  };

  handleBack = () => {
    this.props.dispatch(routerRedux.goBack());
  };

  /**
   * ad_type = 1 是主动出售视图
   * ad_type = 2 是主动购买视图
   * @returns {*}
   */
  renderCondition = detail => {
    const { condition_type, ad_type, money = [], stock = {} } = detail || {};
    let { condition } = detail || {};
    const accountBalance = detail.owner.amount;
    let content = null;
    // 主动出售
    if (condition_type === 1) {
      // 指定面额
      condition = condition || [];
      content = (
        <ul className={styles.ulrangeDeno}>
          {condition.map((c, index) => {
            return (
              <li key={index}>
                <span className={styles.denoTitle}>{c.money}面额:</span>
                <div className={styles.denoIpt}>
                  <InputNumber
                    min={0}
                    max={+c.max_count}
                    defaultValue={0}
                    onChange={e => this.changeFixedNum(e, c)}
                  />
                  <span className={styles.last}>
                    数量限额<span>{c.min_count}</span>-<span>{c.max_count}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      );
    } else {
      // 面额区间
      // condition = condition || {}
      const addDenoNode = (
        <div className={styles.addDenoNode}>
          <InputNumber
            autoFocus
            onChange={e => {
              const re = /^[1-9]+[0-9]*]*$/;
              if (re.test(e)) {
                this.setState({ denoValue: e });
              } else {
                message.warning('请输入数字格式');
              }
            }}
            value={this.state.denoValue}
          />
          <h5>
            可添加面额：{condition.min_money}-{condition.max_money}
          </h5>
          <div className={styles.btnBox}>
            <Button
              onClick={() => {
                this.setState({ addDenoVisible: false });
              }}
            >
              取消
            </Button>
            <Button
              onClick={() => {
                this.addDenoInRange(condition);
                this.setState({ addDenoVisible: false });
              }}
              type="primary"
            >
              确认
            </Button>
          </div>
        </div>
      );
      content = (
        <div className={styles.rangeDeno}>
          <ul className={styles.ulrangeDeno}>
            {this.state.orderData
              ? this.state.orderData.map((c, index) => {
                  return (
                    <li key={index}>
                      <span className={styles.denoTitle}>{c.money}面额:</span>
                      <div className={styles.denoIpt}>
                        <InputNumber
                          //max={this.calcuMaxCountBuy(c)}
                          min={0}
                          defaultValue={0}
                          onChange={e => this.changeRangeDataNum(e, index)}
                        />
                        <span className={styles.last}>
                          最多可再出售{this.calcuMaxCountBuy(c)}个
                        </span>
                      </div>
                    </li>
                  );
                })
              : null}
          </ul>
          <ul className={styles.addBtn}>
            <li>
              <Popover
                content={addDenoNode}
                trigger="click"
                visible={this.state.addDenoVisible}
                onVisibleChange={() => {
                  if (!this.state.addDenoVisible) {
                    this.setState({
                      denoValue: '',
                    });
                  }
                  this.setState({ addDenoVisible: !this.state.addDenoVisible });
                }}
              >
                <Button>
                  <Icon type="plus" />
                  添加面额
                </Button>
              </Popover>
            </li>
          </ul>
        </div>
      );
    }

    return content;
  };

  /**
   * 主动出售视图
   * @param detail
   * @returns {*}
   */
  renderSellContent = detail => {
    const { card_type, password_type, unit_price, deadline = 0, multiple = 0, guarantee_time } =
      detail || {};
    return (
      <div className={styles.left}>
        <Spin spinning={this.state.loading} delay={1500}>
          <ul>
            <li className={styles.item}>
              <span className={styles.title}>类型:</span>
              <div className={styles.content}>
                {card_type && CONFIG.cardTypeMap && CONFIG.cardTypeMap[card_type]
                  ? CONFIG.cardTypeMap[card_type].name
                  : '-'}
              </div>
            </li>

            <li className={styles.item}>
              <span className={styles.title}>要求:</span>
              <div className={styles.content}>
                {password_type && CONFIG.cardPwdType ? CONFIG.cardPwdType[password_type] : '-'}
              </div>
            </li>

            <li className={styles.item}>
              <span className={styles.title}>单价:</span>
              <div className={styles.content}>{unit_price}RMB</div>
            </li>

            <li className={styles.item}>
              <span className={styles.title}>倍数:</span>
              <div className={styles.content}>{multiple}</div>
            </li>

            <li className={styles.item}>{this.renderCondition(detail)}</li>
            <li className={styles.item}>
              <span className={styles.title}>总价:</span>
              <div className={styles.content}>{this.calcuBuyTotal()}</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>发卡期限:</span>
              <div className={styles.content}>{deadline}分钟</div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>保障时间:</span>
              <div className={styles.content}>{guarantee_time}分钟</div>
            </li>
          </ul>
          <div className={styles.bottom}>
            <Button onClick={this.handleBack}>取消</Button>
            <Button
              type="primary"
              disabled={!this.postData.order_detail.length > 0}
              onClick={this.handlerSell}
              loading={this.props.toSellOrder}
            >
              确认出售
            </Button>
          </div>
        </Spin>
      </div>
    );
  };
  /**
   * 主动购买视图
   * @param detail
   * @returns {*}
   */
  renderBuyerContent = detail => {
    const { card_type, password_type, unit_price, guarantee_time = 0, money = [], stock = {} } =
      detail || {};
    return (
      <div className={styles.left}>
        <Spin spinning={this.state.loading} delay={1500}>
          <ul>
            <li className={styles.item}>
              <span className={styles.title}>类型:</span>
              <div className={styles.content}>
                {card_type && CONFIG.cardTypeMap && CONFIG.cardTypeMap[card_type]
                  ? CONFIG.cardTypeMap[card_type].name
                  : '-'}
              </div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>包含:</span>
              <div className={styles.content}>
                {password_type && CONFIG.cardPwdType ? CONFIG.cardPwdType[password_type] : '-'}
              </div>
            </li>
            <li className={styles.item}>
              <span className={styles.title}>单价:</span>
              <div className={styles.content}>{unit_price}RMB</div>
            </li>
            <li className={styles.denoList}>
              <ul>
                {money.map(d => {
                  return (
                    <li key={d}>
                      <span className={styles.denoTitle}>{d}面额:</span>
                      <div className={styles.denoIpt}>
                        <InputNumber
                          min={0}
                          max={stock[d]}
                          defaultValue={0}
                          onChange={e => this.changeNum(e, d, stock[d])}
                        />
                      </div>
                      <span className={styles.last}>库存({stock[d] || 0})</span>
                    </li>
                  );
                })}
              </ul>
            </li>

            <li className={styles.item}>
              <span className={styles.title}>总价:</span>
              <div className={styles.content}>{this.calcuBuyTotal()}</div>
            </li>

            <li className={styles.item}>
              <span className={styles.title}>保障时间:</span>
              <div className={styles.content}>{guarantee_time}分钟</div>
            </li>
          </ul>
          <div className={styles.bottom}>
            <Button onClick={this.handleBack}>取消</Button>
            <Button
              disabled={this.calcuBuyTotal() === 0}
              type="primary"
              onClick={this.ensureOrder}
              loading={this.props.toBuyOrder}
            >
              确认购买
            </Button>
          </div>
        </Spin>
      </div>
    );
  };

  /**
   * ad_type = 1 是主动出售视图
   * ad_type = 2 是主动购买视图
   * @returns {*}
   */
  render() {
    const { detail } = this.props;
    const { owner = {}, ad_type, term } = detail || {};
    const userInfo = owner;
    if (!detail) {
      return false;
    }
    return (
      <div className={styles.detailBox}>
        {/*<h1>{ad_type === 1 ? '主动出售视图 ad_type = 1' : '主动购买视图 ad_type = 2'}</h1>*/}
        {ad_type === 1 ? this.renderSellContent(detail) : this.renderBuyerContent(detail)}

        <div className={styles.right}>
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
            <p>{term}</p>
          </div>
        </div>
      </div>
    );
  }
}
