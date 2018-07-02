import { queryInfoList, queryInfoDtl, queryMoreMessageList, readMessage } from '../services/api';

export default {
  namespace: 'trade',

  state: {
    tradeList: {
      list: [],
      pagination: {},
    }
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const res = yield call(queryInfoList, payload);
      yield put({
        type: 'saveList',
        payload: res,
      });
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const { data: { items, paginator } } = payload || {};
      return {
        ...state,
        infoData: {
          list: items,
          pagination: { ...paginator, current: paginator.page },
        },
      };
    },
  },

  subscriptions: {},
};
