import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Icon, Card, Button, Alert, Radio } from 'antd';
import { delay, map } from 'lodash';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AdEdit.less';
import EditForm from './form/EditForm';

const statusMap = ['warning', 'processing', 'error', 'default'];

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ adEdit, loading }) => ({
  ...adEdit,
  loading: loading.models.ad,
}))
export default class List extends Component {
  componentWillMount() {}

  componentDidMount() {
    const { dispatch } = this.props;
    const { params: { id } } = this.props.match || {};

    dispatch({
      type: 'ad/fetchAdDetail',
      payload: {
        id,
      },
    });
  }
  // handleTypeChange = e => {
  //   const type = e.target.value;
  //   this.setState({
  //     type,
  //   });
  // };

  handleSubmit = value => {
    // console.log('下面是value');
    // console.log(value);
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'publish/PostPublish',
    //   payload: {
    //     ...value,
    //     trusted_user: +!!value.trusted_user,
    //     ad_type: this.state.type,
    //   },
    //   // callback: () => {
    //   //   this.props.forms.resetFields();
    //   // },
    // });
  };

  render() {
    const { type } = this.props;

    console.log('以下type');
    console.log(type);

    return (
      <PageHeaderLayout title="编辑广告">
        <div className={styles.background}>
          <EditForm formType={type} onSubmit={this.handleSubmit} {...this.props} />
        </div>
      </PageHeaderLayout>
    );
  }
}
