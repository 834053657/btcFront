import React, { Component } from 'react';
import { Tabs, Radio } from 'antd';
import { map } from 'lodash';
import DescriptionList from 'components/DescriptionList';
import styles from './UserTransfer.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

// @connect(({ userDetails, loading }) => ({
//   ...userDetails,
//   loading: loading.models.message,
// }))
export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // visible: false,
      // type: '',
    };
  }

  componentWillMount() {}

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'userDetails/fetchDetails',
    // });
  }

  render() {
    const { list = [] } = this.props;
    const { pagination = {}, loading } = this.props;
    const { ID = [] } = this.state;

    return (
      <PageHeaderLayout title="个人资产">
        <div>123</div>
      </PageHeaderLayout>
    );
  }
}
