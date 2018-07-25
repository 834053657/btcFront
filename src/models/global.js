import { message } from 'antd';
import { find, filter, mapKeys, groupBy, orderBy, map } from 'lodash';
import { getLocale, setLocale } from '../utils/authority';

import {
  queryOrderList,
  queryConfigs,
  queryTopNotice,
  postVerify,
  postVerifyCaptcha,
  queryMessageList,
  readMessage,
  readOrderMessage,
  getFile,
} from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    oldNotices: [],
    notices: [],
    orders: [],
    noticesCount: null,
    statistics: {},
    banners: [],
    local: getLocale(),
    topNotice: {},
  },

  effects: {
    *fetchTopNotice(_, { call, put }) {
      const response = yield call(queryTopNotice);

      if (response && response.code === 0) {
        yield put({
          type: 'setTopNotice',
          payload: response.data,
        });
      }
    },
    *fetchConfigs(_, { call, put }) {
      // 获取服务器字典
      const response = yield call(queryConfigs) || {};
      if (response && response.code === 0) {
        CONFIG = { ...CONFIG, ...response.data };
        CONFIG.countrysMap = mapKeys(response.data.country, 'code');
        yield put({
          type: 'authentication/UPDATE_DEFAULT_CONFIG',
          payload: CONFIG,
        }); 
      }
      // CONFIG.countrysMap = mapKeys(CONFIG.country, 'code');
    },
    *fetchNotices({ payload }, { call, put }) {
      const res = yield call(queryMessageList, payload);
      // only for ui test
      // if (payload && payload.type === 2) res.data.items = [];
      // if (payload && payload.type === 3) res.data.items = res.data.items.slice(0, 2);

      yield put({
        type: 'saveNotices',
        payload: res,
      });
    },
    *fetchOrders({ payload }, { call, put }) {
      const res = yield call(queryOrderList, payload);
      if (res.code === 0 && res.data) {
        yield put({
          type: 'saveOrders',
          payload: res.data,
        });
      }
    },
    *clearNotices_bak({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.noticesCount);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *clearNotices({ payload, callback }, { call, put }) {
      const res = yield call(readMessage, payload);
      yield put({
        type: 'setReadMessage',
        payload: res,
      });
      if (callback) callback();
    },
    *readNotices({ payload, callback }, { call, put }) {
      const res = yield call(readMessage, payload);
      yield put({
        type: 'setReadMessage',
        payload: res,
      });
      if (callback) callback();
    },
    *readOrderNotices({ payload, callback }, { call, put }) {
      const res = yield call(readOrderMessage, payload);
      yield put({
        type: 'setReadOrderMessage',
        payload: res,
      });
      if (callback) callback();
    },
    *sendVerify({ payload, callback, onError }, { call }) {
      const res = yield call(postVerify, payload);
      if (res.code === 0) {
        message.success('发送成功');
        callback && callback();
      } else {
        message.error(res.msg || '操作失败');
        onError && onError();
      }
    },
    *verifyCaptcha({ payload, callback }, { call }) {
      const res = yield call(postVerifyCaptcha, payload);
      if (res.code === 0) {
        callback && callback(res.data);
      } else {
        message.error(res.msg);
      }
    },
    *getArticle({ payload, callback }, { call }) {
      const res = yield call(getFile, { ...payload });
      callback && callback(res);
    },
  },

  reducers: {
    setTopNotice(state, { payload }) {
      return {
        ...state,
        topNotice: payload,
      };
    },
    setLanguage(state, { payload }) {
      setLocale(payload);
      return {
        ...state,
        local: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      const { data: { items = [] } } = payload || {};
      const oldNotices = state.notices
      const notices = orderBy(items, ['created_at'], ['desc'])
      // let newItems = filter(items.map(item => getMessage(item)), msg => msg != null)
      // newItems = orderBy(newItems, ['created_at'], ['desc'])
      // newItems = groupBy(newItems, item => item.group || 'other')
      return {
        ...state,
        notices,
        oldNotices,
        noticesCount: items.length
      }
    },
    pushNotice (state, { payload }) {
      if (!find(state.notice, { id: payload.id })) {
        const oldNotices = state.notices;
        const notices = orderBy([payload].concat(state.notices))
        console.log(notices)
        return {
          ...state,
          notices,
          oldNotices,
          noticesCount: notices.length
        }
      }
    },
    saveOrders(state, { payload }) {
      return {
        ...state,
        orders: payload.items || [],
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    setReadMessage(state, { payload }) {
      console.log(payload);
      return {
        ...state,
      };
    },
    setReadOrderMessage(state, { payload }) {
      console.log(payload);
      return {
        ...state,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
    push_system_message ({ dispatch }) {
      dispatch({
        type: 'SOCKET/ADD_EVENTLISTENER',
        event: 'push_system_message',
        callback(res) {
          if (res.code === 0) {
            dispatch({
              type: 'pushNotice',
              payload: res.data,
            });
          }
        },
      });
    },
  },
};
