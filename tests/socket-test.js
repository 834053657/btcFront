const io = require('socket.io-client');

const socket = io('http://47.106.111.213:9000/socket.io/', {
  autoConnect: false,
  reconnectionDelayMax: 100,
  reconnection: false,
  reconnectionDelay: 10000,
});
socket.on('connect', () => {
  console.log('connect');
  // socket.on('test', (data) => {
  //   console.log('test', data);
  // });
  // socket.on('get_history', (data) => {
  //   console.log(' get_history return', data);
  // });
  socket.emit(
    'set_user_id',
    JSON.stringify({ id: 10029, token: '057a73e032dfe8ab0dc6537f2ab7dad2', language: 'CN-zh' }),
    data => {
      console.log(' set_user_id ok', data);
    }
  );
  socket.emit('enter_chat_room', '{"order_id":"79"}', data => {
    console.log('enter_chat_room ok', data);
  });
});
socket.open();
