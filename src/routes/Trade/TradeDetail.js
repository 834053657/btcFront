import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Button, Card, Row, Col, Modal, Form, Input, Table, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TradeDetail.less';

const FormItem = Form.Item;

const size = 'large';
const clsString = classNames(
  styles.detail,
  'horizontal',
  {},
  {
    [styles.small]: size === 'small',
    [styles.large]: size === 'large',
  }
);

@connect(({ trade, loading }) => ({
  ...trade.detail,
  loading: loading.effects['trade/fetchDetail'],
}))
@Form.create()
export default class TradeDetail extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'message/fetchInfoDetail',
      payload: { id: this.props.match.params.id },
      // callback: () => this.readMsg(this.props.match.params.id),
    });
  }

  readMsg = id => {
    const { dispatch } = this.props;

    dispatch({
      type: 'message/readMessage',
      payload: { all: false, id },
    });
  };

  render() {
    const { loading, data } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const breadcrumbList = [
      { title: '首页', href: '/' },
      { title: '购买'},
    ];

    return (
      <PageHeaderLayout className="ant-layout-content" breadcrumbList={breadcrumbList}>
        <div className={styles.page}>
          <Row gutter={24}>
            <Col span={12} className={styles.left}>
              交易条款管理
            </Col>
            <Col span={12} className={styles.right}>
              交易条款管理
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}
