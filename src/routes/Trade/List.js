import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import { Table, Alert, Button, Icon, Radio, Avatar, Badge, Tag, Popover } from 'antd';
import { map, forEachRight, filter, get } from 'lodash';
import { FormattedMessage as FM } from 'react-intl';

import { stringify } from 'qs';
import BlankLayout from '../../layouts/BlankLayout';
import SearchForm from './forms/SearchForm';

import styles from './List.less';
import { getQueryString, getPayIcon } from '../../utils/utils';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(({ trade, global, loading, user }) => ({
  currentUser: user.currentUser,
  ...trade.tradeList,
  topNotice: global.topNotice,
  loading: loading.models.message,
}))
export default class List extends Component {
  constructor(props) {
    super(props);
    const { search } = props.location;
    const { ad_type = 1 } = getQueryString(search);
    this.state = {
      ad_type: +ad_type,
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
    // this.props.dispatch({
    //   type: 'global/fetchTopNotice',
    // });
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

  renderColumns = () => {
    let columns = [
      {

        title: <FM id='mainList.user_name' defaultMessage='用户' />,
        dataIndex: 'user_',
        render: (text, row) => {
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
        title: <FM id='mainList.user_country' defaultMessage='所在国家'/>,
        dataIndex: 'country_code',
        render: v => <span>{v && CONFIG.countrysMap[v] ? CONFIG.countrysMap[v].name : '-'}</span>,
      },
      {
        title: <FM id='mainList.user_orderEvaluate' defaultMessage='交易笔数/好评率'/>,
        dataIndex: 'volume_like',
        render: (v, row) => {
          const { trade_times, good_ratio } = row.owner || {};

          return <span>{`${trade_times} / ${good_ratio}%`}</span>;
        },
      },
      {
        title: <FM id='mainList.user_payment_methods' defaultMessage='支付方式'/>,
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
        title: <FM id='mainList.order_trading_price' defaultMessage='价格' />,
        dataIndex: 'trading_price',
        render: (v, row) => {
          return (
            <span>
              {v} {row.currency} / BTC
            </span>
          );
        },
      },
      {
        title: <FM id='mainList.price_limit_' defaultMessage='限额' />,
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
        title: <FM id='mainList.user_operator' defaultMessage='操作' />,
        render: r => {
          const { ad_type } = this.state;
          return (
            <Fragment>
              <Link to={`/trade/detail/${r.id}`}>
                <Button type="primary">{ad_type ? CONFIG.trade_ad_type[ad_type] : '-'}</Button>
              </Link>
            </Fragment>
          );
        },
      },
    ];
    if (this.state.ad_type === 1) {
      columns = filter(columns, item => item.dataIndex !== 'payment_methods');
    }

    return columns;
  };

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
    const { list = [], pagination = {}, loading, topNotice = {} } = this.props;
    const { ad_type, searchVisible, searchValues = {} } = this.state;
    const { countries, currency, pay_methods, money } = searchValues || {};

    return (
      <BlankLayout>
        <div className={styles.header}>
          {topNotice.id ? (
            <div className={styles.header}>
              <Alert
                message={<Link to={`/message/info-detail/${topNotice.id}`}>{topNotice.title}</Link>}
                type="info"
                showIcon
              />
            </div>
          ) : null}
        </div>

        <div className={styles.banners}>
          <h1 className={styles.title}><FM id='mainList.hall_main_title' defaultMessage='交易比特币 快速 安全 私密' /></h1>
          <h4 className={styles.sub_title}><FM id='mainList.hall_second_title' defaultMessage='在 15559 个城市 和 248 个国家/地区交易比特币' /></h4>
        </div>

        <div>
          <div className={styles.type_box}>
            <RadioGroup
              size="large"
              value={ad_type}
              onChange={this.handleTypeChange}
              style={{ marginBottom: 8 }}
            >
              {map(CONFIG.trade_ad_type, (text, value) => (
                <RadioButton key={value} value={+value}>
                  <FM id="mainList.user_todo_btn" defaultMessage="我要{my}" values={{my:text}} />
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
                    : <FM id='mainList.all_country' defaultMessage='全部国家' />}
                </Tag>
                {currency && CONFIG.currencyList[currency] ? (
                  <Tag>{CONFIG.currencyList[currency]}</Tag>
                ) : null}
                <Tag>
                  {pay_methods && CONFIG.payments[pay_methods]
                    ? CONFIG.payments[pay_methods]
                    : <FM id='mainList.all_pay_methods' defaultMessage='全部支付方式' />}
                </Tag>
                {money && (
                  <Tag closable onClose={this.handleClearMoney}>
                    {money}
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
            columns={this.renderColumns()}
            pagination={pagination}
            onChange={this.handleTableChange}
          />
        </div>
      </BlankLayout>
    );
  }
}
