import antdZh from 'antd/lib/locale-provider/zh_CN';
import appLocaleDataZh from 'react-intl/locale-data/zh';
import zhMessages from './zh.json';

const appLocaleZh = {
  messages: {
    ...zhMessages,
  },
  antd: antdZh,
  locale: 'zh-Hans-CN',
  data: appLocaleDataZh,
};

export default appLocaleZh;
