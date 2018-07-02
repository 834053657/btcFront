import React, { Component } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Button, Card, Row, Col, Input, Checkbox } from 'antd';
import G2ValidateForm from './forms/G2ValidateForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './G2ValidatePage.less';

@connect(({ user, loading }) => ({
  data: user.g2Info,
  loading: loading.models.message,
}))
export default class G2ValidatePage extends Component {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/fetchG2Info',
      payload: {},
      callback: () => this.readMsg(this.props.match.params.id),
    });
  }

  handleBack = () => {
    this.props.dispatch(routerRedux.push('/user-center/index'));
  };

  handleSubmit = (err, { captcha }) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submitChangeG2Validate',
        payload: {
          code: captcha,
          enable: true,
        },
        callback: this.handleBack,
      });
    }
  };

  render() {
    const { data = {} } = this.props;
    const breadcrumbList = [
      { title: '个人中心', href: '/user-center/index' },
      { title: '双重身份认证' },
    ];

    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumbList}>
        <div className={classNames(styles.detail, 'horizontal')}>
          <Card title="开启谷歌双重身份验证">
            <G2ValidateForm data={data} onCancel={this.handleBack} onSubmit={this.handleSubmit} />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
