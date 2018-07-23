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
    user: null,
  },

  effects: {
    *fetchDetails({ payload }, { call, put }) {
      const response = yield call(queryDetails, payload);
      yield put({
        type: 'saveDetails',
        payload: response,
      });
    },
    *submitRating({ payload, callback }, { call, put }) {
      const response = yield call(updateTrust, payload);
      if (response.code === 0) {
        message.success('操作成功');
        yield put({
          type: 'fetchDetails',
          payload: {
            target_uid: payload.target_uid,
          },
        });
        callback && callback();
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    saveDetails(state, { payload }) {
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
