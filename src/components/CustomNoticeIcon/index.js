import React, { PureComponent } from 'react';
import { Popover, Icon, Tabs, Badge, Spin } from 'antd';
import classNames from 'classnames';
import List from './NoticeList';
import styles from './index.less';

const { TabPane } = Tabs;

export default class CustomNoticeIcon extends PureComponent {
  static defaultProps = {
    // onItemClick: () => {},
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    onClear: () => {},
    loading: false,
    locale: {
      emptyText: '暂无数据',
      clear: '清空',
    },
    emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
  };
  static Tab = TabPane;
  constructor(props) {
    super(props);
    this.state = {
      // visible: true,
    };
    if (props.children && props.children[0]) {
      this.state.tabType = props.children[0].props.title;
    }
  }

  onItemClick = item => {
    const { onItemClick } = this.props;
    this.setState({
      visible: false,
    });
    onItemClick(item);
  };
  onTabChange = tabType => {
    this.setState({ tabType });
    this.props.onTabChange(tabType);
  };

  onViewMore = () => {
    this.props.onView();
    this.hidePopup = true;
    this.setState({
      visible: false,
    });
  };

  onPopupVisibleChange = visible => {
    this.setState({
      visible,
    });
    this.props.onPopupVisibleChange(visible);
  };

  getNotificationBox() {
    const { list, loading, locale, title } = this.props;
    const title_count = list.length > 0 ? `${title} (${list.length})` : title;
    const contentList = (
      <List
        {...this.props}
        data={list}
        header={
          <span className="text-blue" style={{ paddingLeft: 15 }}>
            {title_count}
          </span>
        }
        onClick={item => this.onItemClick(item)}
        onClear={() => this.props.onClear(this.props.title)}
        onView={this.onViewMore}
        title={this.props.title}
        locale={locale}
      />
    );

    return (
      <Spin spinning={loading} delay={0}>
        {contentList}
      </Spin>
    );
  }

  render() {
    const { className, count, popupAlign, list } = this.props;
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = this.getNotificationBox();
    const trigger = (
      <span className={noticeButtonClass}>
        {/*<Badge count={count} className={styles.badge}>*/}
        <Icon type="profile" className={styles.icon} />
        {/*</Badge>*/}
      </span>
    );
    if (!notificationBox) {
      return trigger;
    }
    const popoverProps = {};
    if ('popupVisible' in this.props) {
      popoverProps.visible = this.props.popupVisible;
    }

    popoverProps.visible = this.state.visible;

    return (
      <Popover
        placement="bottomRight"
        content={notificationBox}
        popupClassName={styles.popover}
        trigger="click"
        arrowPointAtCenter
        popupAlign={popupAlign}
        onVisibleChange={this.onPopupVisibleChange}
        {...popoverProps}
      >
        {trigger}
      </Popover>
    );
  }
}
