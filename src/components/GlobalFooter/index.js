import React from 'react';
import { Link, routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import { map } from 'lodash';

import classNames from 'classnames';
import styles from './index.less';

const weibocontent = (
  <div>
    <img src={CONFIG.weibo} alt="" style={{ width: '80px', height: '80px' }} />
  </div>
);

const wexincontent = (
  <div>
    <img src={CONFIG.WeChat} alt="" style={{ width: '80px', height: '80px' }} />
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
        <ul className={styles.mg_left10}>
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
        <ul className={styles.mg_left10}>
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
        <ul className={styles.mg_left10}>
          <li className={styles.concat_web}>
            社交账号:
            <a href="">
              <Icon type="facebook" />
            </a>
            <Popover placement="top" trigger="hover" content={weibocontent}>
              <Icon type="weibo-circle" />
            </Popover>
            <Popover placement="top" trigger="hover" content={wexincontent}>
              <Icon type="wechat" />
            </Popover>
            <Popover placement="top" trigger="hover" content={qqcontent}>
              <Icon type="qq" />
            </Popover>
          </li>
          <li className={styles.Email}>
            <p>
              客服邮箱:{' '}
              <a style={{ color: '#ccc' }} href={`mailto:${CONFIG.Email}`}>
                {CONFIG.Email}
              </a>
            </p>
          </li>
          <li className={styles.phone}>
            <p><span>客服热线:</span> <span>187-6440-3666</span></p>
          </li>
          <li className={styles.time}><p>热线时间：每天8：00 ~ 24：00</p></li>
        </ul>
      </div>
    </div>
  );
};

export default GlobalFooter;
