import React, { Component } from 'react';
import { connect } from 'dva/index';
import { filter } from 'lodash';
import { routerRedux } from 'dva/router';
import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Radio,
  Input,
  Select,
  InputNumber,
  Popconfirm,
  message,
  Popover,
} from 'antd';
import styles from './BuyCard.less';
import BuyForm from './forms/BuyForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

@connect(({ card }) => ({
  card,
}))
export default class SaleCard extends Component {
  constructor(props) {
    super();
    const cardList = filter(CONFIG.card_type, c => c.valid, []);
    this.state = {
      condition: [],
      condition_type: 1,
      passwordType: 1,
      cardType: cardList,
      defaultCard: cardList[0] || {},
    };
    this.items = [];

    this.data = {
      condition: [],
      deadline: CONFIG.deadline ? CONFIG.deadline[0] : null,
      guarantee_time: CONFIG.guarantee_time ? CONFIG.guarantee_time[0] : null,
      card_type: cardList[0] && cardList[0].type,
      condition_type: 1,
      password_type: 1,
      unit_price: 1,
      multiple: 1,
      concurrency_order: 0,
    };

    this.setVisible = (type, visible) => {
      this.setState({
        [type]: visible,
      });
    };

    this.changePasswordType = e => {
      this.data.password_type = e.target.value;
      this.setState({
        passwordType: e.target.value,
      });
    };

    this.selectCardType = e => {
      this.data.card_type = +e;
    };

    this.selectGuaTime = e => {
      this.setState({
        defaultGuaTime: +e,
      });
      this.data.guarantee_time = +e;
    };

    this.selectDeadline = e => {
      this.setState({
        deadline: +e,
      });
      this.data.deadline = +e;
    };

    this.selectTermTitle = e => {
      if (e !== 'noTerm') {
        this.data.term_id = +e;
      }
    };

    //单价修改
    this.unitPriceChange = e => {
      this.data.unit_price = e;
    };

    //删除面额种类
    this.delDeno = (t, i) => {
      const a = this.state.condition;
      a.splice(i, 1);
      this.setState({
        condition: a,
      });
    };

    this.changeMoney = (e, index) => {
      const re = /^[1-9]+[0-9]*]*$/;
      if (re.test(e)) {
        const a = this.state.condition;
        a[index].money = parseInt(e);
        this.setState({
          condition: a,
        });
        this.data.condition = a;
      } else {
        message.warning('请输入数字格式');
      }
    };

