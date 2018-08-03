import en from './en-prompt.json';
import zh from './zh-prompt.json';
import { getLocale } from '../utils/authority';

const generatePromptMsgs = () => {
  const lang = getLocale() || 'zh-CN';
  let message = null;

  switch (lang) {
    case 'en-GB':
      message = en;
      break;
    case 'zh-CN':
      message = zh;
      break;
    default:
      message = zh;
      break;
  }

  return message;
};

const getPromptMsg = (id, params) => {
  const lang = getLocale() || 'zh-CN';
  let message = '';

  switch (lang) {
    case 'en-GB':
      message = en[id];
      break;
    case 'zh-CN':
      message = zh[id];
      break;
    default:
      message = zh[id];
      break;
  }

  return params ? replaceMsg(message, params) : message;
};

const replaceMsg = (message, params) => {
  const lolwat = {}.hasOwnProperty;
  if (params) {
    for (const k in params) {
      if (lolwat.call(params, k)) {
        message = message.replace(new RegExp('{' + k + '}', 'gm'), params[k]);
      }
    }
  }

  return message;
};

//const promptMsgs = generatePromptMsgs();

const promptMsgs = getPromptMsg;

export default promptMsgs;
