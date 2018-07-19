import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { Table, Tabs, Button, Icon, Card, Modal, Badge, Tooltip } from 'antd';
// import numeral from 'numeral';
import { map } from 'lodash';
// import DescriptionList from 'components/DescriptionList';
import { formatBTC } from '../../../utils/utils';
import styles from './TransferList.less';

// const { Description } = DescriptionList;

const statusMap = ['default', 'warning', 'processing', 'error', 'success'];

const TabPane = Tabs.TabPane;

export default class TransferList extends Component {
  constructor(props) {
    super();
    this.state = {
      modalInfo: null,
      status: '',
    };
  }

  componentDidMount() {
    this.handleTableChange();
  }

  /*  showModal = row => {
    this.setState({
      modalInfo: row,
    });
  };

  hideModal = () => {
    this.setState({
      modalInfo: null,
    });
  };*/

  columns = [
    {
      title: '日期',
      dataIndex: 'created_at',
      render: (v, row) => {
        return <span>{v ? moment(v * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>;
      },
    },
    {
      title: '交易金额(BTC)',
      dataIndex: 'amount',
      render: (v, row) => {
        return (
          <span className={row.type === 1 ? 'text-green' : 'text-red'}>
            <b>{row.type === 1 ? '+' : '-'}</b> {formatBTC(v)}
          </span>
        );
      },
    },
    {
      title: '手续费(BTC)',
      dataIndex: 'fee',
      render: (v, row) => {
        return <span>{`${formatBTC(v)}`}</span>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val, row) => {
        return (
          <Badge status={statusMap[val - 1]} text={val ? CONFIG.transaction_status[val] : '-'} />
        );
      },
    },
    {
      title: '确认次数',
      dataIndex: 'confirm_count',
      render: (v, row) => {
        return <span>{v}</span>;
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      render: (v, row) => {
        return <span>{v}</span>;
      },
    },
    {
      title: '说明',
      dataIndex: 'remark',
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
    // console.log(pagination);

    params.status = params.status || this.state.status;
    params.page = params.page || pagination.page;
    params.page_size = params.page_size || pagination.page_size;
    // console.log('以下')
    // console.log(params,'params')
    this.props.dispatch({
      type: 'wallet/fetchTransfer',
      payload: params,
    });
  };

  /*  getMethodContent = item => {
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
  };*/

  handleTabsChange = status => {
    this.setState({
      status,
    });
    this.fetch({ status });
  };

  /*  renderDetail = modalInfo => {
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
          <span>{`¥ ${type === 1 ? '+' : '-'}${numeral(amount).format('0,0.0000000000')}`}</span>
        </Description>
        <Description term="手续费">
          <span>{`¥ ${numeral(fee).format('0,0.0000000000')}`}</span>
        </Description>
        <Description term="交易时间">
          {created_at ? moment(created_at * 1000).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Description>
      </DescriptionList>
    );
  };*/

  render() {
    const { modalInfo, status } = this.state;
    const { transfer = {}, transferLoading } = this.props;
    const { list = [], pagination = {} } = transfer || {};

    return (
      <Card bordered={false} className={styles.message_list}>
        <Tabs activeKey={status} onChange={this.handleTabsChange}>
          <TabPane tab="全部" key="" />
          {map(CONFIG.transaction_status, (text, value) => <TabPane tab={text} key={value} />)}
        </Tabs>
        <Table
          loading={transferLoading}
          rowKey={record => record.id}
          dataSource={list}
          columns={this.columns}
          pagination={{ ...pagination, pageSize: pagination.page_size, current: pagination.page }}
          onChange={this.handleTableChange}
        />
        {/*  <Modal
          title="交易详情"
          visible={!!modalInfo}
          onOk={this.hideModal}
          onCancel={this.hideModal}
        >
          {this.renderDetail(modalInfo)}
        </Modal>*/}
      </Card>
    );
  }
}
