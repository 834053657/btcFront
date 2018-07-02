import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import { Table, Alert, Button, Icon, Radio, Modal } from 'antd';
import { map } from 'lodash';
import BlankLayout from '../../layouts/BlankLayout';
import { getMessageContent } from '../../utils/utils';
import styles from './List.less';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


@connect(({ trade, loading }) => ({
  ...trade.tradeList,
  loading: loading.models.message,
}))
export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '1',
    };
  }

  componentWillMount() {}

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'message/fetchMessageList',
    // });
  }

  columns = [
    {
      title: '用户',
      dataIndex: '1',
    },
    {
      title: '所在国家',
      dataIndex: '2',
    },
    {
      title: '交易笔数',
      dataIndex: '3',
    },
    {
      title: '付款方式',
      dataIndex: '4',
    },
    {
      title: '价格',
      dataIndex: '5',
    },
    {
      title: '限额',
      dataIndex: '6',
    },
  ];

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
      type: 'message/fetchMessageList',
      payload: params,
    });
  };

  handleTypeChange = (e) => {
    const type = e.target.value;
    this.setState({
      type
    })
  }

  render() {
    const { list=[], pagination={}, loading } = this.props;
    const { type } = this.state;
    const typeMap = {
      1: '购买',
      2: '出售'
    }

    return (
      <BlankLayout>
        <div className={styles.header}>
          <Alert message="系统公告：本网站内测期间，为答谢各位会员，所有转账免矿工手续费，答谢活动截止至3.15 12：00." type="info" showIcon />
        </div>
        <div className={styles.banners}>
          <h1 className={styles.title}>交易比特币 快速 安全 私密</h1>
          <h4 className={styles.sub_title}>在 15559 个城市 和 248 个国家/地区交易比特币</h4>
        </div>
        <div className={styles.list}>
          <div className={styles.type_box}>
            <Radio.Group size="large" value={type} onChange={this.handleTypeChange} style={{ marginBottom: 8 }}>
              {
                map(typeMap, (text, value) => <Radio.Button key={value} value={value}>{text}</Radio.Button>)
              }
            </Radio.Group>
          </div>
          <Table
            loading={loading}
            rowKey={record => record.id}
            dataSource={list}
            columns={this.columns}
            pagination={pagination}
            onChange={this.handleTableChange}
          />
        </div>
      </BlankLayout>
    );
  }
}
