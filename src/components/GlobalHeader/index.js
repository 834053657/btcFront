import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import moment from 'moment';
import { map, groupBy } from 'lodash';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import numeral from 'numeral';
import { getMessageContent } from '../../utils/utils';
import NoticeIcon from '../NoticeIcon';
import OrderIcon from '../CustomNoticeIcon';
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
      if (newNotice.created_at) {
        newNotice.datetime = moment(notice.created_at).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      newNotice.description = getMessageContent(notice);

      // if (newNotice.extra && newNotice.status) {
      //   const color = {
      //     todo: '',
      //     processing: 'blue',
      //     urgent: 'red',
      //     doing: 'gold',
      //   }[newNotice.status];
      //   newNotice.extra = (
      //     <Tag color={color} style={{ marginRight: 0 }}>
      //       {newNotice.extra}
      //     </Tag>
      //   );
      // }
      return newNotice;
    });
    return groupBy(newNotices, item => {
      if (~[1, 11, 12, 21, 22, 31].indexOf(item.msg_type)) {
        return 'system';
      } else {
        return 'trade';
      }
    });
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
      fetchingOrders,
      isMobile,
      logo,
      onNoticeVisibleChange,
      onOrderVisibleChange,
      onMenuClick,
      onNoticeClear,
      onNoticeView,
      onLanguageChange,
      orders = [],
      noticesCount,
      local,
      onOrderClick,
      onNoticeClick,
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
      <Menu className={styles.menu} selectedKeys={[local]} onClick={onLanguageChange}>
        {map(CONFIG.language, (text, value) => <Menu.Item key={value}>{text}</Menu.Item>)}
      </Menu>
    );
    const noticeData = this.getNoticeData();
    console.log(noticeData);

    return (
      <div className={styles.header}>
        <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="32" />
          {/*<span>{CONFIG.web_name}</span>*/}
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
          <Dropdown overlay={language}>
            <b className={styles.action}>
              {local === 'zh_CN' ? CONFIG.language['zh_CN'] : CONFIG.language['en_GB']}
            </b>
          </Dropdown>
          {currentUser.token && currentUser.user ? (
            <span>
              <Link to="/wallet">
                <Icon type="wallet" style={{ fontSize: '16px', marginRight: '6px' }} />{' '}
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(wallet.amount || 0).format('0,0.00000000')} BTC`,
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
              >
                <NoticeIcon.Tab
                  list={noticeData['trade']}
                  title="交易信息"
                  emptyText="你已查看所有通知"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['system']}
                  title="系统公告"
                  emptyText="您已读完所有消息"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                />
              </NoticeIcon>
              <OrderIcon
                className={styles.action}
                title="进行中订单"
                emptyText="目前无正在进行中的订单"
                emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                list={orders}
                popupAlign={{ offset: [20, -16] }}
                loading={fetchingOrders}
                onItemClick={onOrderClick}
                onPopupVisibleChange={onOrderVisibleChange}
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
