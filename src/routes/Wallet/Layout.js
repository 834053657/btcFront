import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Tabs, Alert } from 'antd';
import { routerRedux, Link } from 'dva/router';
import numeral from 'numeral';
import { stringify } from 'qs';
import { findIndex } from 'lodash';
import { getQueryString } from '../../utils/utils';
import RechargeForm from './forms/RechargeForm';
import WithdrawForm from './forms/WithdrawForm';

import styles from './Layout.less';
import TransferList from './tabels/TransferList';

const { TabPane } = Tabs;

@connect(({ wallet, user, loading }) => ({
  ...wallet,
  currentUser: user.currentUser,
  transferLoading: loading.effects['wallet/fetchTransfer'],
  rechargSubmitting: loading.effects['wallet/sendRecharge'],
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
    const hadEnabledPayment = ~findIndex(payments, i => i.status === 4);
    const Warning = (
      <Alert
        message="请注意!"
        description={
          <span>
            您当前没有已认证支付账号，请前往 <Link to="/user-center/index">个人中心</Link>{' '}
            填写支付方式信息并提交审核
          </span>
        }
        type="warning"
        showIcon
      />
    );

    return (
      <Fragment>
        <div className={styles.wallet_page}>
          <Row gutter={24} className={styles.header}>
            <Col span={2} className={styles.icon}>
              <Icon style={{ fontSize: '65px' }} type="wallet" />
            </Col>
            <Col span={12} className={styles.more}>
              <h1>我的钱包</h1>
              <div>
                总资产折合：<span
                  className="text-blue"
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(wallet.amount || 0).format('0,0.00')}￥`,
                  }}
                />{' '}
                CNY | 冻结：<span
                  className="text-blue"
                  dangerouslySetInnerHTML={{
                    __html: `${numeral(wallet.frozen || 0).format('0,0.00')}￥`,
                  }}
                />{' '}
                CNY
              </div>
            </Col>
          </Row>

          <div className={styles.content}>
            <Tabs onChange={this.handleTabsChange} type="card" activeKey={activeKey}>
              <TabPane tab="充值" key="1">
                {hadEnabledPayment
                  ? activeKey === '1' && (
                  <RechargeForm
                    {...this.props}
                    onSubmit={this.handleTabsChange.bind(this, '3')}
                  />
                    )
                  : Warning}
              </TabPane>
              <TabPane tab="提现" key="2">
                {hadEnabledPayment
                  ? activeKey === '2' && (
                  <WithdrawForm
                    {...this.props}
                    onSubmit={this.handleTabsChange.bind(this, '3')}
                  />
                    )
                  : Warning}
              </TabPane>
              <TabPane tab="交易记录" key="3">
                {activeKey === '3' && <TransferList {...this.props} />}
              </TabPane>
            </Tabs>
          </div>
        </div>
      </Fragment>
    );
  }
}
