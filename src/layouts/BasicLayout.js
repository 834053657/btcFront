import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, message, Modal } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
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
import { getAuthority } from '../utils/authority';

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
  state = {
    isMobile,
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

    this.props.dispatch({
      type: 'global/fetchConfigs',
    });
    if (token && user.id) {
      // this.props.dispatch({
      //   type: 'SOCKET/OPEN',
      // });
      this.props.dispatch({
        type: 'user/fetchCurrent',
        callback: this.setSocketToken,
      });
      // this.props.dispatch({
      //   type: 'global/fetchNotices',
      //   payload: { status: 0, type: 1 },
      // });
    }
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
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/readNotices',
      payload: { all: true },
      callback: () => {
        this.props.dispatch({
          type: 'global/fetchNotices',
          payload: { status: 0, type: 2 },
        });
      },
    });
  };
  handleNoticeViewMore = type => {
    this.props.dispatch(routerRedux.push('/message/list'));
  };
  handleNoticeRead = item => {
    let type = 'global/readNotices';
    let payload = { all: false, id: item.id };

    if (item.msg_type === 104 || item.msg_type === 108) {
      type = 'global/readNotices';
      payload = { all: false, order_id: item.content.order_id };
    }
    this.props.dispatch({
      type,
      payload,
      callback: () => {
        if (item.msg_type === 1) {
          this.props.dispatch(
            routerRedux.push(`/message/info-detail/${item.content && item.content.ref_id}`)
          );
        } else if ([11, 12, 21, 22].indexOf(item.msg_type) >= 0) {
          /* Modal.success({
            // title: item.title,
            title: '提示',
            content: getMessageContent(item),
            onOk: () => {},
          }); */
          this.props.dispatch(routerRedux.replace(`/user-center/index`));
        } else if ([31, 32, 33, 34].indexOf(item.msg_type) >= 0) {
          this.props.dispatch(routerRedux.replace(`/wallet?activeKey=3`));
        } else if ([41, 42].indexOf(item.msg_type) >= 0) {
          this.props.dispatch(routerRedux.replace(`/ad/terms`));
        } else if (item.msg_type >= 100 && item.msg_type <= 114) {
          //todo redict to order detail
          if (item.content && item.content.goods_type === 1)
            this.props.dispatch(routerRedux.replace(`/itunes/order/${item.content.order_id}`));
          else if (item.content && item.content.goods_type === 2) {
            this.props.dispatch(routerRedux.replace(`/card/deal-line/${item.content.order_id}`));
          }
        } else if ([131, 132, 133].indexOf(item.msg_type) >= 0) {
          this.props.dispatch(routerRedux.replace(`/ad/my`));
        } else {
          // todo
          console.log(item.msg_type);
        }

        this.props.dispatch({
          type: 'global/fetchNotices',
          payload: { status: 0, type: 3 },
        });
      },
    });
  };
  handleMenuClick = ({ key }) => {
    if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }
    console.log(key);
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
    if (visible) {
      // this.props.dispatch({
      //   type: 'global/fetchNotices',
      // });
    }
  };
  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      notices,
      noticesCount,
      routerData,
      match,
      location,
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
              logo={logo}
              menuData={getMenuData()}
              Authorized={Authorized}
              location={location}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              noticesCount={noticesCount}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onNoticeView={this.handleNoticeViewMore}
              onNoticeClick={this.handleNoticeRead}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
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
          <Footer style={{ padding: 0, backgroundColor: '#092136' }}>
            <GlobalFooter
              links={[
                {
                  key: '1',
                  title: '帮助',
                  href: '/#/information/help',
                  blankTarget: true,
                },
                {
                  key: '2',
                  title: '隐私',
                  href: '/#/information/privacy',
                  blankTarget: true,
                },
                {
                  key: '3',
                  title: '条款',
                  href: '/#/information/terms',
                  blankTarget: true,
                },
              ]}
              copyright={
                <Fragment>
                  Copyright <Icon type="copyright" /> 深圳凯歌科技有限公司
                </Fragment>
              }
            />
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
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  noticesCount: global.noticesCount,
}))(BasicLayout);
