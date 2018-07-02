import { message } from 'antd';
import { mapKeys, groupBy, orderBy, map } from 'lodash';
import {
  queryNotices,
  queryStatistics,
  queryConfigs,
  queryBanners,
  postVerify,
  postVerifyCaptcha,
  queryMessageList,
  readMessage,
  readOrderMessage,
} from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    oldNotices: [],
    notices: [],
    noticesCount: null,
    statistics: {},
    banners: [],
  },

  effects: {
    *fetchBanners(_, { call, put }) {
      const response = yield call(queryBanners);

      if (response && response.code === 0) {
        yield put({
          type: 'setBanners',
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
        CONFIG.cardTypeMap = mapKeys(response.data.card_type, 'type');
      }
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
    *fetchNotices_bak(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *fetchStatistics(_, { call, put }) {
      const res = yield call(queryStatistics);
      yield put({
        type: 'saveStatistics',
        payload: res.data,
      });
    },
    *clearNotices_bak({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
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
    *sendVerify({ payload, callback }, { call }) {
      const res = yield call(postVerify, payload);
      if (res.code === 0) {
        message.success('发送成功');
        callback && callback();
      } else {
        message.error(res.msg || '操作失败');
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
  },

  reducers: {
    setBanners(state, { payload }) {
      return {
        ...state,
        banners: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      const { data: { items } } = payload || {};
      let newItems = [];
      const tmp1 = [];
      let tmp2 = [];

      map(items, v => {
        if (
          (v.msg_type === 104 || v.msg_type === 108) &&
          v.content &&
          v.content.goods_type &&
          v.content.order_id
        )
          tmp1.push(v);
        else newItems.push(v);
      });
      const orderMessages =
        groupBy(tmp1, d => {
          return `${d.content.goods_type}_${d.msg_type}_${d.content.order_id}`;
        }) || [];
      // console.log(111, orderMessages);
      map(orderMessages, v => {
        tmp2 = orderBy(v, ['created_at'], ['desc']);
        if (tmp2.length > 0) {
          newItems.push({ ...tmp2[0], count: tmp2.length });
        }
      });

      newItems = orderBy(newItems, ['created_at'], ['desc']);
      // console.log(222, newItems);
      return {
        ...state,
        notices: newItems || [],
        oldNotices: items,
        noticesCount: items.length,
      };
    },
    saveStatistics(state, { payload }) {
      return {
        ...state,
        statistics: payload,
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
  },
};
