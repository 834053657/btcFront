import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { Server, SocketIO } from 'mock-socket';
import createSocket from 'dva-socket.io';
import { get } from 'lodash';
import {
  push_system_message,
  enter_chat_room,
  leave_chat_room,
  receive_message,
  auth_status_update,
} from '../services/socket';

export function dvaSocket(url, option) {
  // 如需调试线上socket 请吧isDev 设置成false
  // const isDev = false;
  const isDev = process.env.KG_API_ENV === 'dev';
  console.log('socket-url', url);
  if (isDev) {
    const mockServer = new Server(url);
    mockServer.on('connection', async server => {
      console.log('*************8mock-socket connected......');

      // setTimeout(async() => {
      //   const res = await auth_status_update();
      //   mockServer.emit('auth_status_update', res)
      // }, 3000)
      // const res = await push_system_message();
      // mockServer.emit('test', res);
    });

    mockServer.on('pull_system_message', async server => {
      const res = await push_system_message();
      mockServer.emit('push_system_message', JSON.stringify(res));
    });

    mockServer.on('enter_chat_room', async server => {
      const res = await enter_chat_room();
      mockServer.emit('enter_room', JSON.stringify(res));
    });

    mockServer.on('leave_chat_room', async server => {
      const res = await leave_chat_room();
      mockServer.emit('leave_room', JSON.stringify(res));
    });

    mockServer.on('send_message', async server => {
      console.log('mockServer send_message...');
      const res = await receive_message();
      mockServer.emit('receive_message', JSON.stringify(res));
    });
  }
  return createSocket(
    url,
    option,
    {
      on: {
        connect: (data, dispatch, getState, socket) => {
          console.log('connect success', data);
          dispatch({
            type: 'global/fetchNotices',
            payload: { status: 0 },
          })
          // dispatch({
          //   type: 'global/fetchNotices',
          //   payload: { status: 0 },
          // });
        },
        push_system_message: (data, dispatch, getState) => {
          console.log('push_system_messages', data)
          // const { data: msg } = JSON.parse(data);
          // const { oldNotices } = getState().global;
          // const currURL = window.location.href;

          // oldNotices.unshift(msg);
          // const rs = { data: { items: oldNotices } };
          // dispatch({
          //   type: 'global/saveNotices',
          //   payload: rs,
          // });

          // if (currURL.indexOf('/card/deal-line/')) {
          //   const current_id = currURL.substring(currURL.lastIndexOf('/') + 1);

          //   if (msg.content && msg.content.order_id && msg.content.order_id + '' === current_id) {
          //     dispatch({
          //       type: 'card/fetchOrderDetail',
          //       payload: { id: msg.content.order_id },
          //     });
          //   }
          // }
          /* if (msg.msg_type > 100) {
            dispatch({
              type: 'user/fetchCurrent',
            });
          } */
          // playAudio();
        },
        userinfo: (data, dispatch, getState) => {
          // console.log(data)
          // const { data: msg } = JSON.parse(data);
          // const { currentUser } = getState().user;
          // const { wallet } = currentUser;

          // dispatch({
          //   type: 'user/saveCurrentUser',
          //   payload: { ...currentUser, wallet: msg.wallet },
          // });
        },
        disconnection: (data, dispatch, getState) => {
          console.log('disconection', data);
        },
        enter_room: (data, dispatch, getState) => {
          console.log(data);
        },
        leave_room: (data, dispatch, getState) => {
          console.log(data);
        },
        receive_message: (response, dispatch, getState) => {
          // const res = JSON.parse(response) || {};
          // if (res.code === 0 && res.data) {
          //   const uid = get(getState(), 'user.currentUser.user.id');
          //   const historyList = get(getState(), 'trade.tradeIm.historyList') || [];
          //   const senderId = get(res, 'data.sender.id');

          //   historyList.push(res.data);
          //   dispatch({
          //     type: 'trade/saveImHistory',
          //     payload: { items: historyList },
          //   });
          //   uid !== senderId ? playAudio() : null;
          // } else {
          //   message.error(res.msg);
          // }
        },
      },
      emit: {
        // set_user_id: {
        //   evaluate: (action, dispatch, getState) => action.type === 'set_socket_token',
        //   data: ({ payload }) => {
        //     console.log('ppp', JSON.stringify(payload));
        //     return JSON.stringify(payload);
        //   },
        //   callback: (data) => {
        //     console.log('xxxx',data)
        //   }
        //
        // },
        post_quick_message: {
          evaluate: (action, dispatch, getState) => action.type === 'post_quick_message',
          data: ({ payload }) => {
            return JSON.parse(payload);
          },
        },
        pull_system_message: {
          evaluate: (action, dispatch, getState) => action.type === 'push_system_message',
          data: ({ payload }) => {
            console.log('socket - push_system_messag');
            return JSON.stringify(payload);
          },
        },
        enter_chat_room: {
          evaluate: (action, dispatch, getState) => action.type === 'enter_chat_room',
          data: ({ payload }) => {
            console.log('enter_chat_room', payload);
            return JSON.stringify(payload);
          },
          callback: data => {
            console.log('enter_chat_room callback', data);
          },
        },
        leave_chat_room: {
          evaluate: (action, dispatch, getState) => action.type === 'leave_chat_room',
          data: ({ payload }) => {
            return JSON.stringify(payload);
          },
        },
        send_message: {
          evaluate: (action, dispatch, getState) => action.type === 'socket/send_message',
          data: ({ payload }) => {
            console.log('send_message', payload);
            return JSON.stringify(payload);
          },
          callback: (data, action) => {
            console.log('send_message callback', data, action);
            if (action.callback) action.callback();
          },
        },
      },
      asyncs: [
        {
          evaluate: (action, dispatch, getState) => action.type === 'SOCKET/ADD_EVENTLISTENER',
          request: (action, dispatch, getState, socket) => {
            const { event, callback } = action;
            socket.on(event, response => {
              callback(JSON.parse(response));
            });
          },
        },
        {
          evaluate: (action, dispatch, getState) => action.type === 'SOCKET/TRIGGER_EVENT',
          request: (action, dispatch, getState, socket) => {
            const { event, payload, callback } = action;
            socket.emit(event, JSON.stringify(payload), (d) => callback(JSON.parse(d)))
          },
        },
        {
          evaluate: (action, dispatch, getState) => action.type === 'SOCKET/OPEN',
          request: (action, dispatch, getState, socket) => {
            if (isDev) {
              return;
            }
            console.log('SOCKET/OPEN', socket);
            // socket.on('connect', (data)=> {
            //   console.log('connectxxx');
            // });
            const { id, language, token } = action.payload;
            /* eslint no-param-reassign:0 */
            socket.io.opts.transportOptions = {
              polling: {
                extraHeaders: {
                  'BTC-UID': id,
                  'BTC-TOKEN': token,
                  'BTC-LANGUAGE': language,
                },
              },
            };
            socket.open();
            // socket.onconnect((data)=> {
            //   console.log('onconnect')
            // });
          },
        },
        {
          evaluate: (action, dispatch, getState) => action.type === 'SOCKET/CLOSE',
          request: (action, dispatch, getState, socket) => {
            console.log('SOCKET/CLOSE', socket);
            // socket.on('connect', (data)=> {
            //   console.log('connectxxx');
            // });
            socket.close();
            // socket.onconnect((data)=> {
            //   console.log('onconnect')
            // });
          },
        },
      ],
    },
    isDev ? SocketIO : null
  );
}
