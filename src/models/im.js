import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { orderBy, get, map, findIndex, uniqueId, size, omit, findKey, mapValues, isEmpty, includes } from 'lodash';
import { socketEmit } from '../utils/utils';

import {
  getTradeHistory,
} from '../services/api';

export default {
  namespace: 'im',

  state: {
    historyList: [],
    cacheDataList: {}, 
    members: [],
    room_id: null,
  },

  effects: {
    *fetchImHistory({ payload, callback }, { call, put }) {
      yield put({
        type: 'GET_FROM_CACHE',
        payload,
      })
      const res = yield call(getTradeHistory, payload);
      if (res.code === 0) {
        yield put({
          type: 'SAVE_IM_HISTORY',
          payload: { order_id: payload.order_id, ...res.data },
        });
        callback && callback()
      } else {
        message.error(res.msg)
      }
    },
    *enterRoom({ payload }, { call, put }) {
      const { order_id } = payload;
      const res = yield socketEmit(put, 'enter_chat_room', payload)
      if (res.code === 0) {
        yield put({
          type: 'ENTER_ROOM',
          payload: { order_id: payload.order_id, ...res.data },
        })
      }
    },
    *leaveRoom({ payload }, { call, put }) {
      const { order_id } = payload;
      const res = yield socketEmit(put, 'leave_chat_room', payload)
      if (res.code === 0) {
        yield put({
          type: 'LEAVE_ROOM',
          payload: res.data,
        })
      }
    },
    *sendMessage({ payload, callback }, { call, put, select }) {
      const { order_id, content } = payload
      const room_id = yield select(state => state.im.room_id)
      const user = yield select(state => state.user.currentUser.user)
      const params = {
        temp_msg_id: user.id + +uniqueId(),
        order_id: +order_id,
        content: payload.content,
        sender: user,
      }
      const res = yield socketEmit(put, 'send_message', params)
      if(room_id != null) {
        yield put({ 
          type: 'SEND_MESSAGE',
          payload: params
        })
        callback && callback()
      }
    },
  },

  reducers: {
    GET_FROM_CACHE (state, payload) {
      const cacheDataList = state.cacheDataList[payload.order_id] || {}
      return {
        ...state,
        historyList: cacheDataList.historyList || [],
        members: cacheDataList.members || [],
      } 
    },
    SAVE_IM_HISTORY (state, { payload }) {
      const { items, order_id } = payload
      const newItems = map(items, d => { 
        return { 
          ...d, 
          created_at: d.created_at * 1000,
        }
      })
      let cacheDataList = state.cacheDataList
      if (size(cacheDataList) > 5) {
        const key = findKey(cacheDataList, (v, k) => k === size(cacheDataList))
        cacheDataList = omit(cacheDataList, key)
      } 
      cacheDataList[order_id] = cacheDataList[order_id] || {}
      cacheDataList[order_id].historyList = newItems
      return {
        ...state,
        historyList: orderBy(newItems, ['created_at'], ['asc']),
        cacheDataList
      }
    },
    ENTER_ROOM (state, { payload }) {
      const { room_id, order_id, members } = payload
      let cacheDataList = state.cacheDataList
      if (size(cacheDataList) > 5) {
        const key = findKey(cacheDataList, (v, k) => k === size(cacheDataList))
        cacheDataList = omit(cacheDataList, key)
      } 
      cacheDataList[order_id] = cacheDataList[order_id] || {}
      cacheDataList[order_id].members = payload.members
      return {
        ...state,
        room_id,
        members,
        cacheDataList
      }
    },
    LEAVE_ROOM (state, { payload }) {
      return {
        ...state,
        room_id: null,
      }
    },
    SEND_MESSAGE (state, { payload }) {
      const newMsg = {
        msg_type: 101,
        id: payload.order_id,
        temp_msg_id: payload.temp_msg_id,
        message: {
          content: payload.content,
        },
        created_at: Date.now(),
        sender: mapValues(payload.sender, (val, key) => isEmpty(val) && includes(['avatar', 'nickname'], key) ? '数据有误' : val)
      }
      const historyList = orderBy([newMsg, ...state.historyList], ['created_at'], 'asc')
      return {
        ...state,
        historyList
      }
    },
    RECEIVE_MESSAGE (state, { payload }) {
      const { temp_msg_id } = payload
      const newMsg = {
        ...payload,
        sender: mapValues(payload.sender, (val, key) => isEmpty(val) && includes(['avatar', 'nickname'], key) ? '数据有误' : val)
      }
      let newHistoryList = state.historyList
      let index = -1
      newMsg.created_at && (newMsg.created_at *= 1000)
      if (~(index = findIndex(state.historyList, { temp_msg_id }))) {
        newHistoryList[index] = newMsg
      } else {
        newHistoryList = [newMsg, ...state.historyList]
      }
      newHistoryList = orderBy(newHistoryList, ['created_at'], ['asc'])
      return {
        ...state,
        historyList: newHistoryList
      }
    },
  },
  subscriptions: {
    receive_message ({ dispatch }) {
      dispatch({
        type: 'SOCKET/ADD_EVENTLISTENER',
        event: 'receive_message',
        callback(res) {
          if (res.code === 0) {
            console.log('receive_message', res)
            dispatch({
              type: 'RECEIVE_MESSAGE',
              payload: res.data,
            });
          }
        }, 
      })
    }
  },
};
