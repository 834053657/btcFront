import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import { message, notification } from 'antd';
import createHistory from 'history/createHashHistory';

// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';

import 'moment/locale/zh-cn';
import './rollbar';
import { getDefaultLocal } from './utils/utils';
import { getLocale, setLocale } from './utils/authority';
import './index.less';
import CONFIG from './utils/config';
import { dvaSocket } from './utils/socket';
import promptMsgs from './locales/messages-prompt';


if (!getLocale()) {
  setLocale(getDefaultLocal());
}

message.config({
  duration: 2,
  top: '35%',
});

notification.config({
  placement: 'topRight',
  top: 50,
  duration: 2,
});

global.CONFIG = CONFIG;
global.PROMPT = promptMsgs;



const undo = r => (state, action) => {
  const newState = r(state, action);
  if (action.type === 'login/logout') {
    return {}
  }
  else {
    return newState
  }
};

// 1. Initialize
const app = dva({
  history: createHistory(),
  onReducer: undo,
});

// 参考文档 https://socket.io/docs/client-api/#with-extraheaders
const options = {
  autoConnect: false,
};

// 2. Plugins
// if (process.env.KG_API_ENV === 'dev' || !process.env.KG_API_ENV) {
// 暂时写法 只在开发环境打开socket
app.use(dvaSocket(CONFIG.socket_url, options));
// }
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

// app.use(dvaSocket(CONFIG.socket_url, options));

export default app._store; // eslint-disable-line
