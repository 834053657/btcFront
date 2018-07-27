import React from 'react';
import { Collapse, Badge, Icon, Avatar, List } from 'antd';
import { flatMap, uniqueId, map, size, truncate } from 'lodash'
import classNames from 'classnames';
import styles from './NoticeList.less';

const Panel = Collapse.Panel; 

export default function NoticeList({
  data = [],
  onClick,
  onClear,
  locale,
  emptyText,
  emptyImage,
  footer,
}) {
  const NoNotice = (
    <div className={styles.notFound}>
      {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
      <div>{emptyText || locale.emptyText}</div>
    </div>
  )
  const ExpandList = ({list}) => {
    return (
      <List className={styles.list}>
        {list.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          const description = truncate(item.description, { length: '30' })
          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                avatar={
                  item.avatar ? <Avatar className={styles.avatar} src={item.avatar} /> : null
                }
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description} title={description}>
                      {description}
                    </div>
                    <div className={styles.datetime}>{item.datetime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
    ) 
  }
  return (
    <div>
      { size(data) === 0 || size(flatMap(data)) === 0 ? NoNotice : (
        data instanceof Array ? (<ExpandList list={data} />): map(data, (list, group) => (
          group !== 'other' && list.length > 1 ? (
            <Collapse 
              className={styles.collapseBar} 
              bordered={false}
              key={group}
            > 
              <Panel
                className={styles.collapseItem}
                header={(
                  <span>{group} <Badge count={list.length} className={styles.badge} /></span>
                )}
              >
                <ExpandList list={list} />
              </Panel>
            </Collapse>
          ) : (
            <ExpandList list={list} key={group === 'other' ? uniqueId('other_') : group} />
          )
        ))
      )}
      <div className={styles.action}>{footer}</div>
    </div>
  );
}