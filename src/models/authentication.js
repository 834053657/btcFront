import { merge, includes, pick, keys, flatMap, findIndex, reduce } from 'lodash';
import { message } from 'antd';
import { authForC1, authForC2, authForC3 } from '../services/user';

export default {
  namespace: 'authentication',
  state: {
    stage: 0,
    status: 1, // 1：未认证，2：认证中，3：未通过，4: 已通过
    reason: null,
    default_country: 'CN',
    default_card_type: '1',
    country_code: null,
    card_type: null, // 1: 身份证, 2: 驾照, 3: 护照
    back_image: null,
    front_image: null,
  },
  effects: {
    *submitInfo({ payload }, { call, put, select }) {
      const stage = yield select(state => state.authentication.stage);
      const effectName = ['authForC1', 'authForC2', 'authForC3'][stage];
      return yield put({
        type: effectName,
        payload,
      });
    },
    *authForC1({ payload }, { call, put, select }) {
      const res = yield call(authForC1, payload);
      if (res.code === 0) {
        yield put({
          type: 'SUBMIT_INFO',
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
          type: 'SUBMIT_INFO',
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
          type: 'SUBMIT_INFO',
          payload,
        });
      } else {
        message.error(res.msg || '提交失败');
      }
    },
    *updateAuthStatus({ payload }, { call, put }) {
      console.log('hello', payload);
      yield put({ type: 'UPDATE_AUTH_STATUS', payload });
    },
  },
  reducers: {
    UPDATE_AUTH_STATUS(state, { payload }) {
      const detailList = flatMap(payload);
      const stage = findIndex(detailList, o => includes([2, 1], o.status));
      const status = detailList[stage].status;
      const detail = reduce(detailList, (o, no) => merge(o.detail, no.detail), {});
      return {
        ...state,
        stage,
        status,
        ...detail,
      };
    },
    SUBMIT_INFO(state, payload) {
      return {
        ...state,
        stage: state.stage < 2 ? state.stage + 1 : state.stage,
        status: 2,
        ...payload,
      };
    },
  },
};
