import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Table, Tabs, Button, Icon, Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Message.less';

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    width: '70%',
    render: (val, row) => <Link to={`/message/info-detail/${row.id}`}>{val}</Link>,
  },
  {
    title: '发布时间',
    dataIndex: 'publish_at',
    width: '30%',
    align: 'right',
    render: val => (
      <span>{val ? moment(new Date(val * 1000)).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
    ),
  },
];

@connect(({ message, loading }) => ({
  data: message.infoData,
  loading: loading.models.message,
}))
export default class InfoList extends Component {
  constructor(props) {
    super();

    this.state = {
      selectedRows: [],
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'message/fetchInfoList',
    });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, getValue } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
      // ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'message/fetchInfoList',
      payload: params,
    });
  };

  render() {
    const { data: { list, pagination }, loading } = this.props;
    const { selectedRows } = this.state;

    const breadcrumbList = [{ title: '首页', href: '/' }, { title: '更多资讯' }];

    console.log(111, this.props);

    return (
      <PageHeaderLayout title="" breadcrumbList={breadcrumbList}>
        <div>
          <Card bordered={false} className={styles.message_list}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={columns}
              pagination={pagination}
              onChange={this.handleTableChange}
              showHeader={false}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
