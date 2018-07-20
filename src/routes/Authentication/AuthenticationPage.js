import { AuthStep } from 'components/Authentication';
import React, { Component } from 'react';
import { Row, Col, Form, Select, Input, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AuthenticationPage.less';
import C1Step from './C1Step';

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
              <AuthStep size="default" step={this.props.authentication.step} />
            </Col>
          </Row>
          <br />
          {[<C1Step />][this.props.authentication.step]}
        </div>
      </PageHeaderLayout>
    );
  }
}
