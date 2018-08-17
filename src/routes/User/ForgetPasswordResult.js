import React, { Component } from 'react';
import { Button } from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import { Link } from 'dva/router';
import Result from 'components/Result';
import styles from './RegisterResult.less';

const msg = defineMessages({
  Go_back: {
    id: 'ForgetPasswordResult.Go_back',
    defaultMessage: '返回首页',
  },

  send_success: {
    id: 'ForgetPasswordResult.send_success',
    defaultMessage: '重置密码邮件发送成功',
  },

  description: {
    id: 'ForgetPasswordResult.description',
    defaultMessage: '重置邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接重置密码。',
  },
});
@injectIntl()

export default class ForgetPasswordResult extends Component{
  render(){
    const actions = (
      <div className={styles.actions}>
        <Link to="/">
          <Button size="large">{this.props.intl.formatMessage(msg.Go_back)}</Button>
        </Link>
      </div>
    );
    return(
      <Result
        className={styles.registerResult}
        type="success"
        title={<div className={styles.title}>{this.props.intl.formatMessage(msg.send_success)}</div>}
        description={this.props.intl.formatMessage(msg.description)}
        actions={actions}
        style={{ marginTop: 56 }}
      />
    );
  }
}


