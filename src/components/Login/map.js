import React from 'react';
import { Input, Icon } from 'antd';
import styles from './index.less';

const map = {
  UserName: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: '',
    },
    rules: [
      {
        required: true,
        message: '请输入账户名！',
      },
    ],
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      maxLength: 16,
      placeholder: '',
    },
    rules: [
      {
        required: true,
        message: '请输入密码！',
      },
      // {
      //   min: 6,
      //   message: '密码长度为6到16位',
      // },
    ],
  },
  Mobile: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: '手机号',
    },
    rules: [
      {
        required: true,
        message: '请输入手机号！',
      },
      {
        pattern: /^1\d{10}$/,
        message: '手机号格式错误！',
      },
    ],
  },
  Captcha: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: '验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码！',
      },
    ],
  },
  ImgCaptcha: {
    component: Input,
    props: {
      size: 'large',
      maxLength: 4,
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: '图像验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码!',
      },
    ],
  },
};

export default map;
