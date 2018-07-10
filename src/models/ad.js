import { message } from 'antd';
import {
  queryMyAdList,
  removeAd,
  queryPrice,
  submitPublish,
  queryAdDetails,
} from '../services/api';

export default {
  namespace: 'ad',

  state: {
    myAdData: {
      list: [],
      pagination: {},
    },
    adDetail: {},
    price: null,
  },

  effects: {
    *fetchMyAdList({ payload }, { call, put }) {
      const res = yield call(queryMyAdList, payload);
      yield put({
        type: 'setMyAdList',
        payload: res,
      });
    },
    *fetchAdDetail({ payload, callback }, { call, put }) {
      const res = yield call(queryAdDetails, payload);
      if (res.code === 0) {
        yield put({
          type: 'fakeAd',
          payload: res.data,
        });
        yield callback && callback(res.data);
      }
    },
    *deleteAd({ payload, callback }, { call, put }) {
      const response = yield call(removeAd, payload);
      if (response.code === 0) {
        message.success('操作成功');
      } else {
        message.error(response.msg);
      }
      yield put({
        type: 'removeAd',
        payload: response,
      });
      if (callback) callback();
    },
    /**
     * 发布或者编辑广告
     * @param payload
     * @param callback
     * @param call
     * @returns {IterableIterator<*>}
     */
    *postPublish({ payload, callback }, { call }) {
      const response = yield call(submitPublish, payload);
      if (response.code === 0) {
        message.success('操作成功');
        callback && callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *fetchNewPrice({ payload }, { call, put }) {
      const response = yield call(queryPrice, payload);
      if (response.code === 0) {
        yield put({
          type: 'setPrice',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    setMyAdList(state, { payload }) {
      const { data: { items = [], paginator } } = payload || {};
      return {
        ...state,
        myAdData: {
          list: items,
          pagination: { ...paginator, current: paginator.page },
        },
      };
    },
    fakeAd(state, action) {
      return {
        ...state,
        adDetail: action.payload,
      };
    },
    removeAd(state, action) {
      return {
        ...state,
      };
    },
    setPrice(state, { payload }) {
      return {
        ...state,
        price: payload.at_price,
      };
    },
  },

  subscriptions: {},
};
