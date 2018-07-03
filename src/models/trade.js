import { getTradeList } from '../services/api';

export default {
  namespace: 'trade',

  state: {
    tradeList: {
      list: [],
      pagination: {
        pageSize: 10,
      },
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
  },

  reducers: {
    saveList(state, { payload }) {
      const { data: { items, paginator } } = payload || {};
      return {
        ...state,
        tradeList: {
          list: items,
          pagination: { ...paginator, current: paginator.page, pageSize: paginator.page_num },
        },
      };
    },
  },

  subscriptions: {},
};
