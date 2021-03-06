import { message } from 'antd';
import { mapKeys } from 'lodash';
import {
  getTransfers,
  queryBlockConfirmFee,
  userSendBtc,
  userWithdraw,
  queryFee,
  getHistoryAddress,
} from '../services/api';

export default {
  namespace: 'wallet',

  state: {
    blockConfirmFee: {},
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
    *fetchBlockConfirmFee(_, { call, put }) {
      const response = yield call(queryBlockConfirmFee) || {};
      if (response && response.code === 0) {
        yield put({
          type: 'saveBlockConfirmFee',
          payload: response.data,
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
    *sendSendBtc({ payload, callback }, { call }) {
      const response = yield call(userSendBtc, payload);
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
      console.log('------');
      console.log(pagination);
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
    saveBlockConfirmFee(state, { payload }) {
      return {
        ...state,
        blockConfirmFee: payload.list,
      };
    },
  },
};
