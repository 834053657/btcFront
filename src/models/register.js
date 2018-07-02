import { message } from 'antd';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import { fakeRegister, postVerify } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {},

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      if (response.code === 0 && response.data) {
        yield setAuthority(response.data);
        yield reloadAuthorized();
        yield put(
          routerRedux.push({
            pathname: '/user/register-result',
            search: stringify({ account: payload.email }),
          })
        );
      } else {
        message.error(response.msg);
      }
    },
    *sendVerify({ payload, callback }, { call }) {
      const response = yield call(postVerify, payload);
      if (callback) {
        yield call(callback, response);
      }
    },
  },

  reducers: {},
};
