import { queryActivities, queryStaticDtl } from '../services/api';

export default {
  namespace: 'information',

  state: {
    list: [],
    infoDetail: {},
  },

  effects: {
    *fetchList(_, { call, put }) {
      const response = yield call(queryActivities);
      yield put({
        type: 'saveList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchStaticContent({ payload, callback }, { call, put }) {
      const res = yield call(queryStaticDtl, payload);
      yield put({
        type: 'setStaticDetail',
        payload: res,
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    setStaticDetail(state, { payload }) {
      return {
        ...state,
        infoDetail: payload.data,
      };
    },
  },
};
