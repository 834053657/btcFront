import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Tabs, Button, Icon, Pagination, Input, message } from 'antd';
import styles from './CardMarkets.less';

@connect(({ card }) => ({
  card,
}))
export default class CardMarkets extends Component {
  constructor(props) {
    super();
    this.state = {
      pagination: {
        page: 1,
        page_size: 10,
      },
      loading: false,
      typeVisible: false,
      denoVisible: false,
      minDeno: null,
      maxDeno: null,
      type_page: 0,
    };

    this.filter = {};

    this.setVisible = (type, visible) => {
      this.setState({
        [type]: visible,
      });
    };

    this.changeTab = e => {
      this.filter = {};
      this.filter = Object.assign(this.filter, { ad_type: e });
      this.state.type_page = e;
      this.setState({
        type_page: e,
      });
      this.props.history.push({
        pathname: `/card/card-markets`,
        //query: { ad_info: record },
      });
      this.reSetPage();
      this.reloadList();
    };

    this.reSetPage = () => {
      this.state.pagination.page = 1;
      this.setState({
        pagination: {
          page: 1,
          page_size: 10,
        },
      });
      this.filter = Object.assign(this.filter, this.state.pagination);
    };

    //select Card Type
    this.selectType = d => {
      console.log('card type');
      this.filter = Object.assign(this.filter, { card_type: d.type });
      this.reSetPage();
      this.reloadList();
      this.setState({
        typeVisible: false,
      });
    };

    this.changePage = e => {
      this.state.pagination.page = e;
      this.setState({
        pagination: {
          page: e,
          page_size: 10,
        },
      });
      this.filter = Object.assign(this.filter, this.state.pagination);
      this.reloadList();
    };

    //after set filter，reload data
    this.reloadList = () => {
      const { type_page } = this.state;
      this.setState({ loading: true });
      const { dispatch } = this.props;

      // dispatch({
      //   type: 'card/fetchCardList',
      //   payload: this.filter,
      // }).then(() => {
      //   this.setState({ loading: false });
      // });

      console.log('this.filter');
      console.log(this.filter);
      if (+type_page === 2) {
        //购买
        dispatch({
          type: 'card/fetchCardList',
          payload: this.filter,
        }).then(() => {
          this.setState({ loading: false });
        });
      } else if (+type_page === 1) {
        //出售
        dispatch({
          type: 'card/fetchCardList',
          payload: this.filter,
        }).then(() => {
          this.setState({ loading: false });
        });
      }
    };

    //单价排序
    this.tableChange = (pagination, filter, sorter) => {
      //升序
      if (sorter.order && sorter.order === 'ascend') {
        this.filter = Object.assign(this.filter, { unit_price: 0 });
        this.reSetPage();
        this.reloadList();
      }
      //降序
      if (sorter.order && sorter.order === 'descend') {
        this.filter = Object.assign(this.filter, { unit_price: 1 });
        this.reSetPage();
        this.reloadList();
      }
    };

    this.setMinDeno = e => {
      this.setState({
        minDeno: e.target.value,
      });
    };

    this.setMaxDeno = e => {
      this.setState({
        maxDeno: e.target.value,
      });
    };

    this.resetRangeFilter = () => {
      this.setState({
        minDeno: null,
        maxDeno: null,
      });
    };

    this.setRangeFilter = () => {
      const a = parseInt(this.state.minDeno);
      const b = parseInt(this.state.maxDeno);
      if (isNaN(this.state.minDeno) || isNaN(this.state.maxDeno)) {
        return message.error('输入格式错误');
      }
      if (a >= b) {
        return message.error('请输入正确范围');
      }
      if (a && !b) {
        this.filter = Object.assign(this.filter, { minDenomination: a });
      } else if (!a && b) {
        this.filter = Object.assign(this.filter, { maxDenomination: b });
      } else if (a && b) {
        this.filter = Object.assign(this.filter, {
          minDenomination: a,
          maxDenomination: b,
        });
      } else {
        return message.error('请至少输入一个范围');
      }
      if (this.state.type_page === 0) {
        this.setState({ denoVisible: false });
      }
      this.reSetPage();
      this.reloadList();
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    this.filter = Object.assign(this.filter, { ad_type: 2 });

    dispatch({
      type: 'card/fetchCardList',
      payload: this.filter,
    }).then(() => {
      this.setState({ loading: false });
    });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { card } = this.props;

    function FilterDemo() {
      return <div className={styles.filterDemo}>dasd</div>;
    }

    function findDeno(m, r) {
      const money = [];
      const a = r.condition instanceof Array;
      if (!a && r.condition) {
        if (m === 'min') {
          return r.condition.min_money;
        }
        if (m === 'max') {
          return r.condition.max_money;
        }
      }
    }

    function denoType(r) {
      return r.condition instanceof Array;
    }

    function denoList(r) {
      const a = [];
      if (denoType(r)) {
        r.condition.map(i => {
          return a.push(i.money);
        });
        return a;
      }
    }

    function denoBuyList(r) {
      const a = [];
      if (r.money instanceof Array) {
        return r.money;
      } else {
        return false;
      }
    }

    function amountMoney(r) {
      let a = 0;
      if (r.cards instanceof Array) {
        r.cards.map(i => {
          return (a += i.money * i.count);
        });
        return a;
      } else {
        return false;
      }
    }

    let pagination_prop;
    let cardList;

    if (card.cardList) {
      cardList = card.cardList.items;
    }

    let columns;
    let columnsSale;

    //我要购买页  出售广告
    if (cardList) {
      columns = [
        {
          title: '用户名',
          dataIndex: 'owner.nickname',
        },
        {
          title: '类型',
          dataIndex: 'type',
          filterDropdown: (
            <div style={{ padding: '0 10px 0 10px' }} className={styles.filterDropdownCard}>
              {CONFIG.card_type
                ? CONFIG.card_type.map(type => {
                    return (
                      <div
                        className={styles.typeName}
                        key={type.type}
                        onClick={() => this.selectType(type)}
                      >
                        {type.name}
                      </div>
                    );
                  })
                : null}
            </div>
          ),
          filterDropdownVisible: this.state.typeVisible,
          onFilterDropdownVisibleChange: e => {
            this.setVisible('typeVisible', e);
          },
          filterIcon: (
            <Icon
              type="down"
              onClick={() => this.setState({ typeVisible: !this.state.typeVisible })}
            />
          ),
          render: (text, record) => {
            console.log(record);
            console.log('record');
            return (
              <span>
                {record.card_type && CONFIG.cardTypeMap[record.card_type]
                  ? CONFIG.cardTypeMap[record.card_type].name
                  : '-'}
              </span>
            );
          },
        },
        {
          title: '面额',
          dataIndex: 'denomination',
          onFilterDropdownVisibleChange: e => {
            this.setVisible('denoVisible', e);
          },
          filterDropdownVisible: this.state.denoVisible,
          filterDropdown: (
            <div className={styles.denoRange}>
              <div className={styles.range}>
                <span>区间:</span>
                <span className={styles.min}>
                  <Input value={this.state.minDeno} onChange={e => this.setMinDeno(e)} />
                </span>
                <span>---</span>
                <span className={styles.max}>
                  <Input value={this.state.maxDeno} onChange={e => this.setMaxDeno(e)} />
                </span>
              </div>
              <div className={styles.rangeBtns}>
                <Button
                  onClick={() => {
                    this.resetRangeFilter();
                  }}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setRangeFilter();
                  }}
                >
                  确定
                </Button>
              </div>
            </div>
          ),
          render: (text, record) => {
            return (
              <span>
                {console.log(record, 'recorddddddd')}
                {denoBuyList(record)
                  ? denoBuyList(record).map((m, index) => {
                      return (
                        <span key={index}>
                          {m}
                          {index < denoBuyList(record).length - 1 ? '/' : null}
                        </span>
                      );
                    })
                  : null}
              </span>
            );
          },
        },
        {
          title: '总面额',
          dataIndex: 'total_denomination',
          render: (text, record) => {
            return <span>{amountMoney(record)}</span>;
          },
        },
        {
          title: '单价',
          dataIndex: 'unit_price',
          sorter: (a, b) => a.unitPrice - b.unitPrice,
        },
        {
          title: '保障时间',
          dataIndex: 'guarantee_time',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render: (text, record) => {
            return (
              <Button
                type="primary"
                onClick={() => {
                  this.props.history.push({
                    pathname: `/card/deal-detail`,
                    query: { ad_info: record },
                  });
                }}
              >
                购买
              </Button>
            );
          },
        },
      ];
    }
    //购买Table

