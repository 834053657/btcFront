import { routerRedux } from 'dva/router';
import { queryDetails, updateTrust } from '../services/api';
import { forgetPassword } from '../services/user';

export default {
  namespace: 'userDetails',

  state: {
    userMessage: [],
    trader: [],
    list: [],
    comment: [],
  },

  effects: {
    *fetchDetails(payload, { call, put }) {
      const response = yield call(queryDetails, payload);
      console.log('response');
      console.log(response);
      yield put({
        type: 'fetchMessage',
        payload: response,
      });
    },
    *submitTrustUser({ payload, callback }, { call, put }) {
      const response = yield call(updateTrust, payload);
      yield put({
        type: 'saveTrust',
        payload: response,
      });
    },
  },

  reducers: {
    fetchMessage(state, { payload }) {
      const { data: { user, trade, ads, comments } } = payload;
      console.log('trade');
      console.log(trade);
      return {
        ...state,
        userMessage: user,
        trader: trade,
        list: ads,
        comment: comments,
      };
    },

    saveTrust(state) {
      return {
        ...state,
      };
    },
  },
};