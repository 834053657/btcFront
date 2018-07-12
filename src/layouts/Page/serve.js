import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { map } from 'lodash';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './serve.less';

@connect(({ trade, loading }) => ({}))
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div className={styles.background}>
        <div style={{ textAlign: 'center' }}>
          <h2>关于我们</h2>
        </div>
        <h3>关于utomarket:</h3>
        <ul style={{ marginBottom: '50px', fontSize: '15px', fontWeight: 500 }}>
          <li>
            utomarket是由专业的国际化团队研发与运营，一家个人对个人（P2P）交易的数字虚拟货币的交易平台网站。
          </li>
          <li>
            主要面向全球用户提供方便，快捷，安全可靠的P2P服务，致力于打造成为世界级的P2P，区块链资产交易平台。
          </li>
          <li>
            在utomarket，来自不同国家的人们可以用本国货币购买到比特币。
            网站的卖家发布出售与购买比特币的广告，并设置付款方式和汇率。
            您可根据广告内容选择直接在线交易。比特币都存放在utomarket的网络钱包里，您可以直接进行比特币转账，站内转账免手续费用，并可实时到账。
          </li>
        </ul>
        <h3>我的技术：</h3>
        <ul style={{ fontSize: '15px', fontWeight: 500 }}>
          <li>
            utomarket，以Web端、PC端等多终端为我们的客户提供安全、稳定、可信的数字资交易服务。同时我们不断根据用户的建议和需求，改进和升级产品和服务，越来越好的服务每一位客户！
          </li>
        </ul>
      </div>
    );
  }
}
