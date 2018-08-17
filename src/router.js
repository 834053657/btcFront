import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import { IntlProvider } from 'react-intl';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { injectIntl } from 'components/_utils/decorator';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';
import cintl from './utils/intl';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
const appLocale = cintl.getAppLocale()

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});


function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;

  return (
    <LocaleProvider locale={appLocale.antd}>
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages} >
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/user" component={UserLayout} />
            <Route path="/" component={BasicLayout} />
            {/* <AuthorizedRoute
            path="/"
            render={props => <BasicLayout {...props} />}
            // authority={['admin', 'user']}
            redirectPath="/user/login"
          />*/}
          </Switch>
        </ConnectedRouter>
      </IntlProvider>
    </LocaleProvider>
  );
}

export default RouterConfig;
