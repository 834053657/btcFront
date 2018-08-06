import React, { PureComponent } from 'react';
import { Popover, Icon, Tabs, Badge, Spin } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import classNames from 'classnames';
import { size, flatMap } from 'lodash'
import List from './NoticeList';
import styles from './index.less';

const { TabPane } = Tabs;

export default class NoticeIcon extends PureComponent {
  static defaultProps = {
    onItemClick: () => {},
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    onViewMore: () => {},
    onClear: () => {},
    loading: false,
    locale: {
      emptyText: (PROMPT('noticeIcon.no_msg')||'暂无数据'),
      clear: (PROMPT('noticeIcon.clear_msg')||'清空'),
    },
    emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
    popupVisible: false,
  };
  static Tab = TabPane;
  constructor(props) {
    super(props);
    this.state = {};
    if (props.children && props.children[0]) {
      this.state.tabType = props.children[0].props.title;
    }
  }
  onItemClick = (item, tabProps) => {
    const { onItemClick } = this.props;
    onItemClick(item, tabProps);
  };
  onTabChange = tabType => {
    this.setState({ tabType });
    this.props.onTabChange(tabType);
  };
  getNotificationBox() {
    const { children, loading, locale } = this.props;
    if (!children) {
      return null;
    }

    const panes = React.Children.map(children, child => {
      const len = child.props.list instanceof Array ? child.props.list.length : size(flatMap(child.props.list))
      const title =
        child.props.list && len
          ? `${child.props.title} (${len})`
          : child.props.title;
      const footer = [
        <div
          key="clear"
          className={styles.clear}
          onClick={() => this.props.onClear(child.props.title)}
        >
          <a><FM id='noticeIcon.Clear_msg' defaultMessage='清空' />{child.props.title}</a>
        </div>,
        <div
          key="view_more"
          className={styles.view_more}
          onClick={() => this.props.onViewMore(child.props.type)}
        >
          <a><FM id='noticeIcon.check_more' defaultMessage='查看更多' /></a>
        </div>,
      ];
      return (
        <TabPane tab={title} key={child.props.title}>
          <List
            {...child.props}
            data={child.props.list}
            onClick={item => this.onItemClick(item, child.props)}
            // onClear={() => this.props.onClear(child.props.title)}
            // title={child.props.title}
            locale={locale}
            footer={footer}
          />
        </TabPane>
      );
    });
    return (
      <Spin spinning={loading} delay={0}>
        <Tabs className={styles.tabs} onChange={this.onTabChange}>
          {panes}
        </Tabs>
      </Spin>
    );
  }

  render() {
    const { className, count, popupAlign, onPopupVisibleChange, popupVisible } = this.props;
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
    return (
      <Popover
        placement="bottomRight"
        content={notificationBox}
        popupClassName={styles.popover}
        trigger="click"
        arrowPointAtCenter
        popupAlign={popupAlign}
        onVisibleChange={onPopupVisibleChange}
        visible={popupVisible}
      >
        {trigger}
      </Popover>
    );
  }
}
