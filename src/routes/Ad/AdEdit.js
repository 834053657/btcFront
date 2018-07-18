import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Icon, Card, Col, Row, Radio } from 'antd';
import { delay, map } from 'lodash';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AdEdit.less';
import EditForm from './form/EditForm';

@connect(({ ad, user, loading }) => ({
  initialValues: ad.adDetail,
  price: ad.price,
  currentUser: user.currentUser,
  loading: loading.effects['ad/fetchAdDetail'],
  freshLoading: loading.effects['ad/fetchNewPrice'],
  submitting: loading.effects['ad/postPublish'],
}))
export default class AdEdit extends Component {
  componentWillMount() {}
  componentDidMount() {
    const { params: { id } } = this.props.match || {};
    this.fetchDetail(id, (obj={}) => this.fetchPrice(obj.currency));
  }

  fetchDetail = (id, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/fetchAdDetail',
      payload: {
        id,
      },
      callback,
    });
  };

  fetchPrice = (currency='CNY') => {
    this.props.dispatch({
      type: 'ad/fetchNewPrice',
      payload: {
        currency
      },
    });
  };

  handleSubmit = value => {
    const { dispatch, price } = this.props;
    const { id } = this.props.initialValues;
    const { currency } = value;

    dispatch({
      type: 'ad/postPublish',
      payload: {
        ...value,
        trusted_user: +!!value.trusted_user,
        ad_id: id,
        market_price: currency === 'CNY' ? price.ad_price_cny : price.ad_price_usd,
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
    // console.log(this.props);
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
          <EditForm {...this.props}  getPrice={this.fetchPrice}  onSubmit={this.handleSubmit} />
        </div>
      </PageHeaderLayout>
    );
  }
}
