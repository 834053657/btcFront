import { message } from 'antd';
import { mapKeys } from 'lodash';
import { getTransfers, queryPayments, userRecharge, userWithdraw, queryFee, getHistoryAddress } from '../services/api';

export default {
  namespace: 'wallet',

  state: {
    sysPayments: {},
    transfer: {
      list: [],
      pagination: {
        page_size: 10,
      },
    },
    historyAddress: {
      list: [],
      pagination: {
        page_size: 10,
      },
    },
  },

  effects: {
    *fetchTransfer({ payload }, { call, put }) {
      const response = yield call(getTransfers, payload);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      } else {
        message.error(response.msg);
      }
    },
    *fetchHistoryAddress({ payload }, { call, put }) {
      const response = yield call(getHistoryAddress, payload);
      if (response.code === 0 && response.data) {
        yield put({
          type: 'saveHistoryList',
          payload: response.data,
        });
      } else {
        message.error(response.msg);
      }
    },
    *fetchSysPayments(_, { call, put }) {
      const response = yield call(queryPayments) || {};
      if (response && response.code === 0) {
        yield put({
          type: 'savePayments',
          payload: mapKeys(response.data, 'id'),
        });
      }
    },
    *fetchFee({ payload, callback }, { call, put }) {
      const response = yield call(queryFee, payload) || {};
      if (response.code === 0) {
        yield callback && callback(response.data);
      } else {
        message.error(response.msg);
      }
    },
    *sendRecharge({ payload, callback }, { call }) {
      const response = yield call(userRecharge, payload);
      if (callback) {
        yield call(callback, response);
      }
    },
    *sendWithdraw({ payload, callback }, { call }) {
      const response = yield call(userWithdraw, payload);
      if (callback) {
        yield call(callback, response);
      }
    },
  },

  reducers: {
    saveList(state, { payload }) {
      const pagination = {
        ...state.transfer.pagination,
        page: payload.paginator.page,
        total: payload.paginator.total,
      };
      return {
        ...state,
        transfer: {
          list: payload.items,
          pagination,
        },
      };
    },
    saveHistoryList(state, { payload }) {
      const pagination = {
        ...state.historyAddress.pagination,
        page: payload.paginator.page,
        total: payload.paginator.total,
      };
      return {
        ...state,
        historyAddress: {
          list: payload.items,
          pagination,
        },
      };
    },
    savePayments(state, { payload }) {
      return {
        ...state,
        sysPayments: payload,
      };
    },
  },
};
