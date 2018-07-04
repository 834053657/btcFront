import { getTradeList } from '../services/api';

export default {
  namespace: 'trade',

  state: {
    tradeList: {
      list: [],
      pagination: {
        page_size: 10,
      },
    },
    detail: {
    }
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
    *fetchDetail({ payload, callback }, { call, put }) {
      const res = yield call(getTradeList, payload);
      yield put({
        type: 'saveDetail',
        payload: res,
      });
      yield callback && callback();
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
    saveDetail(state, { payload }) {
      return {
        ...state,
        detail: {
          ...payload
        },
      };
    },
  },

  subscriptions: {},
};
