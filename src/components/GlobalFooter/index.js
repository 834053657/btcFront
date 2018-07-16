import React from 'react';
import { Link, routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import { map } from 'lodash';

import classNames from 'classnames';
import styles from './index.less';

const weibocontent = (
  <div>
    <img src={CONFIG.weibo[1]} alt="" style={{ width: '80px', height: '80px' }} />
  </div>
);

const wexincontent = (
  <div>
    <img src={CONFIG.WeChat[1]} alt="" style={{ width: '80px', height: '80px' }} />
  </div>
);

const qqcontent = (
  <div className={styles.kefu}>
    {map(CONFIG.QQ_link, (text1, values) =>
      map(
        CONFIG.QQ,
        (text, value) =>
          value === values ? (
            <a target="_blank" key={value} href={text1}>
              {text}
            </a>
          ) : null
      )
    )}
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
            <a href="">
              <Icon type="facebook" style={{ margin: '10px', fontSize: 20 }} />
            </a>
            <Popover placement="top" trigger="hover" content={weibocontent}>
              <Icon type="weibo-circle" style={{ margin: '10px', fontSize: 20 }} />
            </Popover>
            <Popover placement="top" trigger="hover" content={wexincontent}>
              <Icon type="wechat" style={{ margin: '10px', fontSize: 20 }} />
            </Popover>
            <Popover placement="top" trigger="hover" content={qqcontent}>
              <Icon type="qq" style={{ margin: '10px', fontSize: 20 }} />
            </Popover>
          </li>
          <li className={styles.Email}>
            客服邮箱:{' '}
            <a style={{ color: '#ccc' }} href={CONFIG.Email[1]}>
              {CONFIG.Email[1]}
            </a>
          </li>
          <li className={styles.phone}>
            客服热线: <span>400-099-2347</span>
          </li>
          <li className={styles.time}>热线时间：每天8：00——24：00</li>
        </ul>
      </div>
    </div>
  );
};

export default GlobalFooter;