    this.changeMinCount = (e, index) => {
      const re = /^[1-9]+[0-9]*]*$/;
      if (re.test(e)) {
        const a = this.state.condition;
        a[index].min_count = parseInt(e);
        this.setState({
          condition: a,
        });
        this.data.condition = a;
      } else {
        message.warning('请输入数字格式');
      }
    };

    this.minBlur = (e, index) => {
      const a = this.state.condition;
      if (
        a[index].min_count !== '' &&
        a[index].max_count !== '' &&
        a[index].min_count > a[index].max_count
      ) {
        message.warning('不得超过最大数量');
        return false;
      }
    };

    this.maxBlur = (e, index) => {
      const a = this.state.condition;
      const re = /^[1-9]+[0-9]*]*$/;
      if (
        a[index].min_count !== '' &&
        a[index].max_count !== '' &&
        a[index].min_count > a[index].max_count
      ) {
        message.warning('不得低于最小数量');
      }
    };

    this.changeMaxCount = (e, index) => {
      const re = /^[1-9]+[0-9]*]*$/;
      if (re.test(e)) {
        const a = this.state.condition;
        a[index].max_count = parseInt(e);
        this.setState({
          condition: a,
        });
        this.data.condition = a;
      } else {
        message.warning('请输入数字格式');
      }
    };

    this.addAdvertising = () => {
      this.props.dispatch({
        type: 'card/addCardSell',
        payload: this.data,
      });
    };

    this.multChange = e => {
      this.data.multiple = e;
    };

    this.ordersAmountChange = e => {
      this.data.concurrency_order = e;
    };

    this.selCondition = e => {
      this.setState({
        condition_type: +e,
        condition: +e === 1 ? [] : {},
      });
      this.data.condition = +e === 1 ? [] : {};
      this.data.condition_type = +e;
    };

    this.changeMinMoney = e => {
      const re = /^[1-9]+[0-9]*]*$/;
      if (re.test(e)) {
        this.data.condition.min_money = +e;
      } else {
        message.warning('请输入数字格式');
      }
    };

    this.changeRangeMin = e => {
      this.setState({
        rangeMinCount: e,
      });
      this.data.condition.min_money = +e;
    };

    this.changeRangeMax = e => {
      this.setState({
        rangeMaxCount: e,
      });
      this.data.condition.max_money = +e;
    };

    this.changeMaxMoney = e => {
      const re = /^[1-9]+[0-9]*]*$/;
      if (re.test(e)) {
        this.setState({
          rangeMaxCount: e,
        });
        this.data.condition.max_money = +e;
      } else {
        message.warning('请输入数字格式');
      }
    };

    this.addBuyAd = () => {
      if (Array.isArray(this.data.condition)) {
        if (this.data.condition.length === 0) {
          message.warning('面额信息不完整');
          return false;
        }
      } else if (
        !Array.isArray(this.data.condition) &&
        (!this.data.condition.min_money || !this.data.condition.max_money)
      ) {
        message.warning('面额信息不完整');
        return false;
      }
      this.props
        .dispatch({
          type: 'card/addBuyAd',
          payload: this.data,
        })
        .then(res => {
          if (res.code === 0) {
            this.data = {};
            this.props.history.push({ pathname: '/ad/my' });
          } else {
            message.error('发送失败，失败原因：' + res.msg);
          }
        });
    };
  }

  //添加面额种类
  addDeno = () => {
    // if (isNaN(this.state.denoVaule)) {
    //   return message.warning('请输入正确格式')
    // }
    const { condition } = this.state;
    const con = {
      money: '',
      min_count: '',
      max_count: '',
    };
    condition.push({
      money: '',
      min_count: '',
      max_count: '',
    });
    this.setState({
      condition,
    });
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/fetchTerms',
    });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { condition_type, condition, defaultCard = {}, cardType = [] } = this.state;
    const items = this.props.card.terms;

    const breadcrumbList = [
      { title: '广告管理', href: '/ad/my' },
      { title: '礼品卡', href: '/card/market' },
      { title: '创建购买' },
    ];

    return (
      <div className={styles.addSale}>
        <PageHeaderLayout breadcrumbList={breadcrumbList}>
          {/*
          <BuyForm/>
          */}

          <ul className={styles.submitTable}>
            <li>
              <span className={styles.tableLeft}>类型：</span>
              <Select
                style={{ width: 120 }}
                defaultValue={defaultCard.name}
                onChange={this.selectCardType}
              >
                {cardType.map(t => {
                  return (
                    <Option key={t.type} value={t.type}>
                      {t.name}
                    </Option>
                  );
                })}
              </Select>
            </li>

            <li>
              <span className={styles.tableLeft}>单价：</span>
              <InputNumber defaultValue={1} min={1} onChange={e => this.unitPriceChange(e)} /> RMB
            </li>

            <li>
              <span className={styles.tableLeft}>倍数：</span>
              <InputNumber defaultValue={1} min={1} onChange={e => this.multChange(e)} />
            </li>

            <li>
              <span className={styles.tableLeft}>条件：</span>
              <Radio.Group defaultValue="1" onChange={e => this.selCondition(e.target.value)}>
                <Radio.Button value="1">指定面额</Radio.Button>
                <Radio.Button value="2">面额区间</Radio.Button>
              </Radio.Group>
            </li>
            {condition_type && condition.length && +condition_type === 1 ? (
              <li>
                <span className={styles.tableLeft}>&nbsp;</span>
                {
                  <ul className={styles.conditionFixed}>
                    {condition && condition.length
                      ? condition.map((c, index) => {
                          return (
                            <li key={index}>
                              <Input
                                className={styles.conFixIpt}
                                placeholder="面额"
                                value={c.money}
                                onChange={e => {
                                  this.changeMoney(e.target.value, index);
                                }}
                              />
                              &nbsp;--&nbsp;
                              <Input
                                className={styles.conFixIpt}
                                placeholder="最小数量"
                                value={c.min_count}
                                onBlur={e => this.minBlur(e, index)}
                                onChange={e => {
                                  this.changeMinCount(e.target.value, index);
                                }}
                              />
                              &nbsp;--&nbsp;
                              <Input
                                className={styles.conFixIpt}
                                placeholder="最大数量"
                                value={c.max_count}
                                onBlur={e => this.maxBlur(e, index)}
                                onChange={e => {
                                  this.changeMaxCount(e.target.value, index);
                                }}
                              />
                              <Icon
                                className={styles.delIcon}
                                type="minus-circle-o"
                                onClick={() => {
                                  this.delDeno(c, index);
                                }}
                              />
                            </li>
                          );
                        })
                      : null}
                  </ul>
                }
              </li>
            ) : null}
            {+condition_type === 2 ? (
              <li>
                <span className={styles.tableLeft}>&nbsp;</span>
                <div>
                  <InputNumber
                    className={styles.conIpt}
                    type="text"
                    value={this.state.rangeMinCount}
                    onChange={e => this.changeRangeMin(e)}
                  />
                  &nbsp;&nbsp;---&nbsp;&nbsp;
                  <InputNumber
                    className={styles.conIpt}
                    type="text"
                    width="40px"
                    value={this.state.rangeMaxCount}
                    onChange={e => this.changeRangeMax(e)}
                  />
                </div>
              </li>
            ) : null}
            {+condition_type === 1 ? (
              <li>
                <span className={styles.tableLeft}>&nbsp;</span>
                <Button style={{ width: '260px', borderStyle: 'dashed' }} onClick={this.addDeno}>
                  + 添加面额
                </Button>
              </li>
            ) : null}

            <li>
              <span className={styles.tableLeft}>要求：</span>
              <RadioGroup
                onChange={e => this.changePasswordType(e)}
                value={this.state.passwordType}
              >
                <Radio value={1}>有卡密</Radio>
                <Radio value={2}>有图</Radio>
                <Radio value={3}>有图有卡密</Radio>
              </RadioGroup>
            </li>

            <li>
              <span className={styles.tableLeft}>发卡期限：</span>
              <Select
                defaultValue={CONFIG.deadline && CONFIG.deadline[0]}
                onChange={this.selectDeadline}
                style={{ width: 100 }}
              >
                {CONFIG.deadline &&
                  CONFIG.deadline.map(t => {
                    return <Option key={t}>{t}</Option>;
                  })}
              </Select>
            </li>

            <li>
              <span className={styles.tableLeft}>保障时间：</span>
              <Select
                defaultValue={CONFIG.guarantee_time && CONFIG.guarantee_time[0]}
                onChange={this.selectGuaTime}
                style={{ width: 100 }}
              >
                {CONFIG.guarantee_time &&
                  CONFIG.guarantee_time.map(t => {
                    return <Option key={t}>{t}</Option>;
                  })}
              </Select>
            </li>

            <li>
              <span className={styles.tableLeft}>
                交易条款
                <i>(可选)</i>
                ：
              </span>
              <Select defaultValue="无" style={{ width: 120 }} onChange={this.selectTermTitle}>
                <Option key="noTerm">无</Option>
                {items ? (
                  items.filter(i => i.status === 3) ? (
                    items.filter(i => i.status === 3).map(t => {
                      return (
                        <Option value={t.id} key={t.id}>
                          {t.title}
                        </Option>
                      );
                    })
                  ) : (
                    <Menu.Item>请等待条款审核</Menu.Item>
                  )
                ) : (
                  <Menu.Item>请在我的订单里新建条款</Menu.Item>
                )}
              </Select>
            </li>
            <li>
              <span className={styles.tableLeft}>同时处理订单数：</span>
              <InputNumber
                onFocus={() => {
                  this.setState({
                    ordersNum: true,
                  });
                }}
                onBlur={() => {
                  this.setState({
                    ordersNum: false,
                  });
                }}
                defaultValue={0}
                min={0}
                onChange={e => this.ordersAmountChange(e)}
              />
              &nbsp;
              {this.state.ordersNum ? '   0代表不限制订单并发数量' : null}
            </li>
          </ul>
          <div className={styles.footerBox}>
            <Button onClick={() => this.props.dispatch(routerRedux.goBack())}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                this.addBuyAd();
              }}
            >
              发布
            </Button>
          </div>
        </PageHeaderLayout>
      </div>
    );
  }
}
