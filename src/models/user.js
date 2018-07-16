import { message } from 'antd';
import { routerRedux } from 'dva/router';
import {
  queryCurrent,
  forgetPassword,
  resetPassword,
  updateEmail,
  updateMobile,
  updatePassword,
  updateG2Validate,
  getG2Secret,
  postAuth,
  postPayMethod,
  deletePayMethod,
  updateAvatar,
  queryMyOrderList,
  checkG2Validate,
} from '../services/user';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    forgetPassword: {},
    changePassword: {},
    g2Info: {},
    myOrders: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchCurrent({ payload, callback }, { call, put }) {
      const response = yield call(queryCurrent);
      if (response.code === 0 && response.data) {
        const { data: { user } } = response;
        yield put({
          type: 'saveCurrentUser',
          payload: response.data,
        });
        callback && setTimeout(callback(user.id, response.data.token, 'CN-zh'), 3000);
      } else {
        message.error(response.msg);
      }
    },
    *submitForgetPassword({ payload, callback }, { call, put }) {
      const response = yield call(forgetPassword, payload);
      if (response.code === 0 && response.data) {
        yield put(routerRedux.push(`/user/change-password/${response.data.code}`));
      } else {
        yield callback && callback();
        message.error(response.msg);
      }
    },
    *submitChangePassword({ payload }, { call, put }) {
      const response = yield call(resetPassword, payload);
      if (response.code === 0) {
        yield put(routerRedux.push('/user/change-password-result'));
      } else {
        message.error(response.msg);
      }
    },
    *submitUpdatePassword({ payload, callback }, { call }) {
      const response = yield call(updatePassword, payload);
      if (response.code === 0) {
        message.success('操作成功!');
        callback && callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *submitChangeEmail({ payload, callback }, { call, put }) {
      const response = yield call(updateEmail, payload);
      if (response.code === 0) {
        message.success('操作成功!');
        yield callback && callback();
        yield put({
          type: 'fetchCurrent',
        });
      } else {
        message.error(response.msg);
      }
    },
    *submitChangeMobile({ payload, callback }, { call, put }) {
      const response = yield call(updateMobile, payload);
      if (response.code === 0) {

        message.success('操作成功');
        yield callback && callback();
        yield put({
          type: 'fetchCurrent',
        });
      } else {
        message.error(response.msg);
      }
    },
    *submitChangeAvatar({ payload, callback }, { call, put }) {
      const response = yield call(updateAvatar, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        // callback && callback();
        yield setTimeout(callback && callback(), 1000);
      } else {
        message.error(response.msg);
      }
    },
    *submitChangeG2Validate({ payload, callback }, { call, put }) {
      const response = yield call(updateG2Validate, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(response.msg);
      }
    },
    *submit2Validate({ payload, callback }, { call, put }) {
      const response = yield call(checkG2Validate, payload);
      if (response.code === 0) {
        callback && callback(response.data);
      } else {
        message.error(response.msg);
      }
    },
    *fetchG2Info(_, { call, put }) {
      const response = yield call(getG2Secret);
      if (response.code === 0) {
        yield put({
          type: 'saveG2Info',
          payload: response.data,
        });
      } else {
        message.error(response.msg);
      }
    },
    *submitUserAuth({ payload, callback }, { call, put }) {
      const response = yield call(postAuth, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(response.msg);
      }
    },
    *submitUserPayMethod({ payload, callback }, { call, put }) {
      const response = yield call(postPayMethod, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(response.msg);
      }
    },
    *submitDeleteUserPayMethod({ payload, callback }, { call, put }) {
      console.log('submitDeleteUserPayMethod', payload);
      const response = yield call(deletePayMethod, payload);
      if (response.code === 0) {
        yield put({
          type: 'fetchCurrent',
        });
        message.success('操作成功！');
        callback && callback();
      } else {
        message.error(response.msg);
      }
    },
    *fetchMyOrderList({ payload, callback }, { call, put }) {
      const res = yield call(queryMyOrderList, payload);
      if (res.code === 0) {
        yield put({
          type: 'saveMyOrderList',
          payload: res.data,
        });
        callback && callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveG2Info(state, { payload }) {
      return {
        ...state,
        g2Info: payload,
      };
    },
    saveCurrentUser(state, action) {
      setAuthority(action.payload);
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveMyOrderList(state, { payload }) {
      const { items = [], paginator } = payload || {};
      return {
        ...state,
        myOrders: {
          list: items,
          pagination: { ...paginator, current: paginator.page },
        },
      };
    },
  },
};
