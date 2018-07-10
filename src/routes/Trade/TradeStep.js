import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Row, Col, Badge, Form, Input, Steps, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Step1 from './boxs/Step1.js';
import IM from './boxs/IM.js';
import styles from './TradeStep.less';

const { Step } = Steps;


@connect(({ trade, loading }) => ({
  orderDetail: trade.orderDetail,
  submitting: loading.effects['trade/fetchOrderDetail'],
}))
export default class TradeStep extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch, match: { params = {} } } = this.props;

    dispatch({
      type: 'trade/fetchOrderDetail',
      payload: { id: params.id }
    });
  }

  getCurrentStep = () => {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info':
        return 0;
      case 'confirm':
        return 1;
      case 'result':
        return 2;
      default:
        return 0;
    }
  }

  renderStep = (orderDetail) => {
    const { ad={}, order={} } = orderDetail || {};

    if(ad.ad_type === 1) {// 买入

    }else { // 出售

    }



  }

  render() {
    const { orderDetail, match: { params = {} } } = this.props;
    const { ad={}, order={} } = orderDetail || {};
    const breadcrumbList = [
      { title: '首页', href: '/' },
      { title: '订单号: ' + params.id},
    ];

    return (
      <PageHeaderLayout className="ant-layout-content" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Steps current={this.getCurrentStep()} className={styles.steps}>
            <Step title="填写转账信息" />
            <Step title="确认转账信息" />
            <Step title="完成" />
          </Steps>
          <div className={styles.page}>
            <Row gutter={24}>
              <Col span={10} className={styles.left}>
                <Step1 {...this.props} />
              </Col>
              <Col span={14} className={styles.right}>
                {/*<IM />*/}
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
