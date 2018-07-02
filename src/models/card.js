import { message } from 'antd';
import {
  getCardlist,
  queryTermsList,
  getToken,
  getAdDetail,
  getSellDetail,
  createSellOrder,
  createBuyOrder,
  getAppealInfo,
  getOrderDetail,
  sendCDK,
  sendQuickMsg,
  releaseOrder,
  ratingOrder,
  addSellAd,
  addBuyAd,
  cacelOrder,
  postCheck,
  appealOrder,
  queryChatHistory,
} from '../services/api';

//判断买家和卖家
function identify(detail, user) {
  if (!Object.keys(detail.ad).length) {
    return false;
  }
  if (detail.order.order_type === 1) {
    if (user.id === detail.ad.owner.id) {
      return '卖家';
    } else {
      return '买家';
    }
  } else if (user.id === detail.ad.owner.id) {
    return '买家';
  } else {
    return '卖家';
  }
}

function initStatue(detail, user) {
  const { order: { status, order_type } } = detail || {};
  //主动出售
  //5 发送CDK      卖家视图   打开        1
  //1 等待买家查收  买家视图   等待查收      2

  //主动购买
  //11 买家确认         卖家视图    等待查收    2
  //14 买家确认          买家视图   等待查收    2
  let pageStatus;
  switch (status) {
    case 1:
      if (order_type === 2) {
        if (identify(detail, user) === '买家') {
          pageStatus = 1;
        } else {
          // '卖家'
          pageStatus = 5;
        }
      }
      break;
    case 2:
      if (order_type === 2) {
        if (identify(detail, user) === '买家') {
          pageStatus = 1;
        } else {
          // '卖家'
          pageStatus = 6;
        }
      }
      break;
    case 3:
      if (order_type === 2) {
        if (identify(detail, user) === '买家') {
          pageStatus = 2;
        } else {
          // '卖家'
          pageStatus = 7;
        }
      } else if (identify(detail, user) === '买家') {
        pageStatus = 14;
      } else {
        // '卖家'
        pageStatus = 11;
      }
      break;
    case 4:
      if (order_type === 2) {
        if (identify(detail, user) === '买家') {
          pageStatus = 20;
        } else {
          // '卖家'
          pageStatus = 21;
        }
      } else if (identify(detail, user) === '买家') {
        pageStatus = 22;
      } else {
        // '卖家'
        pageStatus = 23;
      }
      break;
    case 5:
      if (order_type === 2) {
        if (identify(detail, user) === '买家') {
          pageStatus = 3;
        } else {
          // '卖家'
          pageStatus = 8;
        }
      } else if (identify(detail, user) === '买家') {
        pageStatus = 17;
      } else {
        // '卖家'
        pageStatus = 12;
      }
      break;
    case 6:
      if (order_type === 2) {
        if (identify(detail, user) === '买家') {
          pageStatus = 4;
        } else {
          // '卖家'
          pageStatus = 9;
        }
      } else if (identify(detail, user) === '买家') {
        pageStatus = 15;
      } else {
        // '卖家'
        pageStatus = 13;
      }
      break;
  }
  return pageStatus;
  //主动购买  买家打开
}