    if (cardList) {
      columnsSale = [
        {
          title: '用户名',
          dataIndex: 'owner.nickname',
        },
        {
          title: '类型',
          dataIndex: 'type',
          filterDropdown: (
            <div style={{ padding: '0 10px 0 10px' }} className={styles.filterDropdownCard}>
              {CONFIG.card_type
                ? CONFIG.card_type.map(type => {
                    return (
                      <div
                        className={styles.typeName}
                        key={type.type}
                        onClick={() => this.selectType(type)}
                      >
                        {type.name}
                      </div>
                    );
                  })
                : null}
            </div>
          ),
          filterDropdownVisible: this.state.typeVisible,
          onFilterDropdownVisibleChange: e => {
            this.setVisible('typeVisible', e);
          },
          filterIcon: (
            <Icon
              type="down"
              onClick={() => this.setState({ typeVisible: !this.state.typeVisible })}
            />
          ),
          render: (text, record) => {
            return (
              <span>
                {record.card_type && CONFIG.cardTypeMap[record.card_type]
                  ? CONFIG.cardTypeMap[record.card_type].name
                  : '-'}
              </span>
            );
          },
        },
        {
          title: '面额',
          dataIndex: 'denomination',
          onFilterDropdownVisibleChange: e => {
            this.setVisible('denoVisible', e);
          },
          filterDropdownVisible: this.state.denoVisible,
          filterDropdown: (
            <div className={styles.denoRange}>
              <div className={styles.range}>
                <span>区间:</span>
                <span className={styles.min}>
                  <Input value={this.state.minDeno} onChange={e => this.setMinDeno(e)} />
                </span>
                <span>---</span>
                <span className={styles.max}>
                  <Input value={this.state.maxDeno} onChange={e => this.setMaxDeno(e)} />
                </span>
              </div>
              <div className={styles.rangeBtns}>
                <Button
                  onClick={() => {
                    this.resetRangeFilter();
                  }}
                >
                  重置
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    this.setRangeFilter();
                  }}
                >
                  确定
                </Button>
              </div>
            </div>
          ),
          render: (text, record) => {
            return (
              <span>
                {denoType(record) ? (
                  denoList(record) ? (
                    denoList(record).map((i, index) => {
                      return (
                        <span key={index}>
                          {i}
                          {index < denoList(record).length - 1 ? '/' : null}
                        </span>
                      );
                    })
                  ) : null
                ) : (
                  <span>
                    {findDeno('min', record) + ' - '}
                    {findDeno('max', record)}
                  </span>
                )}
              </span>
            );
          },
        },
        {
          title: '单价',
          dataIndex: 'unit_price',
          sorter: (a, b) => a.unitPrice - b.unitPrice,
        },
        {
          title: '发卡期限',
          dataIndex: 'deadline',
        },
        {
          title: '保障时间',
          dataIndex: 'guarantee_time',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          render: (text, record) => {
            return (
              <div>
                <Button
                  type="primary"
                  onClick={() => {
                    this.props.history.push({
                      pathname: `/card/sell-detail`,
                      query: { ad_info: record },
                    });
                  }}
                >
                  出售
                </Button>

                <Button
                  type="primary"
                  onClick={() => {
                    this.props.history.push({
                      pathname: `/card/ad-receiveCard`,
                      query: { ad_info: record },
                    });
                  }}
                >
                  查收
                </Button>
              </div>
            );
          },
        },
      ];
    }

    return (
      <div>
        <Tabs
          onChange={e => {
            this.changeTab(e);
          }}
          defaultActiveKey="2"
        >
          {/*出售广告*/}
          <Tabs.TabPane tab="我要购买" key="2" />
          {/*购买广告*/}
          <Tabs.TabPane tab="我要出售" key="1" />
        </Tabs>

        <Table
          rowKey={row => row.id}
          dataSource={cardList}
          columns={+this.state.type_page === 1 ? columnsSale : columns}
          pagination={false}
          loading={this.state.loading}
          onChange={this.tableChange}
        />
        <Pagination
          showQuickJumper
          defaultCurrent={2}
          total={500}
          onChange={this.changePage}
          current={this.state.pagination.page}
        />
      </div>
    );
  }
}
