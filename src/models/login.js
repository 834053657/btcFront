import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { accountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    error: undefined,
    g2Visible: undefined,
    loginInfo: undefined,
  },

  effects: {
    *login({ payload, callback }, { call, put }) {
      const response = yield call(accountLogin, payload);
      // Login successfully
      if (response.code === 0 && response.data) {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loginInfo: response.data,
          },
        });
        reloadAuthorized();

        yield put(routerRedux.push('/'));
      } else if (response.code === 1000) {
        //  需谷歌验证
        yield put({
          type: 'changeLoginStatus',
          payload: {
            g2Visible: true,
            loginInfo: payload,
          },
        });
      } else if (response.code === 1001) {
        //  谷歌验证失败
        message.error(response.msg);
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            error: response.msg,
          },
        });
      }
      if (callback) {
        yield callback(response);
      }
    },
    *logout({ payload }, { put, select }) {
      const { isRedirect } = payload || {};
      try {
        if (isRedirect) {
          // get location pathname
          const urlParams = new URL(window.location.href);
          const pathname = yield select(state => state.routing.location.pathname);
          // add the parameters in the url
          urlParams.searchParams.set('redirect', pathname);
          window.history.replaceState(null, 'login', urlParams.href);
        }
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {},
        });
        yield put({
          type: 'user/saveCurrentUser',
          payload: {},
        });
        yield put({
          type: 'SOCKET/CLOSE',
        });
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.loginInfo);
      return {
        ...state,
        loginInfo: payload.loginInfo,
        g2Visible: payload.g2Visible,
        error: payload.error,
      };
    },
  },
};
