import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { Server, SocketIO } from 'mock-socket';
import createSocket from 'dva-socket.io';
import {
  push_system_message,
  enter_chat_room,
  leave_chat_room,
  receive_message,
} from '../services/socket';
import { playAudio } from './utils';

export function dvaSocket(url, option) {
  // 如需调试线上socket 请吧isDev 设置成false
  const isDev = false;
  // const isDev = process.env.NODE_ENV === 'development';
  console.log('socket-url', url);
  if (isDev) {
    const mockServer = new Server(url);
    mockServer.on('connection', async server => {
      console.log('*************8mock-socket connected......');
      // const res = await push_system_message();
      // mockServer.emit('test', res);
    });

    mockServer.on('pull_system_message', async server => {
      const res = await push_system_message();
      mockServer.emit('push_system_message', res);
    });

    mockServer.on('enter_chat_room', async server => {
      const res = await enter_chat_room();
      mockServer.emit('enter_room', res);
    });

    mockServer.on('leave_chat_room', async server => {
      const res = await leave_chat_room();
      mockServer.emit('leave_room', res);
    });

    mockServer.on('send_message', async server => {
      console.log('mockServer send_message...');
      const res = await receive_message();
      mockServer.emit('receive_message', res);
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
          });
        },
        push_system_message: (data, dispatch, getState) => {
          const { data: msg } = JSON.parse(data);
          const { oldNotices } = getState().global;
          const currURL = window.location.href;

          oldNotices.unshift(msg);
          const rs = { data: { items: oldNotices } };
          dispatch({
            type: 'global/saveNotices',
            payload: rs,
          });

          if (currURL.indexOf('/card/deal-line/')) {
            const current_id = currURL.substring(currURL.lastIndexOf('/') + 1);

            if (msg.content && msg.content.order_id && msg.content.order_id + '' === current_id) {
              dispatch({
                type: 'card/fetchOrderDetail',
                payload: { id: msg.content.order_id },
              });
            }
          }

          /* if (msg.msg_type > 100) {
            dispatch({
              type: 'user/fetchCurrent',
            });
          } */
          playAudio();
        },
        userinfo: (data, dispatch, getState) => {
          const { data: msg } = JSON.parse(data);
          const { currentUser } = getState().user;
          const { wallet } = currentUser;

          dispatch({
            type: 'user/saveCurrentUser',
            payload: { ...currentUser, wallet: msg.wallet },
          });
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
        receive_message: (data, dispatch, getState) => {
          // console.log('receive_message', data);
          const { data: msg } = JSON.parse(data); // order msg type 快捷短语/申述聊天
          // const { data: msg } = data;
          const { currentUser: { user = {} } } = getState().user;
          console.log(getState().user);
          console.log(user);

          // console.log(data);
          console.log(msg);
          if (msg && msg.order_msg_type === 1) {
            // 快捷短语
            const { quickMsgList } = getState().card;

            quickMsgList.unshift(msg);
            dispatch({
              type: 'card/setQuickMsgList',
              payload: { data: quickMsgList },
            });
            // playAudio();
          } else if (msg && msg.order_msg_type === 2) {
            // 申述聊天
            const { chatMsgList } = getState().card;

            chatMsgList.unshift(msg);
            dispatch({
              type: 'card/setChatMsgList',
              payload: { data: chatMsgList },
            });
            // playAudio();
          } else {
            /* console.log({ id: msg.content && msg.content.order_id });
            dispatch({
              type: 'card/fetchOrderDetail',
              payload: { id: msg.content && msg.content.order_id },
            }); */
          }

          user && user.id !== msg.sender.id ? playAudio() : null;
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
            console.log('ppp', payload);
            return payload;
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
          evaluate: (action, dispatch, getState) => action.type === 'send_message',
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
          evaluate: (action, dispatch, getState) => action.type === 'SOCKET/OPEN',
          request: (action, dispatch, getState, socket) => {
            console.log('SOCKET/OPEN', socket);
            // socket.on('connect', (data)=> {
            //   console.log('connectxxx');
            // });
            const { id, language, token } = action.payload;
            /* eslint no-param-reassign:0 */
            socket.io.opts.transportOptions = {
              polling: {
                extraHeaders: {
                  'ITUNES-UID': id,
                  'ITUNES-TOKEN': token,
                  'ITUNES-LANGUAGE': language,
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
