import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip } from 'antd';
import { FormattedMessage as FM } from 'react-intl';

import moment from 'moment';
import { filter, orderBy, omit, mapValues, map, groupBy } from 'lodash';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import numeral from 'numeral';
// import { getMessageContent } from '../../utils/utils';
import getMessage from '../../utils/getMessage';
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
    const mappedNotice = filter(notices.map(item => getMessage(item)), msg => msg != null)
    const groupedByNotice = groupBy(mappedNotice, item => item.noticeType)
    let tradeNotice = groupBy(groupedByNotice.trade, item => item.group)
    tradeNotice = mapValues(tradeNotice, list => {
      return map(list, (item) => {
        const datetime = moment(item.created_at * 1000).fromNow()
        const key = item.id
        return {
          ...item,
          key,
          datetime
        }
      })
    })
    return {
      trade: tradeNotice,
      system: groupedByNotice.system
    }

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
      noticesVisible,
      local,
      onOrderClick,
      onNoticeClick,
      onViewMore,
    } = this.props;
    const { wallet } = currentUser || {};
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" /><FM id='indexHeader.personal_center_down' defaultMessage='个人中心' />
        </Menu.Item>
        <Menu.Item key="ad">
          <Icon type="code-o" /><FM id='indexHeader.personal_ad' defaultMessage='我的广告' />
        </Menu.Item>
        <Menu.Item key="order">
          <Icon type="file-text" /><FM id='indexHeader.personal_order' defaultMessage='我的订单' />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" /><FM id='indexHeader.personal_login_out' defaultMessage='退出登录' />
        </Menu.Item>
      </Menu>
    );
    const language = (
      <Menu className={styles.menu} selectedKeys={[local]} onClick={onLanguageChange}>
        {map(CONFIG.language, (text, value) => <Menu.Item key={value}>{text}</Menu.Item>)}
      </Menu>
    );
    const noticeData = this.getNoticeData();

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
                onItemClick={onNoticeClick}
                onViewMore={onViewMore}
                onPopupVisibleChange={onNoticeVisibleChange}
                popupVisible={noticesVisible}
                loading={fetchingNotices}
                popupAlign={{ offset: [20, -16] }}
              >
                <NoticeIcon.Tab
                  type="trade"
                  list={noticeData['trade']}
                  title={(PROMPT('indexHeader.deal_msg_')||'交易信息')}
                  emptyText={(PROMPT('indexHeader.personal_check_allMsg')||'你已查看所有通知')}
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                  type="system"
                  list={noticeData['system']}
                  title={(PROMPT('indexHeader.sys_notice')||'系统公告')}
                  emptyText={(PROMPT('indexHeader.personal_read_all_msg')||'您已读完所有消息')}
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                />
              </NoticeIcon>
              <OrderIcon
                className={styles.action}
                title={(PROMPT('indexHeader.personal_order_doing')||'进行中订单')}
                emptyText={(PROMPT('indexHeader.order_none')||'目前无正在进行中的订单')}
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
                <FM id='indexHeader.personal_login' defaultMessage='登录' />
              </Link>
              <Link className={styles.action} to="/user/register">
                <FM id='indexHeader.personal_sign_in' defaultMessage='注册' />
              </Link>
            </span>
          )}
        </div>
      </div>
    );
  }
}
