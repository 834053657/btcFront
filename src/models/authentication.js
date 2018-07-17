import { message } from 'antd';
import { authForC1, authForC2, authForC3 } from '../services/user';

export default {
  namespace: 'authentication',
  state: {
    stage: 0,
    status: 1, // 1：未认证，2：认证中，3：未通过，4: 已通过
    reason: null,
  },
  effects: {
    *authForC1({ payload }, { call, put }) {
      const res = yield call(authForC1, payload);
      if (res.code === 0) {
        yield put({
          type: 'submitCert',
          payload,
        });
      } else {
        message.error(res.msg || '提交失败');
      }
    },
    *authForC2({ payload }, { call, put }) {
      const res = yield call(authForC2, payload);
      if (res.code === 0) {
        yield put({
          type: 'submitCert',
          payload,
        });
      } else {
        message.error(res.msg || '提交失败');
      }
    },
    *authForC3({ payload }, { call, put }) {
      const res = yield call(authForC3, payload);
      if (res.code === 0) {
        yield put({
          type: 'submitCert',
        });
      } else {
        message.error(res.msg || '提交失败');
      }
    },
  },
  reducers: {
    submitCert(state, payload) {
      return {
        ...state,
        stage: state.stage < 2 ? state.stage + 1 : state.stage,
        status: 2,
      };
    },
  },
};
