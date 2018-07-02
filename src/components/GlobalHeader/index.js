import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import numeral from 'numeral';
import NoticeIcon from '../CustomNoticeIcon';
// import HeaderSearch from '../HeaderSearch';
import TopMenu from '../TopMenu';
import styles from './index.less';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser = {},
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      onNoticeView,
      onNoticeClick,
      notices,
      noticesCount,
    } = this.props;
    const { wallet } = currentUser || {};
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item key="ad">
          <Icon type="code-o" />我的广告
        </Menu.Item>
        <Menu.Item key="order">
          <Icon type="file-text" />我的订单
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const language = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="zh">中文</Menu.Item>
        <Menu.Item key="en">English</Menu.Item>
      </Menu>
    );
    // const noticeData = this.getNoticeData();

    return (
      <div className={styles.header}>
        <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="32" />
          <span>{CONFIG.web_name}</span>
        </Link>
        {isMobile ? (
          <Icon
            className={styles.trigger}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
        ) : (
          <TopMenu {...this.props} />
        )}

        <div className={styles.right}>
          {/*  <Dropdown overlay={language}>
            <span className={`${styles.action}`}>EN/CN</span>
          </Dropdown>*/}
          {currentUser.token && currentUser.user ? (
            <span>
              <Link to="/wallet">
                <Icon type="wallet" style={{ fontSize: '16px', marginRight: '6px' }} />{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(wallet.amount || 0).format('0,0.00')}￥`,
                  }}
                />
              </Link>
              <NoticeIcon
                className={styles.action}
                count={noticesCount}
                onClear={onNoticeClear}
                onView={onNoticeView}
                onItemClick={onNoticeClick}
                onPopupVisibleChange={onNoticeVisibleChange}
                loading={fetchingNotices}
                popupAlign={{ offset: [20, -16] }}
                list={notices}
                title="消息"
                emptyText="您已读完所有消息"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
              />
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar size="small" className={styles.avatar} src={currentUser.user.avatar} />
                  <span className={styles.name}>{currentUser.user.nickname}</span>
                </span>
              </Dropdown>
            </span>
          ) : (
            <span>
              <Link className={styles.action} to="/user/login">
                登录
              </Link>
              <Link className={styles.action} to="/user/register">
                注册
              </Link>
            </span>
          )}
        </div>
      </div>
    );
  }
}
