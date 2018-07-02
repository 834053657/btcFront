import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from 'components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large" type="primary">
        去登录
      </Button>
    </Link>
    <Link to="/">
      <Button size="large">返回首页</Button>
    </Link>
  </div>
);

export default ({ location }) => {
  return (
    <Result
      className={styles.registerResult}
      type="success"
      title={<div className={styles.title}>密码修改成功</div>}
      actions={actions}
      style={{ marginTop: 56 }}
    />
  );
};
