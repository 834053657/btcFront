import { queryInfoList, queryInfoDtl, queryMoreMessageList, readMessage } from '../services/api';

export default {
  namespace: 'message',

  state: {
    infoData: {
      list: [],
      pagination: {},
    },
    infoDetail: {},
    msgData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchInfoList({ payload }, { call, put }) {
      const res = yield call(queryInfoList, payload);
      yield put({
        type: 'setInfoList',
        payload: res,
      });
    },
    *fetchInfoDetail({ payload, callback }, { call, put }) {
      const res = yield call(queryInfoDtl, payload);
      yield put({
        type: 'setInfoDetail',
        payload: res,
      });
      if (callback) callback();
    },
    *fetchMessageList({ payload }, { call, put }) {
      const res = yield call(queryMoreMessageList, payload);
      yield put({
        type: 'setMessageList',
        payload: res,
      });
    },
    *readMessage({ payload, callback }, { call, put }) {
      const res = yield call(readMessage, payload);
      yield put({
        type: 'setReadMessage',
        payload: res,
      });
      if (callback) callback();
    },
  },

  reducers: {
    setInfoList(state, { payload }) {
      const { data: { items, paginator } } = payload || {};
      return {
        ...state,
        infoData: {
          list: items,
          pagination: { ...paginator, current: paginator.page },
        },
      };
    },
    setInfoDetail(state, { payload }) {
      console.log('123---------');
      console.log(payload.data);
      return {
        ...state,
        infoDetail: payload.data,
      };
    },
    setMessageList(state, { payload }) {
      const { data: { items, paginator } } = payload || {};
      return {
        ...state,
        msgData: {
          list: items,
          pagination: { ...paginator, current: paginator.page },
        },
      };
    },
    setReadMessage(state, { payload }) {
      console.log(payload);
      return {
        ...state,
      };
    },
  },

  subscriptions: {},
};
