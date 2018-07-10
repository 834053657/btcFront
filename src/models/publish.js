import { message } from 'antd';
import { submitPublish, queryPrice } from '../services/api';

export default {
  namespace: 'publish',

  state: {
    price: null,
  },

  effects: {},

  reducers: {
    setPrice(state, { payload }) {
      return {
        ...state,
        price: payload.at_price,
      };
    },
  },
};
