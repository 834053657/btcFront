import { AuthStep } from 'components/Authentication';
import Result from 'components/Result';
import React, { Component } from 'react';
import { Alert, Row, Col, Form, Select, Input, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AuthenticationPage.less';
import C1Step from './C1Step';
import C2Step from './C2Step';
import C3Step from './C3Step';

@connect(({ authentication }) => ({
  authentication,
}))
export default class AuthenticationPage extends Component {
  render() {
    const breadcrumbList = [
      { title: '个人中心', href: '/user-center/index' },
      { title: '身份认证' },
    ];
    const { reason, status, step } = this.props.authentication;
    return (
      <PageHeaderLayout className="ant-layout-content" breadcrumbList={breadcrumbList}>
        <div className={styles.page}>
          <Row>
            <Col offset={4} span={16}>
              <AuthStep size="default" status={status} step={step} />
            </Col>
          </Row>
          <br />
          <Row>
            <Col offset={4} span={16}>
              {status === 3 && reason ? (
                <Alert message={reason} type="error" showIcon />
              ) : (
                <Alert
                  message="为了您的资金安全，需验证您的身份才可以进行交易认证，信息一经常验证不能修改，请务必如实填写"
                  type="info"
                  showIcon
                />
              )}
            </Col>
          </Row>
          <br />
          <Row>
            <Col offset={4} span={16}>
              {(step >= 2 && status === 4 ) ? (
                <Result
                  type="success"
                  title="您已经完成了所有认证"
                  style={{ marginTop: 56 }}
                />) : ([<C1Step />, <C2Step />, <C3Step />][step])}
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}
