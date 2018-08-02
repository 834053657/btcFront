import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message, Modal } from 'antd';
import DocumentTitle from 'react-document-title';
import { stringify } from 'qs';
import { connect } from 'dva';
import { get } from 'lodash';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes, getMessageContent } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';
import { getAuthority, setLocale } from '../utils/authority';

const { Content, Header, Footer } = Layout;
const { AuthorizedRoute, check } = Authorized;

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      });
      item.children.forEach(children => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {};
  const childResult = {};
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i;
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData));
    }
  }
  return Object.assign({}, routerData, result, childResult);
};

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen(b => {
  isMobile = b;
});

class BasicLayout extends React.Component {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.props.dispatch({
      type: 'global/fetchConfigs',
    });
  }
  state = {
    isMobile,
    noticesVisible: false,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    };
  }
  componentDidMount() {
    const { token, user } = getAuthority() || {};
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      });
    });

    if (token && user.id) {
      this.props.dispatch({
        type: 'user/fetchCurrent',
        callback: this.setSocketToken,
      });
      this.props.dispatch({
        type: 'global/fetchNotices',
        payload: { status: 0 },
      });
      this.props.dispatch({
        type: 'global/fetchOrders',
        payload: { status: '1,2,5' },
      });
    }
    this.props.dispatch({
      type: 'global/mountIntercomWidget'
    })
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  setSocketToken = (uid, token, language) => {
    this.props.dispatch({
      type: 'SOCKET/OPEN',
      payload: { id: uid, token, language },
    });
  };

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = CONFIG.web_name;
    let currRouterData = null;
    // match params path
    Object.keys(routerData).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = routerData[key];
      }
    });
    if (currRouterData && currRouterData.name) {
      title = `${currRouterData.name} - ${title}`;
    }
    return title;
  }

  /**
   * 获取重定向地址 否则取路由第一个地址
   * @returns {string}
   */
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };
  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  handleNoticeClear = type => {
    this.props.dispatch({
      type: 'global/readNotices',
      payload: { all: 1 },
      callback: () => {
        message.success(`清空了${type}`);
        this.props.dispatch({
          type: 'global/fetchNotices',
          payload: { status: 0 },
        });
      },
    });
  };

  handleNoticeViewMore = type => {
    this.props.dispatch(routerRedux.push({
      pathname: '/message/list',
      search: stringify({ type })
    }));
    this.setState({
      noticesVisible: false
    });
  };

  handleOrderClick = item => {
    const { dispatch } = this.props;
    this.setState({
      noticesVisible: false,
    });
    dispatch({
      type: 'global/readOrderNotices',
      payload: { all: 0, order_id: item.id },
      callback: () => {
        this.props.dispatch({
          type: 'global/fetchOrders',
          payload: { status: '1,2,5' },
        });
      }
    });
    dispatch(routerRedux.push(`/trade/step/${item.id}`));
  };

  handleNoticeRead = item => {
    const { dispatch } = this.props;
    this.setState({
      noticesVisible: false,
    });
    const orderId = get(item, 'message.order_id')
    const idAttr = orderId ? { order_id: orderId } : { id: item.id } 
    dispatch({
      type: 'global/readNotices',
      payload: { all: 0, ...idAttr },
      callback: () => {
        this.props.dispatch({
          type: 'global/fetchNotices',
          payload: { status: 0 },
        });
      }
    });
    dispatch(routerRedux.push(item.to));
  };
  
  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    if (key === 'userCenter') {
      this.props.dispatch(routerRedux.push('/user-center/index'));
      return;
    }

    if (key === 'ad') {
      this.props.dispatch(routerRedux.push('/ad/my'));
      return;
    }

    if (key === 'order') {
      this.props.dispatch(routerRedux.push('/order/my'));
      return;
    }

    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  };

  handleNoticeVisibleChange = visible => {
    this.setState({
      noticesVisible: visible
    });
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
        payload: {
          status: 0
        }
      });
    }
  };

  handleOrderVisibleChange = visible => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchOrders',
        payload: { status: '1,2,5' },
      });
    }
  };

  handleSetLocale = ({ key }) => {
    if (key) {
      this.props.dispatch({
        type: 'global/setLanguage',
        payload: key,
      });
    }
  };
  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      fetchingOrders,
      notices,
      noticesCount,
      routerData,
      match,
      location,
      local,
      orders,
    } = this.props;
    const bashRedirect = this.getBashRedirect();
    const layout = (
      <Layout>
        {this.state.isMobile && (
          <SiderMenu
            logo={logo}
            // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
            // If you do not have the Authorized parameter
            // you will be forced to jump to the 403 interface without permission
            Authorized={Authorized}
            menuData={getMenuData()}
            collapsed={collapsed}
            location={location}
            isMobile={this.state.isMobile}
            onCollapse={this.handleMenuCollapse}
          />
        )}
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              orders={orders}
              logo={logo}
              local={local}
              menuData={getMenuData()}
              Authorized={Authorized}
              location={location}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              fetchinOrders={fetchingOrders}
              notices={notices}
              noticesCount={noticesCount}
              noticesVisible={this.state.noticesVisible}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onViewMore={this.handleNoticeViewMore}
              onNoticeClick={this.handleNoticeRead}
              onOrderClick={this.handleOrderClick}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              onOrderVisibleChange={this.handleOrderVisibleChange}
              onLanguageChange={this.handleSetLocale}
            />
          </Header>
          <Content style={{ height: '100%' }}>
            <Switch>
              {redirectData.map(item => (
                <Redirect key={item.from} exact from={item.from} to={item.to} />
              ))}
              {getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  authority={item.authority}
                  redirectPath="/user/login"
                />
              ))}
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
          <Footer style={{ padding: 0, backgroundColor: '#092136', textAlign: 'center' }}>
            <GlobalFooter />
          </Footer>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  local: global.local,
  orders: global.orders,
  fetchingNotices: loading.effects['global/fetchNotices'],
  fetchingOrders: loading.effects['global/fetchOrders'],
  notices: global.notices,
  noticesCount: global.noticesCount,
}))(BasicLayout);
