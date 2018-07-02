import React, { Component, Fragment } from 'react';
import { parse } from 'url';
import numeral from 'numeral';
import { connect } from 'dva';
import { stringify } from 'qs';
import { map, filter } from 'lodash';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  Popover,
  Form,
  Avatar,
  Badge,
} from 'antd';
import { routerRedux } from 'dva/router';
import FilterDemoinForm from './forms/FilterDemoinForm';
import { getQueryString } from '../../utils/utils';
import styles from './List.less';

const InputGroup = Input.Group;
const FormItem = Form.Item;

@connect(({ card, loading, user }) => ({
  list: card.list,
  //loading: loading.effects['card/fetchCardList_'],
  user: user.currentUser.user,
}))
export default class List extends Component {
  constructor(props) {
    super(props);
    const { type = '2' } = getQueryString(props.location.search);
    this.state = {
      type,
      denoVisible: false,
      denominFilterValue: undefined,
    };
  }

  changeTab = type => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.setState({
      type,
      password_type: undefined,
      card_type: undefined,
      denominFilterValue: undefined,
    });
    this.state.card_type = undefined;
    this.state.password_type = undefined;
    this.state.denominFilterValue = undefined;
    this.fetchData({ type }, () => {
      this.props.dispatch(routerRedux.replace({ search: stringify({ type }) }));
    });
  };

  denoType = r => {
    return r.condition instanceof Array;
  };

  denoList = r => {
    const a = [];
    if (this.denoType(r)) {
      r.condition.map(i => {
        return a.push(i.money);
      });
      return a;
    }
  };

  denoBuyList = r => {
    const a = [];
    if (r.money instanceof Array) {
      return r.money;
    } else {
      return false;
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchData = (params_, callback) => {
    const params = { ...params_ };
    const { type, card_type, order_by, password_type, denominFilterValue, filters } = this.state;
    params.type = params.type || type;
    params.card_type = params.card_type || card_type;
    // params.card_type = params.card_type ? params.card_type : undefined;
    params.order_by = params.order_by || order_by;
    params.password_type = params.password_type || password_type;
    // params.password_type = params.password_type ? params.password_type : undefined;
    params.denominFilterValue = params.denominFilterValue ? params.denominFilterValue : undefined;
    if (params.denominFilterValue) {
      params.min_money = params.denominFilterValue.min;
      params.max_money = params.denominFilterValue.max;
      delete params.denominFilterValue;
    }

    this.props
      .dispatch({
        type: 'card/fetchCardList_',
        payload: {
          ...params,
        },
      })
      .then(() => {
        if (!this.interval) {
          this.interval = setInterval(this.fetchData, 30 * 1000);
        }
        callback && callback();
      });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const getValue = obj =>
      Object.keys(obj)
        .map(key => obj[key])
        .join(',');
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params1 = {
      page: pagination.current,
      page_size: pagination.pageSize,
      card_type: filters.type,
      password_type: filters.password_type,
    };
    if (sorter.field) {
      params1.order_by = sorter.order === 'descend' ? 1 : 2; //`${sorter.field}_${sorter.order}`;
    }
    if (filtersArg.type && filtersArg.type.length === 0) {
      delete params1.card_type;
    }
    if (filtersArg.password_type && filtersArg.password_type.length === 0) {
      delete params1.password_type;
    }
    this.setState({
      ...params1,
      tableFilter: filters,
    });
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.fetchData(params1);
  };

  handleResetFilterDemoin = () => {
    this.setState({
      denominFilterValue: undefined,
      denoVisible: false,
    });
    this.state.denominFilterValue = undefined;
    this.state.denoVisible = false;
    this.fetchData();
  };

  handleFilterDemoin = value => {
    this.setState({
      denominFilterValue: value,
      denoVisible: false,
    });
    this.fetchData({
      denominFilterValue: value,
    });
  };

  initColumns = (type, denominFilterValue) => {
    const cardTypes = map(CONFIG.card_type.filter(t => t.valid), item => {
      return { text: item.name, value: item.type };
    });
    const cardPwdType = map(CONFIG.cardPwdType, (text, value) => {
      return { text, value };
    });
    let columns = [
      {
        title: '用户名',
        width: '150',
        dataIndex: 'nickname_',
        render: (text, record) => {
          const userinfo = record.owner;
          return (
            <div className={styles.userInfo}>
              <Badge status={userinfo.online ? 'success' : 'default'} offset={[35, -5]} dot>
                <Avatar size="large" src={userinfo.avatar} />
              </Badge>
              <span className={styles.name}>{userinfo.nickname}</span>
            </div>
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'type',
        width: '100',
        filterMultiple: false,
        filters: cardTypes,
        render: (text, record) => {
          return (
            <span>
              {CONFIG.cardTypeMap[record.card_type]
                ? CONFIG.cardTypeMap[record.card_type].name
                : '-'}
            </span>
          );
        },
      },
      {
        title: type === '2' ? '包含' : '要求',
        dataIndex: 'password_type',
        width: '200',
        filters: cardPwdType,
        filterMultiple: false,
        render: (v, row) => {
          return <span>{v ? CONFIG.cardPwdType[v] : '-'}</span>;
        },
      },
      {
        title: '面额',
        dataIndex: 'denomination',
        width: '100',
        onFilterDropdownVisibleChange: e => {
          this.setState({
            denoVisible: e,
          });
        },
        filterIcon: (
          <Icon
            type="filter"
            style={{ color: this.state.denominFilterValue ? '#108ee9' : '#aaa' }}
          />
        ),
        filterDropdownVisible: this.state.denoVisible,
        filterDropdown: (
          <FilterDemoinForm
            onSubmit={this.handleFilterDemoin}
            onCancel={this.handleResetFilterDemoin}
          />
        ),
        render: (text, record) => {
          if (type === '2') {
            return (
              <span>
                {this.denoBuyList(record)
                  ? this.denoBuyList(record).map((m, index) => {
                      return (
                        <span key={index}>
                          {m}
                          {index < this.denoBuyList(record).length - 1 ? '/' : null}
                        </span>
                      );
                    })
                  : null}
              </span>
            );
          } else {
            return (
              <span>
                {this.denoType(record) ? (
                  this.denoList(record) ? (
                    this.denoList(record).map((i, index) => {
                      return (
                        <span key={index}>
                          {i}
                          {index < this.denoList(record).length - 1 ? '/' : null}
                        </span>
                      );
                    })
                  ) : null
                ) : (
                  <span>
                    r
                    {record.condition.min_money}
                    {' - '}
                    {record.condition.max_money}
                  </span>
                )}
              </span>
            );
          }
        },
      },
      {
        title: '总面额',
        width: '100',
        dataIndex: 'total_denomination',
        render: (text, record) => <span>{numeral(record.total_money).format('0,0.00')}</span>,
      },
      {
        title: '发卡期限',
        width: '100',
        dataIndex: 'deadline',
        render: v => <span>{v} 分钟</span>,
      },
      {
        title: '单价',
        width: '100',
        dataIndex: 'unit_price',
        render: v => <span>{numeral(v).format('0,0.00')} RMB</span>,
        sorter: (a, b) => a.unitPrice - b.unitPrice,
      },
      {
        title: '保障时间',
        width: '100',
        dataIndex: 'guarantee_time',
        render: v => <span>{v} 分钟</span>,
      },
      {
        title: '操作',
        dataIndex: 'operation_',
        render: (text, record = {}) => {
          const { user = {} } = this.props;
          const { owner = {} } = record || {};
          return (
            <Button
              type="primary"
              disabled={owner.id === user.id}
              onClick={() => {
                this.props.history.push({
                  pathname: `/card/deal-detail/${record.id}`,
                });
              }}
            >
              {type === '2' ? '购买' : '出售'}
            </Button>
          );
        },
      },
    ];

    if (type === '2') {
      columns = filter(columns, item => item.dataIndex !== 'deadline');
    } else {
      columns = filter(columns, item => item.dataIndex !== 'total_denomination');
    }
    return columns;
  };

  render() {
    const { list, loading } = this.props;
    const { type, denominFilterValue } = this.state;
    const { items, pagination } = list || {};
    return (
      <div className={styles.page}>
        <h2>礼品卡大厅</h2>
        <Tabs onChange={this.changeTab} defaultActiveKey="2" activeKey={type}>
          {/*出售广告*/}
          <Tabs.TabPane tab="我要购买" key="2" />
          {/*购买广告*/}
          <Tabs.TabPane tab="我要出售" key="1" />
        </Tabs>
        <Table
          rowKey={row => row.id}
          dataSource={items}
          columns={this.initColumns(type, denominFilterValue)}
          onChange={this.handleTableChange}
          pagination={{
            ...pagination,
            // showQuickJumper: true,
          }}
          loading={loading}
        />
      </div>
    );
  }
}
