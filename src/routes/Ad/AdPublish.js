import React, { Component } from 'react';
import { connect } from 'dva';
import { map } from 'lodash';
import { routerRedux } from 'dva/router';
import styles from './AdPublish.less';
import EditForm from './form/EditForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ ad, user, loading }) => ({
  price: ad.price,
  currentUser: user.currentUser,
  loading: loading.effects['ad/fetchNewPrice'],
  submitting: loading.effects['ad/postPublish'],
}))
export default class AdPublish extends Component {
  componentWillMount() {}

  componentDidMount() {
    // this.fetchPrice()
  }
  //
  // fetchPrice = (obj={}) => {
  //   this.props.dispatch({
  //     type: 'ad/fetchNewPrice',
  //     payload: {
  //       currency: obj.currency || 'CNY'
  //     }
  //   });
  // }

  handleSubmit = value => {
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
    return (
      <PageHeaderLayout title="发布广告">
        <div className={styles.background}>
          <EditForm {...this.props} onSubmit={this.handleSubmit} initialValues={{}} />
        </div>
      </PageHeaderLayout>
    );
  }
}
