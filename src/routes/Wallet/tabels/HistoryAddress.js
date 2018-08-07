import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Table, Tabs, Button, Icon, Card, Modal, Badge, Tooltip } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { map } from 'lodash';
import DescriptionList from 'components/DescriptionList';
import styles from './TransferList.less';

const { Description } = DescriptionList;

const statusMap = ['default', 'warning', 'processing', 'error', 'success'];

export default class TransferList extends Component {
  state = {};

  componentDidMount() {
    this.fetch();
  }

  columns = [
    {
      title: <FM id='historyAddress.created_at' defaultMessage='创建日期' />,
      dataIndex: 'created_at',
      render: (v, row) => {
        return <span>{v ? moment(v * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>;
      },
    },
    {
      title: <FM id='historyAddress.address' defaultMessage='比特币地址' />,
      dataIndex: 'address',
      render: (v, row) => {
        return <span>{v}</span>;
      },
    },
  ];

  handleTableChange = (pagination = {}, filtersArg, sorter) => {
    const params = {
      page: pagination.current,
      page_size: pagination.page_size,
      status: this.state.status,
    };

    this.fetch(params);
  };

  fetch = (params = {}) => {
    const { pagination = {} } = this.props.transfer || {};
    params.page = params.page || pagination.page;
    params.page_size = params.page_size || pagination.page_size;

    this.props.dispatch({
      type: 'wallet/fetchHistoryAddress',
      payload: params,
    });
  };

  render() {
    const { transfer = {}, historyAddressLoading } = this.props;
    const { list = [], pagination = {} } = transfer || {};

    return (
      <Table
        loading={historyAddressLoading}
        rowKey={record => record.id}
        dataSource={list}
        columns={this.columns}
        pagination={{ ...pagination, pageSize: pagination.page_size, current: pagination.page }}
        onChange={this.handleTableChange}
      />
    );
  }
}
