import { message } from 'antd';
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
    *fetchDetails({ payload }, { call, put }) {
      const response = yield call(queryDetails, payload);
      yield put({
        type: 'fetchMessage',
        payload: response,
      });
    },
    *submitTrustUser({ payload, callback }, { call, put }) {
      const response = yield call(updateTrust, payload);
      if (response.code === 0) {
        message.success('操作成功');
        yield put({
          type: 'fetchDetails',
          payload: payload.target_uid,
        });
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    fetchMessage(state, { payload }) {
      const { data: { user, trade, ads, comments } } = payload;
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
