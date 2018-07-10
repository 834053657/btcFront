import { queryPrice } from '../services/api';

export default {
  namespace: 'adEdit',

  state: {
    price: [],
  },

  effects: {
    *fetchAdMassage({ payload }, { call, put }) {
      const response = yield call(queryPrice);
      yield put({
        type: 'saveEdit',
        payload: response,
      });
    },
    *fetchEdit({ payload }, { call, put }) {
      const response = yield call(queryPrice);
      yield put({
        type: 'saveEdit',
        payload: response,
      });
    },
  },

  reducers: {
    saveEdit(state, { payload }) {
      const { data } = payload;
      return {
        ...state,
        price: data.at_price,
      };
    },
  },
};
