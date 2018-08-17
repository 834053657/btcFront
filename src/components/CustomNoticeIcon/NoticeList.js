import React, { PureComponent } from 'react';
import { Avatar, List, Icon, Badge } from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import classNames from 'classnames';
import { formatBTC } from '../../utils/utils';
import styles from './NoticeList.less';


const msg = defineMessages({
  order_num: {
    id: 'noticeList.order_num',
    defaultMessage: '订单编号:',
  },
  deal_num: {
    id: 'noticeList.deal_num',
    defaultMessage: '交易数额:',
  },
  new_msg: {
    id: 'noticeList.new_msg',
    defaultMessage: '新消息:',
  },
});
@injectIntl()
export default class NoticeList extends PureComponent{
  render(){
    const { data = [], onClick, onClear, onView, title, locale, emptyText, header, emptyImage, } = this.props;
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
                      <span>{this.props.intl.formatMessage(msg.order_num)} {item.order_no}</span>
                      <div className={styles.extra}>{CONFIG.order_status[item.status]}</div>
                    </div>
                  }
                  description={
                    <div>
                      <span className={styles.description} title={item.description}>
                        <span className={styles.des_num}>{this.props.intl.formatMessage(msg.deal_num)}</span>
                        {formatBTC(item.trading_count)}
                        <span className={styles.des_btc}>BTC</span>
                      </span>
                      <span className={styles.datetime}>
                        {<span className={styles.news}>{this.props.intl.formatMessage(msg.new_msg)}</span>}
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
}

