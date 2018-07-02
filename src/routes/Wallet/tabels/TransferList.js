import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import { Table, Tabs, Button, Icon, Card, Modal, Badge, Tooltip } from 'antd';
import numeral from 'numeral';

import DescriptionList from 'components/DescriptionList';
import styles from './TransferList.less';

const { Description } = DescriptionList;

const statusMap = ['default', 'processing', 'error', 'success'];

export default class TransferList extends Component {
  constructor(props) {
    super();
    this.state = {
      modalInfo: null,
    };
  }

  componentDidMount() {
    this.handleTableChange();
  }

  showModal = row => {
    this.setState({
      modalInfo: row,
    });
  };

  hideModal = () => {
    this.setState({
      modalInfo: null,
    });
  };

  columns = [
    {
      title: '交易时间',
      dataIndex: 'created_at',
      render: (v, row) => {
        return <span>{v ? moment(v * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>;
      },
    },
    {
      title: '产品类型',
      dataIndex: 'goods_type',
      render: (v, row) => {
        return <span>{v ? CONFIG.goods_type[v] : '无'}</span>;
      },
    },
    {
      title: '支付方式',
      dataIndex: 'paid_type',
      render: (v, row) => {
        return <span>{v ? CONFIG.payments[v] : '无'}</span>;
      },
    },
    {
      title: '交易类型',
      dataIndex: 'trade_type',
      render: (v, row) => {
        return <span>{v ? CONFIG.tradeType[v] : '无'}</span>;
      },
    },
    {
      title: '金额',
      dataIndex: 'amount',
      render: (v, row) => {
        return (
          <span className={row.type === 1 ? 'text-green' : 'text-red'}>
            <b>{row.type === 1 ? '+' : '-'}</b> {numeral(v).format('0,0.00')}
          </span>
        );
      },
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      render: (v, row) => {
        return <span>{`￥${numeral(v).format('0,0.00')}`}</span>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val, row) => {
        if (val === 3) {
          return (
            <span>
              <Badge status={statusMap[2]} text={CONFIG.transaction_status[val]} />
              <Tooltip title={row.reason}>
                <a> 原因 </a>
              </Tooltip>
            </span>
          );
        } else {
          return (
            <Badge status={statusMap[val - 1]} text={val ? CONFIG.transaction_status[val] : '-'} />
          );
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'opt_',
      render: (v, row) => {
        return (
          <Fragment>
            <a onClick={this.showModal.bind(this, row)}>详情</a>
          </Fragment>
        );
      },
    },
  ];

  handleTableChange = (pagination = {}, filtersArg, sorter) => {
    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
    };

    this.props.dispatch({
      type: 'wallet/fetchTransfer',
      payload: params,
    });
  };

  getMethodContent = item => {
    const { paid_type, payment = {} } = item || {};
    let content = '';

    switch (paid_type) {
      case 'wechat':
      case 'alipay':
        content = (
          <div>
            {CONFIG.payments[paid_type] || '无效的支付方式'} - {payment.account}
          </div>
        );
        break;
      case 'bank':
        content = (
          <div>
            {CONFIG.payments[paid_type] || '无效的支付方式'} - {payment.bank_account}
          </div>
        );
        break;
    }
    return content;
  };

  renderDetail = modalInfo => {
    const { created_at, amount, fee, goods_type, trade_type, payment, type } = modalInfo || {};
    return (
      <DescriptionList col={1} className={styles.detailBox}>
        <Description term="产品类型">
          {goods_type ? CONFIG.goods_type[goods_type] : '无'}
        </Description>
        <Description term="交易类型">
          {trade_type ? CONFIG.tradeType[trade_type] : '无'}
        </Description>
        <Description term="账号">{this.getMethodContent(modalInfo)}</Description>
        <Description term="金额">
          <span>{`¥ ${type === 1 ? '+' : '-'}${numeral(amount).format('0,0.00')}`}</span>
        </Description>
        <Description term="手续费">
          <span>{`¥ ${numeral(fee).format('0,0.00')}`}</span>
        </Description>
        <Description term="交易时间">
          {created_at ? moment(created_at * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Description>
      </DescriptionList>
    );
  };

  render() {
    const { modalInfo } = this.state;
    const { transfer = {}, transferLoading } = this.props;
    const { list = [], pagination = {} } = transfer || {};

    return (
      <Card bordered={false} className={styles.message_list}>
        <Table
          loading={transferLoading}
          rowKey={record => record.id}
          dataSource={list}
          columns={this.columns}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
        <Modal
          title="交易详情"
          visible={!!modalInfo}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          {this.renderDetail(modalInfo)}
        </Modal>
      </Card>
    );
  }
}
