import { addLocaleData } from 'react-intl';
import appLocaleEn from '../locales/en-US';
import appLocaleZh from '../locales/zh-Hans-CN';
import { getLocale } from './authority';

const getAppLocale = () => {
  const lang = getLocale() || 'zh';
  console.log(lang)
  let appLocale = null;
  switch (lang) {
    case 'en-GB':
      addLocaleData(appLocaleEn.data);
      appLocale = appLocaleEn;
      break;
    case 'zh-CN':
      addLocaleData(appLocaleZh.data);
      appLocale = appLocaleZh;

      break;
    default:
      appLocale = appLocaleZh;

      break;
  }
  return appLocale;
};

const getLang = () => {
  return getLocale() || 'zh';
};

export default {
  getAppLocale,
  getLang,
};
