import { message } from 'antd';
import { get, chain, range, last, keys, orderBy, findIndex, uniqueId, size, mapValues, isEmpty, includes } from 'lodash';
import { socketEmit } from '../utils/utils';

import {
  getTradeHistory,
} from '../services/api';

export default {
  namespace: 'im',

  state: {
    records: [], // 当前的聊天记录
    remoteCount: 0, // 当前远程消息总数
    firstFetchEndIndex: 0, // 第一次fetch数据后的结束位置, 在这之后的都认为是本地数据，本地数据总是会进行重新排序和去重
    cacheList: {},
    members: [],
    order_id: null,
    room_id: null,
    scrollBottom: null,
  },

  effects: {
    *syncHistory({ payload, callback }, { call, put, select }) {
      const { order_id } = payload
      yield put({
        type: 'SELECT_ORDER',
        payload: {
          order_id,
        }
      })
      yield put({
        type: 'getCache',
        payload: {
          order_id,
        },
      })
      const remoteCount = yield select(state => state.im.remoteCount)
      const firstFetchEndIndex = yield select(state => state.im.firstFetchEndIndex)
      const res = yield call(getTradeHistory, { order_id, page: 1, page_size: 50 })
      if (res.code !== 0) {
        message.error(res.msg)
        callback && callback(new Error(res.msg))
      }
      if (firstFetchEndIndex === 0) {
        // 第一次获取 
        yield put({
          type: 'SAVE_HISTORY',
          payload: {
            data: res.data,
            first: true,
          },
        })
        yield put({
          type: 'saveCache',
          payload: {
            order_id, 
          }
        })
        callback && callback()
      } else if (get(res, 'data.paginator.total', 0) - remoteCount > 100) {
        // 本地消息滞后100条以上的时候重置数据并刷新
        yield put({
          type: 'clearCache',
          payload: {
            order_id,
          }
        })
        yield put({
          type: 'syncHistory',
          payload: {
            callback,
          }
        })
      } else {
        // 更新聊天记录 
        const newRes = yield call(getTradeHistory, { order_id, page: 1, page_size: get(res, 'data.paginator.total', 0) - remoteCount || 50 })
        if (newRes.code !== 0) {
          message.error(res.msg)
          callback && callback(new Error(res.msg))
        }
        yield put({
          type: 'SAVE_HISTORY',
          payload: {
            order_id,
            data: newRes.data,
          }
        })
        yield put({
          type: 'saveCache',
          payload: {
            order_id, 
          }
        })
        callback && callback()
      }
    },
    // 获取历史记录从缓存或者localstorage
    *getCache({ payload }, { put, select }) {
      const { order_id } = payload
      const cacheList = yield select(state => state.im.cacheList)
      if (cacheList[order_id]) {
        yield put({
          type: 'SELECT_CACHE',
          payload: {
            order_id
          }
        })
      }
    },

    *saveCache({ payload }, { put, select }) {
      const {
        order_id,
      } = payload
      const cacheList = yield select(state => state.im.cacheList)
      if (!cacheList[order_id]) {
        yield put({
          type: 'CREATE_CACHE_LIST',
          payload: {
            order_id,
          }
        })
      }
      yield put({
        type: 'SAVE_CACHE',
        payload: {
          order_id,
        }
      })
    },

    *clearCache({ payload }, { put }) {
      const {
        order_id
      } = payload
      yield put({
        type: 'CLEAR_CACHE',
        payload: {
          order_id,
        }
      })
    },

    *fetchHistory({ payload }, { put, call, select, take }) {
      const {
        start_index,
        order_id,
      } = payload
      let {
        end_index,
      } = payload
      const firstFetchEndIndex = yield select(state => state.im.firstFetchEndIndex)
      const records = yield select(state => state.im.records)
      if (start_index >= firstFetchEndIndex) return Promise.resolve()
      if (start_index < firstFetchEndIndex && end_index > firstFetchEndIndex) {
        end_index = firstFetchEndIndex
      }
      if (findIndex(records.slice(start_index, end_index), v => v == null) > -1) {
        const res = yield call(getTradeHistory, { order_id, start_index, end_index, desc: 0})
        if (res.code !== 0) return Promise.resolve()
        yield put({
          type: 'UPDATE_HISTORY',
          payload: {
            start_index,
            end_index,
            data: res.data,
          }
        })
        yield put({
          type: 'saveCache',
          payload: {
            order_id,
          }
        })
        return Promise.resolve()
      } else {
        return Promise.resolve()
      }
    },

    *enterRoom({ payload }, { put }) {
      const { order_id } = payload;
      const res = yield socketEmit(put, 'enter_chat_room', payload)
      if (res.code === 0) {
        yield put({
          type: 'ENTER_ROOM',
          payload: { order_id, ...res.data },
        })
        yield put({
          type: 'saveCache',
          payload: {
            order_id,
          }
        })
      }
    },
     
    *leaveRoom({ payload }, { put }) {
      const { order_id } = payload;
      const res = yield socketEmit(put, 'leave_chat_room', payload)
      if (res.code === 0) {
        yield put({
          type: 'LEAVE_ROOM',
          payload: res.data,
        })
        yield put({
          type: 'saveCache',
          payload: {
            order_id,
          }
        })
      }
    },

    *sendMessage({ payload, callback }, { put, select }) {
      const { order_id, content } = payload
      const room_id = yield select(state => state.im.room_id)
      const user = yield select(state => state.user.currentUser.user)
      const params = {
        msg_type: 101,
        temp_msg_id: user.id + +uniqueId(),
        order_id: +order_id,
        content,
        sender: user,
      }
      const res = yield socketEmit(put, 'send_message', params)
      if(res.code === 0 && room_id != null) {
        yield put({ 
          type: 'SEND_MESSAGE',
          payload: params
        })
        yield put({
          type: 'saveCache',
          payload: {
            order_id
          }
        })
        yield put({ type: 'scrollToBottom' })
        callback && callback()
      }
    },

    *scrollToBottom(_, { put }) {
      yield put({
        type: 'SCROLL_TO_BOTTOM',
      })
    },

    *clearCacheList(_, { put }) {
      yield put({
        type: 'CLEAR_CACHE_LIST'
      })
    }
  },

  reducers: {
    SELECT_ORDER (state, { payload }) {
      return {
        ...state,
        order_id: payload.order_id,
        ...(state.order_id !== payload.order_id ? {
          cacheList: {},
          records: [],
          remoteCount: 0,
          firstFetchEndIndex: 0,
          members: [],
        }: {})
      }
    },
    SAVE_HISTORY (state, { payload }) {
      const {
        data: {
          items,
          paginator: {
            total,
          }
        },
        first = false,
      } = payload
      const newRecords = [].concat(state.records)
      const slicedList = newRecords.slice(state.firstFetchEndIndex)
      const newItems = chain(items.concat(slicedList))
        .uniqBy(v => v.id || v.temp_msg_id)
        .filter(v => v != null)
        .orderBy(['created_at_millisec'], 'asc')
        .value()
      newRecords.splice(state.firstFetchEndIndex)
      const start = first ? total - items.length : state.firstFetchEndIndex
      const end = first ? total - items.length + newItems.length : state.firstFetchEndIndex + newItems.length
      range(start, end).forEach((historyIndex, index) => {
        newRecords[historyIndex] = newItems[index]
      })
      return {
        ...state,
        records: [...newRecords],
        firstFetchEndIndex: first ? total - items.length : state.firstFetchEndIndex,
        remoteCount: total, 
      }
    },
    UPDATE_HISTORY (state, { payload }) {
      const {
        start_index,
        end_index,
        data: {
          items,
        }
      } = payload
      const newRecords = [].concat(state.records)
      const newItems = items.slice(0, end_index - start_index)
      newRecords.splice(start_index, end_index - start_index, ...newItems)
      return {
        ...state,
        records: [...newRecords], 
      }
    },
    CREATE_CACHE_LIST (state, { payload }) {
      const { order_id } = payload
      const newCacheList = { ...state.cacheList }
      if (size(newCacheList) > 5) {
        delete newCacheList[last(keys(newCacheList))]
      }  
      newCacheList[order_id] = newCacheList[order_id] || {}
      return {
        ...state,
        cacheList: { ...newCacheList },
      }
    },
    SELECT_CACHE (state, { payload }) {
      const { order_id } = payload
      return {
        ...state,
        order_id,
        ...state.cacheList[order_id]
      }
    },
    SAVE_CACHE (state, { payload }) {
      const { order_id } = payload
      const newCacheList = { ...state.cacheList }
      newCacheList[order_id] = {
        records: [...state.records],
        remoteCount: state.remoteCount,
        firstFetchEndIndex: state.firstFetchEndIndex,
        members: [...state.members],
      }
      return {
        ...state,
        cacheList: { ...newCacheList },
      }
    },
    CLEAR_CACHE (state, { payload }) {
      const { order_id } = payload
      const newCacheList = { ...state.cacheList }
      newCacheList[order_id] = {}
      return {
        ...state,
        cacheList: { ...newCacheList },
        ...(order_id === state.order_id ? {
          cacheList: {},
          records: [],
          remoteCount: 0,
          firstFetchEndIndex: 0,
          members: [],
        } : {})
      }
    },
    CLEAR_CACHE_LIST (state) {
      return {
        ...state,
        cacheList: {},
        records: [],
        remoteCount: 0,
        firstFetchEndIndex: 0,
        members: 0,
      }
    },
    ENTER_ROOM (state, { payload }) {
      const { room_id, members } = payload
      return {
        ...state,
        room_id,
        members,
      }  
    },
    LEAVE_ROOM (state) {
      return {
        ...state,
        room_id: null,
      }
    },
    SEND_MESSAGE (state, { payload }) {
      const newMsg = {
        msg_type: payload.msg_type,
        id: payload.order_id,
        temp_msg_id: payload.temp_msg_id,
        message: {
          content: payload.content,
        },
        created_at_millisec: Date.now(),
        sender: mapValues(payload.sender, (val, key) => isEmpty(val) && includes(['avatar', 'nickname'], key) ? '数据有误' : val)
      }
      const newRecords = [].concat(state.records) 
      let newItems = newRecords.slice(state.firstFetchEndIndex)
      newItems.push(newMsg)
      newItems = orderBy(newItems, ['created_at_millisec'], 'asc') 
      newRecords.splice(state.firstFetchEndIndex, newRecords.length - state.firstFetchEndIndex, ...newItems)
      return {
        ...state,
        records: [...newRecords],
      }
    },
    RECEIVE_MESSAGE (state, { payload }) {
      const newMsg = {
        ...payload,
        sender: mapValues(payload.sender, (val, key) => isEmpty(val) && includes(['avatar', 'nickname'], key) ? '数据有误' : val)
      }
      const newRecords = [].concat(state.records)
      let newItems = newRecords.slice(state.firstFetchEndIndex)
      const foundIndex = findIndex(newItems, { temp_msg_id: payload.temp_msg_id })
      if (foundIndex > -1) {
        newItems[foundIndex] = newMsg
      } else {
        newItems.push(newMsg)
      }
      newItems = orderBy(newItems, ['created_at_millisec'], 'asc')
      newRecords.splice(state.firstFetchEndIndex, newRecords.length - state.firstFetchEndIndex, ...newItems) 
      return {
        ...state,
        records: [...newRecords],
        remoteCount: state.remoteCount + 1,
      }
    },
    SCROLL_TO_BOTTOM (state) {
      return {
        ...state,
        scrollBottom: Symbol(),
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
            dispatch({
              type: 'RECEIVE_MESSAGE',
              payload: res.data,
            });
            dispatch({
              type: 'saveCache',
              payload: {
                order_id: get(res, 'data.message.order_id', null),
              }
            })
            dispatch({ type: 'scrollToBottom' })
          }
        }, 
      })
    },
  },
};
