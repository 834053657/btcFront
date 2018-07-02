import React from 'react';
import { Avatar, List, Icon, Badge } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import styles from './NoticeList.less';
import { getMessageContent } from '../../utils/utils';

export default function CustomNoticeList({
  data = [],
  onClick,
  onClear,
  onView,
  title,
  locale,
  emptyText,
  emptyImage,
}) {
  if (data.length === 0) {
    return (
      <div>
        <div className={styles.notFound}>
          {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
          <div>{emptyText || locale.emptyText}</div>
        </div>
        <div className={styles.action}>
          <div className={styles.view_more} style={{ width: '100%' }} onClick={onView}>
            <a>查看更多</a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          return (
            <List.Item className={itemCls} key={item.id || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                // avatar={item.avatar ? <Avatar className={styles.avatar} src={item.avatar} /> : null}
                title={
                  <div>
                    <div className={styles.title}>
                      {(item.msg_type === 104 || item.msg_type === 108) && item.count > 1 ? (
                        <span>
                          <Badge count={item.count} offset={[5, 20]}>
                            <Icon type="bell" /> {getMessageContent(item)}
                          </Badge>
                        </span>
                      ) : (
                        <span>
                          {item.msg_type === 1 ? <Icon type="file-text" /> : <Icon type="bell" />}{' '}
                          {getMessageContent(item)}
                        </span>
                      )}
                    </div>
                    <div className={styles.datetime}>
                      {item.created_at &&
                        moment(new Date(item.created_at * 1000)).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className={styles.action}>
        <div className={styles.clear} onClick={onClear}>
          <a>一键已读</a>
        </div>
        <div className={styles.view_more} onClick={onView}>
          <a>查看更多</a>
        </div>
      </div>
    </div>
  );
}
