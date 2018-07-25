import { routerRedux } from 'dva/router';
import { message } from 'antd';
import {
  getTradeHistory,
} from '../services/api';

export default {
  namespace: 'im',

  state: {
    historyList: [],
    members: [],
  },

  effects: {
    *fetchImHistory({ payload, callback }, { call, put }) {
      const res = yield call(getTradeHistory, payload);
      if (res.code === 0) {
        yield put({
          type: 'SAVE_IM_HISTORY',
          payload: res.data,
        });
        yield callback && callback();
      } else {
        message.error(res.msg)
      }
    },
  },

  reducers: {
    SAVE_IM_HISTORY ({ payload }) {

    }
  },

  subscriptions: {},
};
