import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Tabs, message, Popover } from 'antd';
import { routerRedux, Link } from 'dva/router';
import numeral from 'numeral';
import { stringify } from 'qs';
import { findIndex } from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getQueryString } from '../../utils/utils';
import RechargeForm from './forms/RechargeForm';
import WithdrawForm from './forms/WithdrawForm';
import styles from './Layout.less';
import TransferList from './tabels/TransferList';
import HistoryAddress from './tabels/HistoryAddress';

const jrQrcode = require('jr-qrcode');

const { TabPane } = Tabs;

@connect(({ wallet, user, loading }) => ({
  ...wallet,
  currentUser: user.currentUser,
  transferLoading: loading.effects['wallet/fetchTransfer'],
  historyAddressLoading: loading.effects['wallet/fetchHistoryAddress'],
  rechargSubmitting: loading.effects['wallet/sendRecharge'],
  feeLoading: loading.effects['wallet/fetchFee'],
}))
export default class Layout extends Component {
  state = {};
  constructor(props) {
    super(props);
    const { search } = props.location;
    const { activeKey = '1' } = getQueryString(search);
    this.state = {
      activeKey,
    };
  }

  componentDidMount() {}

  handleTabsChange = activeKey => {
    this.setState({
      activeKey,
    });
    this.props.dispatch(
      routerRedux.replace({
        search: stringify({ activeKey }),
      })
    );
  };

  render() {
    const { activeKey } = this.state;
    const { wallet = {}, payments = [] } = this.props.currentUser || {};
    const copy = (
      <CopyToClipboard text={wallet.btc_address} onCopy={() => message.success('复制成功')}>
        <a>
          <Icon style={{ fontSize: 18 }} type="copy" />
        </a>
      </CopyToClipboard>
    );
    const qrcode = (
      <Popover
        content={
          <img
            className={styles.qrcode}
            src={jrQrcode.getQrBase64(wallet.btc_address)}
            alt="比特币地址"
          />
        }
        placement="bottom"
        trigger="hover"
      >
        <a>
          <Icon className="text-blue" style={{ fontSize: 18 }} type="qrcode" />
        </a>
      </Popover>
    );
    // const hadEnabledPayment = ~findIndex(payments, i => i.status === 4);
    // const Warning = (
    //   <Alert
    //     message="请注意!"
    //     description={
    //       <span>
    //         您当前没有已认证支付账号，请前往 <Link to="/user-center/index">个人中心</Link>{' '}
    //         填写支付方式信息并提交审核
    //       </span>
    //     }
    //     type="warning"
    //     showIcon
    //   />
    // );

    return (
      <Fragment>
        <div className={styles.wallet_page}>
          <Row gutter={24} className={styles.header}>
            <Col span={2} className={styles.icon}>
              <Icon style={{ fontSize: '65px' }} type="wallet" />
            </Col>
            <Col span={12} className={styles.more}>
              <h1>我的钱包</h1>
              <p>
                总资产折合：<span
                  className="text-blue"
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(wallet.amount || 0).format('0,0.00')} BTC`,
                  }}
                />{' '}
                | 冻结：<span
                  className="text-blue"
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(wallet.frozen || 0).format('0,0.00')} BTC`,
                  }}
                />{' '}
              </p>
              <p>我的比特币地址: {qrcode}</p>
              <p>
                <span>{wallet.btc_address}</span> {copy}
              </p>
            </Col>
          </Row>

          <div className={styles.content}>
            <Tabs onChange={this.handleTabsChange} type="card" activeKey={activeKey}>
              <TabPane tab="发送比特币" key="1">
                {activeKey === '1' && (
                  <RechargeForm {...this.props} onSubmit={this.handleTabsChange.bind(this, '2')} />
                )}
              </TabPane>
              <TabPane tab="交易记录" key="2">
                {activeKey === '2' && <TransferList {...this.props} />}
              </TabPane>
              <TabPane tab="历史比特币地址" key="3">
                {activeKey === '3' && <HistoryAddress {...this.props} />}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Fragment>
    );
  }
}
