import React, { Component } from 'react';
import { connect } from 'dva';
import { map } from 'lodash';
import { Alert } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './AdPublish.less';
import EditForm from './form/EditForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ ad, user, loading }) => ({
  num: ad.remains,
  price: ad.price,
  currentUser: user.currentUser,
  loading: loading.effects['ad/fetchNewPrice'],
  submitting: loading.effects['ad/postPublish'],
}))
export default class AdPublish extends Component {
  componentWillMount() {}

  componentDidMount() {
    this.fetchPrice();
    this.fetchRemain();
  }

  fetchPrice = (obj = {}) => {
    this.props.dispatch({
      type: 'ad/fetchNewPrice',
      payload: {
        currency: obj.currency || 'CNY',
      },
    });
  };

  fetchRemain = () => {
    this.props.dispatch({
      type: 'ad/fetchUserRemain',
    });
  };

  handleSubmit = value => {
    const { dispatch, price } = this.props;
    const { currency } = value;
    // console.log(value)
    dispatch({
      type: 'ad/postPublish',
      payload: {
        ...value,
        market_price: currency === 'CNY' ? price.ad_price_cny : price.ad_price_usd,
        trusted_user: +!!value.trusted_user,
      },
      callback: () => {
        this.props.dispatch(routerRedux.push('/ad/my'));
      },
    });
  };

  render() {
    const { num } = this.props;
    return (
      <PageHeaderLayout title="发布广告">
        <div className={styles.background}>
          <div style={{ paddingLeft: '20px', width: '640px', marginBottom: '30px' }}>
            <Alert
              message={`您最多可以创建 ${num} 条交易广告，在您创建广告的时候，请您创建适合您需求的广告条数.`}
              type="info"
              showIcon
            />
          </div>
          <EditForm {...this.props} getPrice={this.fetchPrice}  onSubmit={this.handleSubmit} initialValues={{}} />
        </div>
      </PageHeaderLayout>
    );
  }
}
