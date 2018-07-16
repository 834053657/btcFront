import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Icon, Card, Col, Row, Radio } from 'antd';
import { delay, map } from 'lodash';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AdEdit.less';
import EditForm from './form/EditForm';

const statusMap = ['warning', 'processing', 'error', 'default'];

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ ad, loading }) => ({
  initialValues: ad.adDetail,
  price: ad.price,
  loading: loading.effects['ad/fetchAdDetail'],
}))
export default class AdEdit extends Component {
  componentWillMount() {}

  componentDidMount() {
    const { params: { id } } = this.props.match || {};
    this.fetchDetail(id, this.fetchPrice);
  }

  fetchDetail = (id, callback) => {
    // console.log(id)

    const { dispatch } = this.props;
    dispatch({
      type: 'ad/fetchAdDetail',
      payload: {
        id,
      },
      callback,
    });
  };

  fetchPrice = obj => {
    this.props.dispatch({
      type: 'ad/fetchNewPrice',
      payload: {
        currency: obj.currency,
      },
    });
  };

  handleSubmit = value => {
    // console.log('下面是value');
    // console.log(value);
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/postPublish',
      payload: {
        ...value,
        trusted_user: +!!value.trusted_user,
      },
      callback: () => {
        this.props.dispatch(routerRedux.push('/ad/my'));
      },
    });
  };

  render() {
    // const { adDetail } = this.props
    // console.log(adDetail.ad_type)
    // console.log(this.props.initialValues);
    console.log(this.props);
    const content = (
      <Row gutter={24} className={styles.headers}>
        <Col span={12} className={styles.title}>
          编辑广告
        </Col>
        <Col span={12} className={styles.more}>
          <a
            className={styles.itunes_btn}
            onClick={() => this.props.dispatch(routerRedux.goBack())}
          >
            返回
          </a>
        </Col>
      </Row>
    );

    return (
      <PageHeaderLayout content={content}>
        <div className={styles.background}>
          <EditForm {...this.props} onSubmit={this.handleSubmit} />
        </div>
      </PageHeaderLayout>
    );
  }
}
