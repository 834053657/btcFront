import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  submitCreateOrder,
  getTradeList,
  queryAdDetails,
  submitReportAd,
  queryOrderDetails,
  submitOrderConfirm,
  submitOrderRelease,
  submitOrderCancel,
  submitOrderAppeal,
  getTradeHistory,
  submitEvaluate,
} from '../services/api';

export default {
  namespace: 'trade',

  state: {
    tradeList: {
      list: [],
      pagination: {
        page_size: 10,
      },
    },
    detail: {},
    orderDetail: {},
    tradeIm: {
      historyList: [],
    },
  },

  effects: {
    *fetchList({ payload, callback }, { call, put }) {
      const res = yield call(getTradeList, payload);
      yield put({
        type: 'saveList',
        payload: res,
      });
      yield callback && callback();
    },
    *fetchImHistory({ payload, callback }, { call, put }) {
      const res = yield call(getTradeHistory, payload);
      if (res.code === 0) {
        yield put({
          type: 'saveImHistory',
          payload: res.data,
        });
        yield callback && callback();
      }
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const res = yield call(queryAdDetails, payload);
      if (res.code === 0) {
        yield put({
          type: 'saveDetail',
          payload: res.data,
        });
        yield callback && callback();
      }
    },
    *fetchOrderDetail({ payload, callback }, { call, put }) {
      const res = yield call(queryOrderDetails, payload);
      if (res.code === 0) {
        yield put({
          type: 'saveOrderDetail',
          payload: res.data,
        });
        yield callback && callback();
      }
    },
    *createOrder({ payload }, { call, put }) {
      const res = yield call(submitCreateOrder, payload);
      if (res.code === 0 && res.data) {
        message.success('下单成功');
        yield put(routerRedux.push(`/trade/step/${res.data.order_id}`));
      } else {
        message.error(res.msg);
      }
    },
    *reportAd({ payload, callback }, { call }) {
      const res = yield call(submitReportAd, payload);
      if (res.code === 0) {
        message.success('举报成功');
        callback && callback();
      } else {
        message.error(res.msg);
      }
    },
    *orderConfirm({ payload }, { call, put }) {
      const res = yield call(submitOrderConfirm, payload);
      if (res.code === 0) {
        yield put({
          type: 'fetchDetail',
          payload: {
            id: payload.order_id,
          },
        });
      } else {
        message.error(res.msg);
      }
    },
    *orderRelease({ payload }, { call, put }) {
      const res = yield call(submitOrderRelease, payload);
      if (res.code === 0) {
        yield put({
          type: 'fetchDetail',
          payload: {
            id: payload.order_id,
          },
        });
      } else {
        message.error(res.msg);
      }
    },
    *orderCancel({ payload, callback }, { call, put }) {
      const res = yield call(submitOrderCancel, payload);
      if (res.code === 0) {
        yield put({
          type: 'fetchDetail',
          payload: {
            id: payload.order_id,
          },
        });
        callback && callback();
      } else {
        message.error(res.msg);
      }
    },
    //评价用户
    *postContent({ payload, callback }, { call }) {
      const response = yield call(submitEvaluate, payload);
      if (response.code === 0) {
        message.success('操作成功');
        callback && callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *orderAppeal({ payload, callback }, { call, put }) {
      const res = yield call(submitOrderAppeal, payload);
      if (res.code === 0) {
        yield put({
          type: 'fetchDetail',
          payload: {
            id: payload.order_id,
          },
        });
        callback && callback();
      } else {
        message.error(res.msg);
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const { data: { items, paginator } } = payload || {};
      return {
        ...state,
        tradeList: {
          list: items,
          pagination: { ...paginator, current: paginator.page, page_size: paginator.page_num },
        },
      };
    },
    saveImHistory(state, { payload }) {
      const { items = [] } = payload || {};
      console.log(items);
      return {
        ...state,
        tradeIm: {
          historyList: items,
        },
      };
    },
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: {
          ...payload,
        },
      };
    },
    saveOrderDetail(state, { payload }) {
      return {
        ...state,
        orderDetail: {
          ...payload,
        },
      };
    },
  },

  subscriptions: {},
};
