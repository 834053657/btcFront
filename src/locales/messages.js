import { FormattedMessage, defineMessages } from 'react-intl';
import defMessages from './zh.json';

const generateMsgs = () => {
  const msgObj = {};
  const lolwat = {}.hasOwnProperty;
  // for (const k in defMessages) {
  for (const k in defMessages) {
    if (lolwat.call(defMessages, k)) {
      const keys = k.split('.');
      msgObj[keys[keys.length - 1]] = {
        id: k,
        defaultMessage: defMessages[k],
      };
    }
  }

  return msgObj;
};

const obj = generateMsgs();
console.log(obj);

// const messages = defineMessages(obj);
//
// /*const messages = defineMessages({
//   buy: {
//     id: 'trade.buy',
//     defaultMessage: defMessages['trade.buy'],
//   },
//   sale: {
//     id: 'trade.sale',
//     defaultMessage: defMessages['trade.sale'],
//   },
//   country: {
//     id: 'trade.country',
//     defaultMessage: defMessages['trade.country'],
//   }
// });*/

export default obj;
