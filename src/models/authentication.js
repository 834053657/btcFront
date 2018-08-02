import { get, merge, includes, pick, keys, flatMap, findIndex, reduce } from 'lodash';
import { message } from 'antd';
import { authForC1, authForC2, authForC3 } from '../services/user';

export default {
  namespace: 'authentication',
  state: {
    step: 0,
    status: 1, // 1：未认证，2：认证中，3：未通过，4: 已通过
    reason: null,
    default_country: null,
    default_card: null,
    country_code: null,
    card_type: null, // 1: 身份证, 2: 驾照, 3: 护照
    number: null,
    back_image: null,
    front_image: null,
  },
  effects: {
    *submitInfo({ payload }, { call, put, select }) {
      const step = yield select(state => state.authentication.step);
      const api = [authForC1, authForC2, authForC3][step];
      yield put({
        type: 'SUBMIT_INFO',
        payload,
      });
      const res = yield call(api, payload)
      if (res.code !== 0) {
        message.error(res.msg || '提交失败');
      }
      return res 
    },
    *getVideoURLFromFacePlus ({ payload }, { call, put }) {
      const res = yield call(authForC3, payload)
      if (res.code !== 0) {
        message.error(res.msg || '提交失败');
      }
      return res
    },
    *updateAuthStatus({ payload }, { call, put }) {
      yield put({ type: 'UPDATE_AUTH_STATUS', payload });
    },
  },
  reducers: {
    UPDATE_DEFAULT_CONFIG (state, { payload }) {
      return {
        ...state,
        default_card: get(payload, 'card_types["1"]', null) && '1',
        default_country: get(payload, 'country[0].code', null),
      }
    },
    UPDATE_AUTH_STATUS(state, { payload }) {
      const detailList = flatMap(payload);
      let step = findIndex(detailList, o => includes([3, 2, 1], +o.status));
      step === -1 && (step = 2);
      const status = Number(detailList[step].status);
      const reason = detailList[step].reason;
      const detail = reduce(
        detailList,
        (o, no) => {
          return merge(o, get(no, 'detail', {}));
        },
        {}
      );
      return {
        ...state,
        step,
        status,
        ...detail,
        reason,
      };
    },
    SUBMIT_INFO(state, payload) {
      return {
        ...state,
        status: 2,
        reason: null,
        ...payload,
      };
    },
  },
  subscriptions: {
    auth_status_update({ dispatch }) {
      dispatch({
        type: 'SOCKET/ADD_EVENTLISTENER',
        event: 'auth_status_update',
        callback(res) {
          if (res.code === 0) {
            console.log('auth_status_update', res.data)
            dispatch({
              type: 'updateAuthStatus',
              payload: res.data,
            });
          }
        },
      });
    },
  },
};
