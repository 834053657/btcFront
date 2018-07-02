import React, { PureComponent } from 'react';
import { Popover, Icon, Tabs, Badge, Spin } from 'antd';
import classNames from 'classnames';
import List from './NoticeList';
import styles from './index.less';

const { TabPane } = Tabs;

export default class NoticeIcon extends PureComponent {
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
    onItemClick(item);
    if (item.msg_type === 1) {
      this.setState({
        visible: false,
      });
    }
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
    this.props.onPopupVisibleChange();
  };

  getNotificationBox() {
    const { list, loading, locale } = this.props;

    const contentList = (
      <List
        {...this.props}
        data={list}
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
    const { className, count, popupAlign, onPopupVisibleChange, list } = this.props;
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = this.getNotificationBox();
    const trigger = (
      <span className={noticeButtonClass}>
        <Badge count={count} className={styles.badge}>
          <Icon type="bell" className={styles.icon} />
        </Badge>
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