export default {
  namespace: 'card',

  state: {
    list: {
      items: [],
      pagination: {
        pageSize: 10,
      },
    },
    cardList: [],
    terms: [],
    buyDetail: null,
    appeal: null,
    adDetail: {},
    odDetail: {
      ad: {},
      cards: {},
      order: {},
    },
    quickMsgList: [],
    chatMsgList: [],
  },

  effects: {
    *fetchCardList_({ payload }, { put, call }) {
      const res = yield call(getCardlist, payload);
      if (res.code === 0 && res.data) {
        yield put({
          type: 'GET_CARD_LIST_',
          payload: res.data,
        });
      } else {
        message.error(res.msg);
      }
    },
    *fetchCardList({ payload }, { put, call }) {
      const res = yield call(getCardlist, payload);
      yield put({
        type: 'GET_CARD_LIST',
        payload: res,
      });
    },
    *fetchTerms({ payload }, { put, call }) {
      const res = yield call(queryTermsList, payload);
      if (res.code === 0 && res.data) {
        yield put({
          type: 'GET_TERMS',
          payload: res.data.items,
        });
      } else {
        message.error(res.msg);
      }
    },
    //发送确认订单请求
    *createBuyOrder({ payload }, { call, put }) {
      const res = yield call(createBuyOrder, payload);
      // if (res.code === 0) {
      //   return res.data;
      // } else {
      //   message.error(res.msg);
      // }
      return res;
    },
    *createSellOrder({ payload }, { call, put }) {
      const res = yield call(createSellOrder, payload);
      if (!res) return null;
      if (res.code === 0) {
        return res.data;
      } else {
        message.error(res.msg);
      }
    },
    *getToken({ payload }, { call, put }) {
      const res = yield call(getToken, payload);
      return res;
      // yield put({
      //   type: 'GET_TOKEN',
      //   payload: res
      // })
    },
    //获取订单详情
    *fetchOrderDetail({ payload }, { call, put, select }) {
      const res = yield call(getOrderDetail, payload);
      if (res.code === 0) {
        const currentUser = yield select(state => state.user.currentUser) || {};
        const pageStatus = initStatue(res.data, currentUser.user);
        yield put({
          type: 'GET_OD_DETAIL',
          payload: {
            ...res.data,
            pageStatus,
          },
        });
      } else {
        message.error(res.msg);
      }
    },
    //获取购买交易详情
    *fetchAdDetail({ payload, callback }, { call, put }) {
      const res = yield call(getAdDetail, payload);
      if (res.code === 0) {
        yield put({
          type: 'GET_AD_DETAIL',
          payload: res.data,
        });
        yield callback && callback(res.data);
      } else {
        message.error(res.msg);
      }
    },
    //获取出售交易详情
    *getSellDetail({ payload }, { call, put }) {
      const res = yield call(getSellDetail, payload);
      yield put({
        type: 'GET_SELL_DETAIL',
        payload: res,
      });
    },
    //添加购买广告
    *addBuyAd({ payload }, { call, put }) {
      const res = yield call(addBuyAd, payload);
      return res;
    },
    //添加出售广告
    *addSellAd({ payload }, { call, put }) {
      const res = yield call(addSellAd, payload);
      return res;
    },
    //获取申诉详情
    *getAppealInfo({ payload }, { call, put }) {
      const res = yield call(getAppealInfo, payload);
      yield put({
        type: 'GET_APPEAL_INFO',
        payload: res,
      });
    },
    //立即查收
    *submitCheck({ payload }, { call, put }) {
      const res = yield call(postCheck, {
        order_id: payload.id,
      });
      if (res.code === 0) {
        yield put({
          type: 'fetchOrderDetail',
          payload: {
            id: payload.id,
          },
        });
      } else {
        message.error(res.msg);
      }
    },
    //发送CDK
    *sendCDK({ payload }, { call, put }) {
      const res = yield call(sendCDK, payload);
      if (res.code === 0) {
        yield put({
          type: 'fetchOrderDetail',
          payload: {
            id: payload.order_id,
          },
        });
      } else {
        message.error(res.msg);
      }
    },
    //取消订单
    *cacelOrder({ payload }, { call, put }) {
      const res = yield call(cacelOrder, payload);
      if (res.code === 0) {
        yield put({
          type: 'fetchOrderDetail',
          payload: {
            id: payload.order_id,
          },
        });
      } else {
        message.error(res.msg);
      }
    },
    //释放订单
    *releaseOrder({ payload }, { call, put }) {
      const res = yield call(releaseOrder, payload);
      if (res.code === 0) {
        yield put({
          type: 'fetchOrderDetail',
          payload: {
            id: payload.order_id,
          },
        });
      } else {
        message.error(res.msg);
      }
    },
    //申诉订单
    *appealOrder({ payload }, { call, put }) {
      const res = yield call(appealOrder, payload);
      if (res.code === 0) {
        yield put({
          type: 'fetchOrderDetail',
          payload: {
            id: payload.order_id,
          },
        });
      } else {
        message.error(res.msg);
      }
    },
    //评价订单
    *ratingOrder({ payload }, { call, put }) {
      const res = yield call(ratingOrder, payload);
      if (res.code === 0) {
        return res;
      } else {
        message.error(res.msg);
        return res;
      }
    },
    //发送快捷短语
    *sendQuickMsg({ payload }, { call, put }) {
      const res = yield call(sendQuickMsg, payload);
      if (res.code === 0) {
        return res.data;
      } else {
        message.error(res.msg);
      }
    },
    *fetchQuickMsgList({ payload }, { call, put }) {
      const res = yield call(queryChatHistory, payload);
      yield put({
        type: 'setQuickMsgList',
        payload: res,
      });
    },
    *fetchChatMsgList({ payload }, { call, put }) {
      const res = yield call(queryChatHistory, payload);
      yield put({
        type: 'setChatMsgList',
        payload: res,
      });
    },
  },

  reducers: {
    GET_CARD_LIST_(state, { payload }) {
      const { pagination: oldPagination } = state.list;
      const { items, paginator: { page, total } } = payload;
      const pagination = {
        ...oldPagination,
        current: page,
        total,
      };

      return {
        ...state,
        list: {
          items,
          pagination,
        },
      };
    },
    GET_CARD_LIST(state, action) {
      return {
        ...state,
        cardList: action.payload.data,
      };
    },
    GET_TERMS(state, action) {
      return {
        ...state,
        terms: action.payload,
      };
    },
    ADD_SELL(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    GET_TOKEN(state, action) {
      return {
        ...state,
        token: action.payload,
      };
    },
    GET_OD_DETAIL(state, { payload }) {
      return {
        ...state,
        odDetail: {
          ...payload,
        },
      };
    },
    GET_AD_DETAIL(state, action) {
      const newState = {
        ...state,
        adDetail: action.payload,
      };
      return newState;
    },
    GET_SELL_DETAIL(state, action) {
      return {
        ...state,
        sellDetail: action.payload,
      };
    },
    GET_APPEAL_INFO(state, action) {
      return {
        ...state,
        appeal: action.payload,
      };
    },
    setQuickMsgList(state, { payload }) {
      const { data } = payload || {};
      return {
        ...state,
        quickMsgList: data,
      };
    },
    setChatMsgList(state, { payload }) {
      const { data } = payload || {};
      return {
        ...state,
        chatMsgList: data,
      };
    },
    changePageStatus(state, { payload }) {
      return {
        ...state,
        odDetail: {
          ...state.odDetail,
          // pageStatus: payload,
          pageStatus: payload.page,
          steps: payload.header,
          olderPageStatus: state.odDetail.pageStatus,
        },
      };
    },
  },

  subscriptions: {},
};
