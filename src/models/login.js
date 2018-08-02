import { routerRedux } from 'dva/router';
import { message, Modal } from 'antd';
import { accountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    error: undefined,
    g2Visible: undefined,
    secureVisible: undefined,
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
      } else if (response.code === 2000) {
        // 连续输错3次 需进行邮箱/手机 验证
        yield put({
          type: 'changeLoginStatus',
          payload: {
            secureVisible: true,
            loginInfo: payload,
          },
        });
      } else if (response.code === 2001) {
        // 连续输错6次 账号已被封禁2小时
        Modal.warning({
          title: '账号冻结通知',
          content: `您的账号 ${payload.account}，因为密码错误次数过多，已被系统冻结登录120分钟，如需解封请联系客服。`
        });
      } else if (response.code === 2002) {
        // 用户已被永久封号 禁止登录
        Modal.warning({
          title: '账号冻结通知',
          content: `您的账号 ${payload.account}，已被系统永久封号，如有疑问请联系客服。`
        });
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
      yield put({ type: 'global/unmountIntercomWidget' })
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
        secureVisible: payload.secureVisible,
        error: payload.error,
      };
    },
  },
};
