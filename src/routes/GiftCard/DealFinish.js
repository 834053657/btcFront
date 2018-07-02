import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Table,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  InputNumber,
  Steps,
  Avatar,
  Select,
  Upload,
  Modal,
  Rate,
  Badge,
} from 'antd';
import styles from './DealFinish.less';
import StepModel from './Step';

const Step = Steps.Step;
const Option = Select.Option;
const { TextArea } = Input;

@connect(({ loading, card }) => ({
  card,
  submit: loading.effects['card/ratingOrder'],
}))
export default class DealFinish extends Component {
  constructor(props) {
    super();
    this.state = {
      // starT:5,
      starT: props.detail.rate ? props.detail.rate.star : null,
      contentT: props.detail.rate ? props.detail.rate.content : null,
    };
  }

  ratingOrder = () => {
    const { starT, contentT } = this.state;
    if (contentT && contentT.length < 5) {
      message.warning('评价内容不能小于5个字');
      return false;
    }
    if (contentT && contentT.length > 500) {
      message.warning('评价内容不能超出500个字,目前字数' + contentT.length);
      return false;
    }
    const data = {
      order_id: this.props.detail.order.id,
      star: starT,
      content: contentT,
    };
    if (starT && contentT) {
      this.props
        .dispatch({
          type: 'card/ratingOrder',
          payload: data,
        })
        .then(() => {
          message.success('评价提交成功!');
        });
    } else {
      message.error('请输入完整评价信息');
    }
  };

  previewCard = steps => {
    this.props.dispatch({
      type: 'card/changePageStatus',
      payload: { page: 16, header: steps },
      //payload: 16,
    });
  };

  render() {
    const { order, ad, cards, trader } = this.props.detail;
    const { pageStatus } = this.props;
    let steps = null;
    let userInfo = null;

    if (pageStatus === 12 || pageStatus === 13 || pageStatus === 3 || pageStatus === 4) {
      userInfo = trader;
    } else if (pageStatus === 15 || pageStatus === 17 || pageStatus === 8 || pageStatus === 9) {
      userInfo = ad.owner;
    }

    const card_name =
      order.card_type && CONFIG.cardTypeMap[order.card_type]
        ? CONFIG.cardTypeMap[order.card_type].name
        : '-';

    if (pageStatus === 12 || pageStatus === 17) {
      steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];
    } else if (pageStatus === 13) {
      //13 卖家已取消       卖家视图
      steps = [{ title: '打开交易' }, { title: '订单已取消' }]; //您已取消
    } else if (pageStatus === 15) {
      //13 卖家已取消       买家视图
      steps = [{ title: '打开交易' }, { title: '订单已取消' }]; //卖家已取消
    } else if (pageStatus === 8) {
      steps = [{ title: '发送礼品卡' }, { title: '确认信息' }, { title: '完成' }];
    } else if (pageStatus === 9) {
      steps = [{ title: '发送礼品卡' }, { title: '订单已取消' }]; //您已取消
    } else if (pageStatus === 3) {
      steps = [{ title: '查收礼品卡' }, { title: '确认信息' }, { title: '完成' }];
    } else if (pageStatus === 4) {
      steps = [{ title: '打开交易' }, { title: '订单已取消' }]; //卖家已取消
    }

    if (!userInfo) {
      return false;
    }
    return (
      <div className={styles.buyFinish}>
        <StepModel steps={steps} current={steps.length - 1} />

        <div className={styles.finishBox}>
          <div className={styles.left}>
            <div className={styles.orderInfo}>
              <h5>
                <span>订单：</span>
                <span className={styles.text}>{order.order_no || '-'}</span>
              </h5>
              <div className={styles.orderDescribe}>
                {pageStatus === 12 || pageStatus === 13
                  ? `${trader.nickname}向您购买总面额${order.money}的${card_name}`
                  : null}
                {pageStatus === 15 || pageStatus === 17
                  ? `您向${ad.owner.nickname}购买总面额${order.money}的${card_name}`
                  : null}
                {pageStatus === 3 || pageStatus === 4
                  ? `${trader.nickname}向您出售总面额${order.money}的${card_name}`
                  : null}
                {pageStatus === 8 || pageStatus === 9
                  ? `您向${ad.owner.nickname}出售总面额${order.money}的${card_name}`
                  : null}
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
            <div className={styles.term}>
              <h3>交易条款：</h3>
              <p>{order.term}</p>
            </div>
          </div>

          <div className={styles.right}>
            {//2/13/17/3/9
            pageStatus === 2 ||
            pageStatus === 3 ||
            pageStatus === 9 ||
            pageStatus === 13 ||
            pageStatus === 17 ? (
              <div className={styles.largeBtnBox}>
                <Button onClick={() => this.previewCard(steps)}>查看礼品卡清单</Button>
              </div>
            ) : null}

            <div className={styles.ownerInfo}>
              {/*
              <div>
                <Button type="default" onClick={this.jumpAppeal}>
                  申诉记录
                </Button>
              </div>
              */}
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

              <div className={styles.evaluate}>
                <h4>你好，评价一下我的服务吧~</h4>
                <div className={styles.rate}>
                  <Rate
                    allowHalf
                    value={this.state.starT}
                    onChange={e => {
                      this.setState({
                        starT: e,
                      });
                    }}
                  />
                  <span className={styles.starNumber}>
                    {this.state.starT}
                    {this.state.starT ? '星' : null}
                  </span>
                </div>
              </div>
              <div className={styles.editor}>
                {
                  <TextArea
                    placeholder="您的建议会督促我做得更好~"
                    defaultValue={this.state.contentT ? this.state.contentT : ''}
                    rows={4}
                    value={this.state.contentT}
                    onChange={e => {
                      this.setState({ contentT: e.target.value });
                    }}
                  />
                }
              </div>
              <div className={styles.ratingBox}>
                <Button loading={this.props.submit} onClick={this.ratingOrder} type="primary">
                  {this.props.detail.rate ? '更新' : '提交'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
