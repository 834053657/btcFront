import React, { Fragment } from 'react';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import { Icon, Layout } from 'antd';
import { connect } from 'dva';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import { getRoutes } from '../utils/utils';

const { Footer } = Layout;

class UserLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.props.dispatch({
      type: 'global/fetchConfigs',
    });
  }

  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = CONFIG.web_name;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${title}`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  {/*<span className={styles.title}>{CONFIG.web_name}</span>*/}
                </Link>
              </div>
              <div className={styles.desc}>{CONFIG.web_sub_title}</div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <Footer style={{ padding: 0, backgroundColor: '#092136' }}>
            <GlobalFooter
              links={[
                {
                  key: '1',
                  title: '帮助',
                  href: '#',
                  blankTarget: true,
                },
                {
                  key: '2',
                  title: '隐私',
                  href: '#',
                  blankTarget: true,
                },
                {
                  key: '3',
                  title: '条款',
                  href: '#',
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
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ global, loading }) => ({}))(UserLayout);
