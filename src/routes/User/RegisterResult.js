import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from 'components/Result';
import { getQueryString } from '../../utils/utils';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/">
      <Button size="large">返回首页</Button>
    </Link>
  </div>
);

export default ({ location }) => {
  const { account = '' } = getQueryString(location.search);
  return (
    <Result
      className={styles.registerResult}
      type="success"
      title={<div className={styles.title}>你的账户：{account} 注册成功</div>}
      // description="激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。"
      actions={actions}
      style={{ marginTop: 56 }}
    />
  );
};
