import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import { Table, Alert, Button, Icon, Radio, Avatar, Badge, Tag, Popover } from 'antd';
import { map } from 'lodash';
import { stringify } from 'qs';
import BlankLayout from '../../layouts/BlankLayout';
import SearchForm from './forms/SearchForm';

import styles from './List.less';
import { getQueryString, getPayIcon } from '../../utils/utils';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const typeMap = {
  1: '购买',
  2: '出售',
};

@connect(({ trade, loading }) => ({
  ...trade.tradeList,
  loading: loading.models.message,
}))
export default class List extends Component {
  constructor(props) {
    const { search } = props.location;
    const { ad_type = '1' } = getQueryString(search);
    super(props);
    this.state = {
      ad_type,
      searchVisible: false,
      searchValues: {
        countries: 'CN',
        currency: 'CNY',
        pay_methods: '',
      },
    };
  }

  componentDidMount() {
    this.fetch();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetch = (params = {}, callback) => {
    const { searchValues, ad_type } = this.state;
    const { dispatch, pagination } = this.props;

    params.ad_type = params.ad_type || ad_type;
    params.page_size = params.page_size || pagination.page_size;

    dispatch({
      type: 'trade/fetchList',
      payload: { ...searchValues, ...params },
      callback: () => {
        callback && callback();
        if (!this.interval) {
          this.interval = setInterval(this.fetch, 30 * 1000);
        }
      },
    });
  };
  columns = [
    {
      title: '用户',
      dataIndex: 'user_',
      render: (text, row) => {
        console.log(row.owner.id);
        const { online, avatar, nickname } = row.owner || {};
        return (
          <div>
            <Link to={`/personage/${row.owner.id}`}>
              <Badge status={online ? 'success' : 'default'} offset={[35, -5]} dot>
                <Avatar size="large" src={avatar} />
              </Badge>
              <span className="name">{nickname}</span>
            </Link>
          </div>
        );
      },
    },
    {
      title: '所在国家',
      dataIndex: 'country_code',
      render: v => <span>{v && CONFIG.countrysMap[v] ? CONFIG.countrysMap[v].name : '-'}</span>,
    },
    {
      title: '交易笔数/好评率',
      dataIndex: 'volume_like',
      render: (v, row) => {
        const { trade_times, good_ratio } = row.owner || {};

        return <span>{`${trade_times} / ${good_ratio}%`}</span>;
      },
    },
    {
      title: '支付方式',
      dataIndex: 'payment_methods',
      render: (v, row) => {
        return (
          <div>
            {map(row.payment_methods, item => (
              <Icon className={styles.pay_method} key={item} type={getPayIcon(item)} />
            ))}
          </div>
        );
      },
    },
    {
      title: '价格',
      dataIndex: 'trading_price',
      render: (v, row) => {
        return (
          <span>
            {v} {v} / BTC
          </span>
        );
      },
    },
    {
      title: '限额',
      dataIndex: 'condition_',
      render: (v, row) => {
        const { max_volume = 0, min_volume = 0 } = row || {};
        return (
          <span>
            {min_volume} - {max_volume} {row.currency}
          </span>
        );
      },
    },
    {
      title: '操作',
      render: r => {
        const { ad_type } = this.state;
        return (
          <Fragment>
            <Link to={`/trade/detail/${r.id}`}>
              <Button type="primary">{ad_type ? typeMap[ad_type] : '-'}</Button>
            </Link>
          </Fragment>
        );
      },
    },
  ];

  handleTypeChange = e => {
    const ad_type = e.target.value;
    this.setState({
      ad_type,
    });
    this.fetch({ ad_type });
    this.props.dispatch(
      routerRedux.replace({
        search: stringify({ ad_type }),
      })
    );
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, getValue } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      // ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetch(params);
  };

  handleVisibleChange = searchVisible => {
    this.setState({ searchVisible });
  };

  handleSearch = searchValues => {
    this.fetch(searchValues, () => this.handleVisibleChange(false));
    this.setState({
      searchValues,
    });
  };

  handleClearMoney = e => {
    e.preventDefault();
    e.stopPropagation();
    const { searchValues } = this.state;
    delete searchValues.money;

    this.setState({
      searchValues,
    });
    this.fetch(searchValues);
  };

  render() {
    const { list = [], pagination = {}, loading } = this.props;
    const { ad_type, searchVisible, searchValues = {} } = this.state;
    const { countries, currency, pay_methods, money } = searchValues || {};

    return (
      <BlankLayout>
        <div className={styles.header}>
          <Alert
            message="系统公告：本网站内测期间，为答谢各位会员，所有转账免矿工手续费，答谢活动截止至3.15 12：00."
            type="info"
            showIcon
          />
        </div>

        <div className={styles.banners}>
          <h1 className={styles.title}>交易比特币 快速 安全 私密</h1>
          <h4 className={styles.sub_title}>在 15559 个城市 和 248 个国家/地区交易比特币</h4>
        </div>

        <div>
          <div className={styles.type_box}>
            <RadioGroup
              size="large"
              value={ad_type}
              onChange={this.handleTypeChange}
              style={{ marginBottom: 8 }}
            >
              {map(typeMap, (text, value) => (
                <RadioButton key={value} value={value}>
                  {text}
                </RadioButton>
              ))}
            </RadioGroup>
          </div>
          <div className={styles.table_tool}>
            <Popover
              // placement="bottom"
              visible={searchVisible}
              // trigger="click"
              // onVisibleChange={this.handleVisibleChange}
              content={
                <SearchForm
                  initialValues={searchValues}
                  onSearch={this.handleSearch}
                  onCancel={this.handleVisibleChange.bind(this, false)}
                />
              }
            >
              <div
                className={styles.search_box}
                onClick={this.handleVisibleChange.bind(this, true)}
              >
                <Tag>
                  {countries && CONFIG.countrysMap[countries]
                    ? CONFIG.countrysMap[countries].name
                    : '全部国家'}
                </Tag>
                {currency && CONFIG.currencyList[currency] ? (
                  <Tag>{CONFIG.currencyList[currency]}</Tag>
                ) : null}
                <Tag>
                  {pay_methods && CONFIG.payments[pay_methods]
                    ? CONFIG.payments[pay_methods]
                    : '全部支付方式'}
                </Tag>
                {searchValues.money && (
                  <Tag closable onClose={this.handleClearMoney}>
                    {searchValues.money}
                  </Tag>
                )}
                <Icon type="search" />
              </div>
            </Popover>
          </div>

          <Table
            className={styles.list}
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
