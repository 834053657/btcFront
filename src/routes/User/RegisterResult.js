import React, { Component } from 'react';
import { Button } from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import { Link } from 'dva/router';
import Result from 'components/Result';
import { getQueryString } from '../../utils/utils';
import styles from './RegisterResult.less';


const msg = defineMessages({
  title_success: {
    id: 'RegisterResult.title_success',
    defaultMessage: '你的账户：{accounts} 注册成功',
  },
  Go_back: {
    id: 'RegisterResult.Go_back',
    defaultMessage: '返回首页',
  },
});
@injectIntl()

export default class RegisterResult extends Component{
  render(){
    const { account = '' } = getQueryString(location.search);
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
        title={<div className={styles.title}>{this.props.intl.formatMessage(msg.title_success,{accounts:account})}</div>}
        // description="激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。"
        actions={actions}
        style={{ marginTop: 56 }}
      />
    );
  }
}


