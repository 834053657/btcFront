import React from 'react';
import { Avatar, List, Icon, Badge } from 'antd';
import classNames from 'classnames';
import { formatBTC } from '../../utils/utils';
import styles from './NoticeList.less';

export default function CustomNoticeList({
  data = [],
  onClick,
  onClear,
  onView,
  title,
  locale,
  emptyText,
  header,
  emptyImage,
}) {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list} header={header}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                // avatar={item.avatar ? <Avatar className={styles.avatar} src={item.avatar} /> : null}
                title={
                  <div className={styles.title}>
                    <span>订单编号: {item.order_no}</span>
                    <div className={styles.extra}>{CONFIG.order_status[item.status]}</div>
                  </div>
                }
                description={
                  <div>
                    <span className={styles.description} title={item.description}>
                      <span className={styles.des_num}>交易数额:</span>
                      {formatBTC(item.trading_count)}
                      <span className={styles.des_btc}>BTC</span>
                    </span>
                    <span className={styles.datetime}>
                      {<span className={styles.news}>新消息:</span>}
                      {item.message_count || 0}
                    </span>
                  </div>
                }
              />
              <span>{<Icon type="right" />}</span>
            </List.Item>
          );
        })}
      </List>
    </div>
  );
}
