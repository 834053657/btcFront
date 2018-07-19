import { AuthStep } from 'components/Authentication';
import React, { Component } from 'react';
import { Row, Col, Form, Select, Input, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AuthenticationPage.less';
import C1Stage from './C1Stage';

@connect(({ authentication }) => ({
  authentication,
}))
export default class AuthenticationPage extends Component {
  static state = {};
  render() {
    const breadcrumbList = [
      { title: '个人中心', href: '/user-center/index' },
      { title: '身份认证' },
    ];
    return (
      <PageHeaderLayout className="ant-layout-content" breadcrumbList={breadcrumbList}>
        <div className={styles.page}>
          <Row>
            <Col offset={2} span={20}>
              <AuthStep size="default" />
            </Col>
          </Row>
          <br />
          {[<C1Stage />][this.props.authentication.stage]}
        </div>
      </PageHeaderLayout>
    );
  }
}
