import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Row, Col, Badge, Form, Input, Steps, Icon } from 'antd';


import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Step1 from './boxs/Step1.js';
import IM from './boxs/IM.js';
import styles from './TradeStep.less';

const { Step } = Steps;

@connect(({ trade, loading }) => ({
  ...trade.detail,
  submitting: loading.effects['trade/fetchDetail'],
}))
export default class TradeStep extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'message/fetchInfoDetail',
      payload: { id: this.props.match.params.id },
      // callback: () => this.readMsg(this.props.match.params.id),
    });
  }

  getCurrentStep() {
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

  render() {
    const { submitting } = this.props;
    const { match, routerData, location } = this.props;
    const breadcrumbList = [
      { title: '首页', href: '/' },
      { title: '订单号: 100000'},
    ];

    return (
      <PageHeaderLayout className="ant-layout-content" breadcrumbList={breadcrumbList}>
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="填写转账信息" />
              <Step title="确认转账信息" />
              <Step title="完成" />
            </Steps>
            <div className={styles.page}>
              <Row gutter={24}>
                <Col span={10} className={styles.left}>
                  <Step1 />
                </Col>
                <Col span={14} className={styles.right}>
                  <IM />
                </Col>
              </Row>
            </div>

          </Fragment>
        </Card>
      </PageHeaderLayout>
    );
  }
}
