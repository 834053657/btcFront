import { message } from 'antd';
import { submitPublish, queryPrice } from '../services/api';

export default {
  namespace: 'publish',

  state: {
    price: null,
    prices: null,
  },

  effects: {
    *PostPublish({ payload, callback }, { call, put }) {
      console.log('子任务呢');
      const response = yield call(submitPublish, payload);
      yield put({
        type: 'price',
        payload: response,
      });
      if (response.code === 0) {
        message.success('发布成功');
        callback && callback(response);
      } else {
        message.error(response.msg);
      }
    },
    *fetchNewPrice({ payload }, { call, put }) {
      const response = yield call(queryPrice, payload);
      if (response.code === 0) {
        yield put({
          type: 'setPrice',
          payload: response.data,
        });
      }
    },
  },

  reducers: {
    price(state, { payload }) {
      return {
        ...state,
        prices: payload,
      };
    },

    setPrice(state, { payload }) {
      return {
        ...state,
        price: payload.at_price,
      };
    },
  },
};
