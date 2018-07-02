import { message } from 'antd';
import {
  queryMyAdList,
  queryTermsList,
  fakeTerms,
  removeTerms,
  fakeAd,
  removeAd,
} from '../services/api';

export default {
  namespace: 'ad',

  state: {
    myAdData: {
      list: [],
      pagination: {},
    },
    termsData: {
      list: [],
      pagination: {},
    },
    termsDetail: {},
    adDetail: {},
  },

  effects: {
    *fetchMyAdList({ payload }, { call, put }) {
      const res = yield call(queryMyAdList, payload);
      yield put({
        type: 'setMyAdList',
        payload: res,
      });
    },
    *fetchTermsList({ payload }, { call, put }) {
      const res = yield call(queryTermsList, payload);
      yield put({
        type: 'setTermsList',
        payload: res,
      });
    },
    *updateAd({ payload, callback }, { call, put }) {
      const response = yield call(fakeAd, payload);
      if (response.code === 0) {
        yield put({
          type: 'fakeAd',
          payload: response,
        });
        message.success('操作成功');
        if (callback) callback();
      } else {
        message.error(response.msg);
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
    *saveTerms({ payload, callback }, { call, put }) {
      const response = yield call(fakeTerms, payload);
      if (response.code === 0) {
        message.success('操作成功');
      } else {
        message.error(response.msg);
      }
      yield put({
        type: 'fakeTerms',
        payload: response,
      });
      if (callback) callback();
    },
    *deleteTerms({ payload, callback }, { call, put }) {
      const response = yield call(removeTerms, payload);
      if (response.code === 0) {
        message.success('操作成功');
      } else {
        message.error(response.msg);
      }
      yield put({
        type: 'removeTerms',
        payload: response,
      });
      if (callback) callback();
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
    setTermsList(state, { payload }) {
      const { data: { items = [], paginator } } = payload || {};
      return {
        ...state,
        termsData: {
          list: items,
          pagination: { ...paginator, current: paginator.page },
        },
      };
    },
    fakeTerms(state, action) {
      return {
        ...state,
        termsDetail: action.payload,
      };
    },
    removeTerms(state, action) {
      return {
        ...state,
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
  },

  subscriptions: {},
};
