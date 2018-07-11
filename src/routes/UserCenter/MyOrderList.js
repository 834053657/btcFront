import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { map, delay } from 'lodash';
import { Link, routerRedux } from 'dva/router';
import numeral from 'numeral';
import moment from 'moment';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Card,
  Modal,
  Row,
  Col,
  Divider,
  Badge,
  Tooltip,
  Popconfirm,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getMessageContent } from '../../utils/utils';
import styles from './MyOrderList.less';

const TabPane = Tabs.TabPane;
const statusMap = ['warning', 'processing', 'error', 'default'];

@connect(({ user, loading }) => ({
  data: user.myOrders,
  loading: loading.effects['user/fetchMyOrderList'],
}))
export default class List extends Component {
  constructor(props) {
    super();
    this.state = {
      type: '',
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { type } = this.state;
    this.fetch({ type });
  }

  columns = [
    {
      title: '交易单号',
      dataIndex: 'order_no',
      render: (v, row) => <Link to={`/card/deal-line/${row.id}`}>{v}</Link>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: val => (
        <span>{val ? moment(new Date(val * 1000)).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
      ),
    },
    // {
    //   title: '交易产品',
    //   dataIndex: 'goods_type',
    //   render: (val, row) => (val && CONFIG.goods_type[val] ? CONFIG.goods_type[val] : '-'),
    // },
    {
      title: '交易类型',
      dataIndex: 'order_type',
      render: (val, row) => (
        <span>
          {val && CONFIG.order_type[val] ? CONFIG.order_type[val] : '-'}{' '}
          {row.passive ? '(挂单)' : null}
        </span>
      ),
    },
    {
      title: '交易对象',
      dataIndex: 'trader',
      render: (val, row) => (
        <Link to={`/personage/${row.trader.id}`}>
          <span className="text-blue">{row.trader ? row.trader.nickname : '-'}</span>
        </Link>
      ),
    },
    {
      title: '交易状态',
      dataIndex: 'status',
      render: (val, row) => (
        <span>{val && CONFIG.paymentStatus[val] ? CONFIG.paymentStatus[val] : '-'}</span>
      ),
    },
    {
      title: '法币',
      dataIndex: 'currency',
      render: (_, row) => (
        <span className="text-blue">
          <span>{row.trading_volume ? row.trading_volume : '-'}</span>
          {row.currency ? row.currency : '-'}
        </span>
      ),
    },
    {
      title: '交易金额',
      dataIndex: 'amount',
      render: (v, row) => {
        return (
          <span className="text-blue">
            <span>{row.trading_count ? row.trading_count : '-'}</span>BTC
          </span>
        );
      },
    },
    {
      title: '交易费',
      dataIndex: 'fee',
      render: (v, row) => {
        return <span dangerouslySetInnerHTML={{ __html: `¥ ${numeral(v).format('0,0.00')}` }} />;
      },
    },
    {
      title: '总BTC',
      dataIndex: 'trading_count',
      render: (v, row) => {
        return (
          <span className="text-blue">
            <span>{row.trading_count ? row.trading_count : '-'}</span>BTC
          </span>
        );
        // return <span dangerouslySetInnerHTML={{ __html: `¥ ${numeral(v).format('0,0.00')}` }} />;
      },
    },
    {
      title: '汇率',
      dataIndex: 'trading_price',
      render: (v, row) => {
        // return <span dangerouslySetInnerHTML={{ __html: `¥ ${numeral(v).format('0,0.00')}` }} />;
        return (
          <span className="text-blue">
            {row.trading_price ? row.trading_price : '-'}{' '}
            <span>{row.currency ? row.currency : '-'}</span>
          </span>
        );
      },
    },
    {
      title: '操作',
      dataIndex: '_opt_',
      render: (_, row) => <Link to={`/card/deal-line/${row.id}`}>查看</Link>,
    },
  ];

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { type } = this.state;

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      type,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetch(params);
  };

  fetch = params => {
    const { page, page_size } = this.state;
    const newParams = { ...params };
    newParams.page = params.page || page;
    newParams.page_size = params.page_size || page_size;
    if (newParams.type) {
      newParams.status = params.type || this.state.type;
      delete newParams.type;
    }
    console.log({ ...newParams });
    console.log('  ...n');
    this.props.dispatch({
      type: 'user/fetchMyOrderList',
      payload: {
        ...newParams,
      },
    });
  };

  handleChangeType = type => {
    this.fetch({ type });
    this.setState({
      type,
    });
  };

  render() {
    const { type } = this.state;
    const { data: { list, pagination }, loading } = this.props;
    console.log(list.length);

    return (
      <PageHeaderLayout title="我的订单">
        <div>
          <Card bordered={false} className={styles.message_list}>
            <Tabs activeKey={type} onChange={this.handleChangeType}>
              <TabPane tab="全部" key="" />
              {map(CONFIG.order_status, (text, value) => (
                <TabPane tab={text + '(' + list.length + ')'} key={value} />
              ))}
            </Tabs>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={this.columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
