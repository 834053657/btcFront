import React from 'react';
import { Link, routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const GlobalFooter = ({ className }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      <div className={styles.about}>
        <div className={styles.title}>关于我们</div>
        <ul>
          <li className={styles.pages}>
            <Link to="/article/about">团队介绍</Link>
          </li>
          <li className={styles.pages}>
            <Link to="/article/agreement">服务条款</Link>
          </li>
          <li className={styles.pages}>
            <Link to="/article/duty">免责声明</Link>
          </li>
          <li className={styles.pages}>
            <Link to="/article/privacy">隐私保护</Link>
          </li>
          <li className={styles.pages}>
            <Link to="/article/fee">费率说明</Link>
          </li>
        </ul>
      </div>
      <div className={styles.help}>
        <div className={styles.title}>帮助教程</div>
        <ul>
          <li className={styles.pages}>
            <Link to="/article/course">新手教程</Link>
          </li>
          <li className={styles.pages}>
            <Link to="/article/problem">常见问题</Link>
          </li>
          <li className={styles.pages}>
            <Link to="/article/operate">操作指南</Link>
          </li>
          <li className={styles.pages}>
            <Link to="/article/safe">安全指南</Link>
          </li>
        </ul>
      </div>
      <div className={styles.relation}>
        <div className={styles.title}>联系我们</div>
        <ul>
          <li className={styles.pages}>
            社交账号:
            <Icon type="facebook" style={{ margin: '10px' }} />
            <Popover placement="top" trigger="hover" content={content}>
              <Icon type="weibo-square" style={{ margin: '10px' }} />
            </Popover>
            <Popover placement="top" trigger="hover" content={content}>
              <Icon type="wechat" style={{ margin: '10px' }} />
            </Popover>
            <Popover placement="top" trigger="hover" content={content}>
              <Icon type="qq" style={{ margin: '10px' }} />
            </Popover>
          </li>
          <li style={{ margin: '15px 0' }}>
            客服邮箱: <span>kefu@paean.net</span>
          </li>
          <li style={{ margin: '15px 0 0' }}>
            客服热线: <span>400-099-2347</span>
          </li>
          <li className={styles.time}>热线时间：每天8：00——24：00</li>
        </ul>
      </div>
    </div>
  );
};

export default GlobalFooter;
