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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import OnlyPicture from './SellOnlyPicture';
import PicWithText from './SellPicWithText';
import SellForm from './forms/SellForm';
import styles from './SellCard.less';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;

@connect(({ card }) => ({
  card,
}))
export default class BuyCard extends Component {
  constructor(props) {
    super();
    const cardList = filter(CONFIG.card_type, c => c.valid, []);
    this.state = {
      cards: [],
      addDenoVisible: false,
      passwordType: 1,
      unit_price: 0,
      totalMoney: 0,
      cardType: cardList,
      defaultCard: cardList[0] || {},
    };
    this.cards = [];
    this.items = [];
    this.data = {
      password_type: 1,
      card_type: cardList[0] && cardList[0].type,
      guarantee_time: CONFIG.guarantee_time ? CONFIG.guarantee_time[0] : '',
      concurrency_order: 0,
      unit_price: 1,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'card/fetchTerms',
      payload: {
        status: 3,
        page_size: 10000,
      },
    });
  }

  changePasswordType = e => {
    this.data.password_type = e.target.value;
    this.setState({
      passwordType: e.target.value,
      cards: [],
    });
  };

  selectCardType = e => {
    this.data.card_type = +e;
  };

  selectGuaTime = e => {
    this.setState({
      defaultGuaTime: +e,
    });
    this.data.guarantee_time = +e;
  };

  selectTermTitle = e => {
    if (e !== 'noTerm') {
      this.data.term_id = +e;
    }
  };

  unitPriceChange = e => {
    this.data.unit_price = e;
    this.setState({
      unit_price: parseInt(e),
    });
  };

  ordersAmountChange = e => {
    this.data.concurrency_order = e;
  };

  //添加面额种类
  addDeno = () => {
    if (isNaN(this.state.denoVaule)) {
      return message.warning('请输入正确格式');
    }
    const a = this.state.cards;
    const item = {
      money: this.state.denoVaule,
      items: [],
    };
    a.push(item);
    this.state.cards = a;
    this.setState({
      cards: a,
    });
    this.setVisible('addDenoVisible', false);
  };

  //添加密码框
  addCDKBox = m => {
    const b = {
      password: '',
      picture: '',
    };
    const index = this.state.cards.findIndex(item => {
      return item.money === m;
    });
    if (index >= 0) {
      const c = this.state.cards;
      c[index].items.push(b);
      this.setState({
        cards: c,
      });
    }
    this.calcuMoney();
  };

  //删除密码框
  delCDKBox = (m, i) => {
    const index = this.state.cards.findIndex(item => {
      return item.money === m;
    });
    if (index >= 0) {
      const c = this.state.cards;
      c[index].items.splice(i, 1);
      this.setState({
        cards: c,
      });
    }
    this.calcuMoney();
  };

  //只有图片函数类
  onlyPic = (info, item, index) => {
    const c = this.state.cards;
    c[index].items.push({
      picture: info,
    });
    this.setState({
      cards: c,
    });
  };

  changeAppealPic = (info, prefix, index) => {
    const c = this.state.cards;
    c[index].items = [];
    info.fileList.map(file => {
      if (!file.response) {
        return false;
      }
      c[index].items.push({
        picture: `${prefix}${file.response.hash}`,
      });
      return null;
    });

    this.setState({
      cards: c,
    });
    this.calcuMoney();
  };

  remove = (info, index, item) => {
    const c = this.state.cards;
  };

  //卡密数据获取
  denoIptValueChange = (e, i, index) => {
    const a = this.state.cards;
    a[index].items[i].password = e.target.value;
    this.setState({
      cards: a,
    });
  };

  //卡图获取
  getUrl = (url, index, i) => {
    const a = this.state.cards;
    a[index].items[i].picture = url;
    this.setState({
      cards: a,
    });
  };
  //凭证获取
  getReceipt = (url, index) => {
    const a = this.state.cards;
    a[index].receipt = url;
    this.setState({
      cards: a,
    });
  };

  addAdvertising = () => {
    this.data.cards = this.state.cards;
    if (this.data.cards.length === 0) {
      message.warning('请输入礼品卡信息');
      return false;
    }
    this.props
      .dispatch({
        type: 'card/addSellAd',
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

  calcuMoney = () => {
    let a = 0;
    this.state.cards.map(card => {
      a += card.money * card.items.length;
      return null;
    });
    this.setState({
      totalMoney: a,
    });
    console.log(a);
  };

  setVisible = (type, visible) => {
    this.setState({
      [type]: visible,
    });
  };

  render() {
    if (!CONFIG.card_type) {
      return false;
    }
    const { cardType } = this.state;
    const items = this.props.card.terms;

    const addDenoBox = (
      <div className={styles.denoBox}>
        <span className={styles.left}>面额:</span>
        <div className={styles.right}>
          <Input
            placeholder="请输入面额"
            defaultValue=""
            onChange={e => {
              this.setVisible('denoVaule', e.target.value);
            }}
            onPressEnter={() => this.addDeno()}
          />
        </div>
        <div className={styles.btnBox}>
          <Button
            onClick={() => {
              this.setVisible('addDenoVisible', false);
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              this.addDeno();
            }}
            type="primary"
          >
            确定
          </Button>
        </div>
      </div>
    );

    const breadcrumbList = [
      { title: '广告管理', href: '/ad/my' },
      { title: '礼品卡', href: '/card/market' },
      { title: '创建出售' },
    ];

    const { terms } = this.props.card || {};

    return (
      <div className={styles.addSale}>
        <PageHeaderLayout breadcrumbList={breadcrumbList}>
          {/*
          <SellForm terms={terms} initialValues={{card_type: 3}}/>
           */}

          <ul className={styles.submitTable}>
            <li>
              <span className={styles.tableLeft}>类型：</span>
              <Select
                style={{ width: 90 }}
                defaultValue={cardType[0].name}
                onChange={this.selectCardType}
              >
                {CONFIG.card_type.filter(c => c.valid).map(t => {
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
              <InputNumber defaultValue={1} min={1} onChange={e => this.unitPriceChange(e)} />
            </li>
            <li>
              <span className={styles.tableLeft}>保障时间：</span>
              <Select
                style={{ width: 90 }}
                defaultValue={CONFIG.guarantee_time[0]}
                onChange={this.selectGuaTime}
              >
                {CONFIG.guarantee_time.map(t => {
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

              <Select defaultValue="无" style={{ width: 90 }} onChange={this.selectTermTitle}>
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

            <li>
              <span className={styles.tableLeft}>包含：</span>
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
              <span className={styles.tableLeft}>&nbsp;</span>
              <Popover
                key={this.state.date}
                placement="topRight"
                content={addDenoBox}
                title="添加面额"
                trigger="click"
                visible={this.state.addDenoVisible}
                onVisibleChange={() => {
                  this.setVisible('addDenoVisible', !this.state.addDenoVisible);
                }}
              >
                <Button
                  style={{ width: '260px', borderStyle: 'dashed' }}
                  onClick={() => {
                    this.setState({
                      date: new Date(),
                    });
                  }}
                >
                  + 添加面额
                </Button>
              </Popover>
            </li>
          </ul>

          {this.state.passwordType === 1
            ? this.state.cards.map((item, index) => {
                return (
                  <div key={index + 'cards'} className={styles.denomination}>
                    <header>
                      <span>{item.money}</span>
                      面额 （{item.items.length}）
                      <div>
                        {/*<Button>导入</Button>*/}
                        <Button>删除</Button>
                      </div>
                    </header>
                    <section>
                      <div className={styles.left}>
                        <span>卡密：</span>
                      </div>
                      <div className={styles.right}>
                        {item.items.map((card, i) => {
                          return (
                            <div key={index + i} className={styles.iptBox}>
                              <div className={styles.input}>
                                <Input
                                  type="text"
                                  value={this.state.cards[index].items[i].password}
                                  onChange={e => {
                                    this.denoIptValueChange(e, i, index);
                                  }}
                                />
                              </div>
                              <div className={styles.icon}>
                                <Icon
                                  onClick={() => {
                                    this.delCDKBox(item.money, i);
                                  }}
                                  type="delete"
                                />
                              </div>
                            </div>
                          );
                        })}

                        <div className={styles.addBtn}>
                          <Button
                            style={{ width: '580px', borderStyle: 'dashed' }}
                            onClick={() => {
                              this.addCDKBox(item.money);
                            }}
                          >
                            + 添加卡密
                          </Button>
                        </div>
                      </div>
                    </section>
                  </div>
                );
              })
            : null}

          {this.state.passwordType === 2
            ? this.state.cards.map((item, index) => {
                return (
                  <OnlyPicture
                    key={index}
                    item={item}
                    styles={styles}
                    index={index}
                    changeAppealPic={(info, prefix) => this.changeAppealPic(info, prefix, index)}
                    //onlyPic={info => this.onlyPic(info, item, index)}
                    remove={info => this.remove(info, index, item)}
                    getReceipt={url => this.getReceipt(url, index)}
                  />
                );
              })
            : null}

          {this.state.passwordType === 3
            ? this.state.cards.map((item, index) => {
                return (
                  <PicWithText
                    key={index}
                    item={item}
                    styles={styles}
                    index={index}
                    addCDKBox={this.addCDKBox}
                    delCDKBox={this.delCDKBox}
                    changePTPass={this.denoIptValueChange}
                    getUrl={(url, i) => this.getUrl(url, index, i)}
                    getReceipt={url => this.getReceipt(url, index)}
                  />
                );
              })
            : null}

          {this.state.cards.length ? (
            <div>
              <div className={styles.amount}>
                <h4>
                  <span>总面额：</span>
                  <span>{this.state.totalMoney}</span>
                </h4>
                <h5>
                  <span>总价：</span>
                  <span>{this.state.totalMoney * this.data.unit_price}RMB</span>
                </h5>
              </div>
            </div>
          ) : null}
          <div className={styles.footer}>
            <Button onClick={() => this.props.dispatch(routerRedux.goBack())}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                this.addAdvertising();
              }}
              loading={this.props.addSelleCard}
            >
              发布
            </Button>
          </div>
        </PageHeaderLayout>
      </div>
    );
  }
}
