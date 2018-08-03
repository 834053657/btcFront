import { addLocaleData } from 'react-intl';
import appLocaleEn from '../locales/en-US';
import appLocaleZh from '../locales/zh-Hans-CN';
import { getLocale } from './authority';

const getAppLocale = () => {
  const lang = getLocale() || 'zh_CN';
  console.log(lang)
  let appLocale = null;
  switch (lang) {
    case 'en_GB':
      addLocaleData(appLocaleEn.data);
      appLocale = appLocaleEn;
      break;
    case 'zh_CN':
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
  return getLocale() || 'zh_CN';
};

export default {
  getAppLocale,
  getLang,
};
