import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Avatar, Select } from 'antd';
import styles from './DealLine.less';
import StepModel from './Step';
import SellerEnsure from './MarketBuy/SellerEnsure';
import BuyerCheckCard from './MarketSell/Buyer/BuyerCheckCard';
import EnsureBuyInfo from './MarketSell/Buyer/EnsureBuyInfo';
import SendCard from './MarketSell/Seller/SendCard';
import SellerWaitBuyerCheck from './MarketSell/Seller/SellerWaitBuyerCheck';
import DealFinish from './DealFinish';
import PreviewCard from './PreviewCard/PreviewCard';
import Appeal from './MarketBuy/Appeal';

const Option = Select.Option;

@connect(({ card, user }) => ({
  user: user.currentUser.user,
  detail: card.odDetail,
}))
export default class OrderDetail extends Component {
  constructor(props) {
    super();
    this.state = {
      orderId: props.match.params.id,
    };
  }

  componentDidMount() {
    const { params: { id } } = this.props.match || {};
    this.fetchData(id);
    this.enterRoom(id);
  }

  componentWillUnmount() {
    const { params: { id } } = this.props.match || {};
    this.leaveRoom(id);
    this.props.dispatch({
      type: 'card/GET_OD_DETAIL',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id } } = this.props.match || {};
    const { params: { id: nextid } } = nextProps.match || {};
    if (nextid !== id) {
      this.fetchData(nextid);
      this.leaveRoom(id);
      this.enterRoom(nextid);
    }
  }

  fetchData = id => {
    const { order } = this.props.detail;
    this.setState({
      orderId: id,
    });
    this.props.dispatch({
      type: 'card/fetchOrderDetail',
      payload: { id },
    });
    // .then(() => {
    //   this.initStatue(order);
    // });
  };

  enterRoom = order_id => {
    this.props.dispatch({
      type: 'enter_chat_room',
      payload: { order_id },
    });
  };

  leaveRoom = order_id => {
    this.props.dispatch({
      type: 'leave_chat_room',
      payload: { order_id },
    });
  };

  orderTitle = (ad, cards, order, user) => {
    if (order.order_type === 1) {
      if (user.id === ad.owner.id) {
        return '您向XX出售';
      } else {
        return 'XX向您出售';
      }
    } else if (user.id === ad.owner.id) {
      return 'XX向您购买';
    } else {
      return '您向XX购买';
    }
  };

  setStatus = (type, value) => {
    this.setState({
      [type]: value,
    });
  };

  pageStatus = () => {
    //1--8  主动出售
    //1 等待买家查收  买家视图   等待查收
    //2 买家确认     买家视图     等待查收
    //3 已完成       买家视图    已完成
    //4 卖家已取消    买家视图    已取消
    //
    //5 发送CDK      卖家视图   打开
    //6 等待卖家查收   卖家视图   等待查收
    //7 保障中       卖家视图    保障中
    //8 已完成       卖家视图    已完成
    //9 卖家已取消    卖家视图    已取消
    //
    //11--20  主动购买
    //11 买家确认         卖家视图    等待查收
    //12 已完成           卖家视图   已完成
    //13 卖家已取消       卖家视图    已取消
    //
    //14 买家确认          买家视图   等待查收
    //15 卖家已取消        买家视图   已取消
    //16 查看礼品卡代码     买家视图   保障中
    //17 已完成           买家视图   已完成
    //
    //20 申诉           主动出售 买家视图   申述中 ad
    //21 申诉           主动出售 卖家视图   申述中 trade
    //22 申诉           主动购买 买家视图   申述中 ad
    //23 申诉           主动购买 卖家视图   申述中 trade
  };

  render() {
    const { ad = {}, cards = {}, order = {}, pageStatus } = this.props.detail || {};
    const { detail } = this.props;
    const { user } = this.props;
    const steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];
    // const {pageStatus} = this.state;
    // pageStatus = 14;
    if (!Object.keys(ad).length) {
      return false;
    }
    return (
      <div className={styles.dealLine}>
        {//我要出售列表 买家视角 订单状态：等待买家查收
        pageStatus === 1 ? <BuyerCheckCard {...this.props} /> : null}

        {//我要出售列表 买家视角 订单状态：买家确认 一定有查看按钮
        pageStatus === 2 ? (
          <EnsureBuyInfo
            setStatus={this.setStatus}
            detail={detail}
            user={user}
            orderTitle={this.orderTitle}
          />
        ) : null}

        {//我要出售列表 卖家视角 订单状态：输入cdk
        pageStatus === 5 ? (
          <SendCard
            detail={detail}
            user={user}
            orderTitle={this.orderTitle}
            setStatus={this.setStatus}
          />
        ) : null}

        {//我要出售列表 卖家视角 订单状态：等待买家查收/保障中    一定有查看按钮
        pageStatus === 6 || pageStatus === 7 ? (
          <SellerWaitBuyerCheck
            detail={detail}
            user={user}
            setStatus={this.setStatus}
            orderTitle={this.orderTitle}
            pageStatus={pageStatus}
          />
        ) : null}

        {//已完成/取消订单
        pageStatus === 3 || //主动出售 已完成  买家
        pageStatus === 4 || //主动出售 取消订单  买家
        pageStatus === 8 || //主动出售 已完成  卖家
        pageStatus === 9 || //主动出售 已取消  卖家
        pageStatus === 12 || //主动购买 已完成  卖家
        pageStatus === 13 || //主动购买 取消订单  卖家
        pageStatus === 15 || //主动购买  已取消  买家
        pageStatus === 17 ? ( //主动购买  已完成  买家
          // 12/13/17/3/9 有按钮
          <DealFinish
            pageStatus={pageStatus}
            setStatus={this.setStatus}
            detail={detail}
            user={user}
            orderTitle={this.orderTitle}
          />
        ) : null}

        {//我要购买列表 订单状态：确认信息 卖家/买家   一定有查看按钮
        pageStatus === 11 || pageStatus === 14 ? (
          <SellerEnsure
            setStatus={this.setStatus}
            pageStatus={pageStatus}
            detail={detail}
            user={user}
            orderTitle={this.orderTitle}
          />
        ) : null}

        {//我要购买列表 买家视角 订单状态：确认信息 礼品卡清单
        pageStatus === 16 ? (
          <PreviewCard
            setStatus={this.setStatus}
            detail={detail}
            user={user}
            orderTitle={this.orderTitle}
            orderId={this.state.orderId}
          />
        ) : null}

        {//我要购买列表 买家视角 订单状态：确认信息 礼品卡清单
        // this.orderType() === 2 && this.Identify() === '买家'
        pageStatus === 20 || pageStatus === 21 || pageStatus === 22 || pageStatus === 23 ? (
          <Appeal
            setStatus={this.setStatus}
            pageStatus={pageStatus}
            detail={detail}
            user={user}
            orderTitle={this.orderTitle}
            orderId={this.state.orderId}
          />
        ) : null}
      </div>
    );
  }
}
