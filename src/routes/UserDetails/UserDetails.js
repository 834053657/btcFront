import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Icon, Table, Button, Modal, Radio, List, Avatar } from 'antd';
import { map } from 'lodash';

import DescriptionList from 'components/DescriptionList';
import BlankLayout from '../../layouts/BlankLayout';
import styles from './UserDetails.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import ReportForm from './Form/ReportForm';

const { Description } = DescriptionList;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const typeMap = {
  '1': '购买',
  '2': '出售',
};

@connect(({ userDetails, loading }) => ({
  ...userDetails,
  loading: loading.models.message,
}))
export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: '',
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userDetails/fetchDetails',
    });
  }

  handleLogin = () => {
    return <a>登录</a>;
  };
  handleSign = () => {
    return <a>注册</a>;
  };
  handleUserName = () => {
    const { userMessage } = this.props;
    return <a>{userMessage.nickname}</a>;
  };
  handleTrust = () => {
    const { is_trust } = this.props.userMessage;
    console.log(is_trust);
    const { id } = this.props.userMessage;
    const { dispatch } = this.props;
    dispatch({
      type: 'userDetails/submitTrustUser',
      payload: {
        id,
        is_trust,
      },
    });
  };

  UserMessage = () => {
    const { userMessage = {}, trader = {} } = this.props;

    // const { loading } = this.props
    return (
      <div className={styles.UserMassage}>
        <div className={styles.UserName}>
          <span style={{ margin: '30px' }}>
            <img
              style={{ width: '100px', borderRadius: '50%' }}
              src={userMessage.avatar}
              // src="http://images.91jianke.com/default_avatar_11.png"
              alt=""
            />
          </span>
          <span>
            <span style={{ fontSize: '30px', margin: '10px' }}>{userMessage.nickname}</span>
            <a>
              {userMessage.online === true ? (
                <a className={styles.tipGreen}>{}</a>
              ) : (
                <a className={styles.tipRed}>{}</a>
              )}
            </a>
            <a className={styles.report} onClick={this.handleShowReport}>
              <Icon type="flag" />举报
            </a>
          </span>
        </div>

        <div>
          {userMessage.is_trust === true ? (
            <div className={styles.trust} onClick={this.handleTrust.bind(this)}>
              <Icon type="heart" style={{ color: '#fff', marginRight: '5px' }} />信任
            </div>
          ) : (
            <div className={styles.UNtrust} onClick={this.handleTrust.bind(this)}>
              <Icon type="heart" style={{ color: '#fff', marginRight: '5px' }} />信任
            </div>
          )}
          {userMessage.online === true ? (
            ''
          ) : (
            <div style={{ margin: '30px' }}>
              请 {this.handleLogin()} 或 {this.handleSign()} ， 将 {this.handleUserName()}{' '}
              设置为值得信任。30秒注册~
            </div>
          )}
        </div>
        <DescriptionList style={{ margin: '30px' }}>
          <Description term="国家" className={styles.UserStyle}>
            <img
              style={{ width: '30px', height: '20px' }}
              src="https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=f7623b467e8b4710ce2ffacafbf5a4c0/1b4c510fd9f9d72a2d9ad37ad82a2834359bbbdf.jpg"
              alt=""
            />
          </Description>
          <Description term="交易量" className={styles.UserStyle}>
            {trader.trade_volume ? trader.trade_volume : '-'}
          </Description>
          <Description term="已确认的交易次数" className={styles.UserStyle}>
            {trader.trade_times ? trader.trade_times : '-'}
          </Description>
          <Description term="评价得分" className={styles.UserStyle}>
            {trader.rating_ratio ? trader.rating_ratio : '-'}
          </Description>
          <Description term="第一次购买" className={styles.UserStyle}>
            {trader.first_trade_at
              ? moment(trader.first_trade_at * 1000).format('YYYY-MM-DD HH:mm')
              : '-'}
          </Description>
          <Description term="账户已创建" className={styles.UserStyle}>
            哈萨克斯坦
          </Description>
          <Description term="最后一次上线" className={styles.UserStyle}>
            {userMessage.last_login_at
              ? moment(userMessage.last_login_at * 1000).format('YYYY-MM-DD HH:mm')
              : '-'}
          </Description>
          <Description term="语言" className={styles.UserStyle}>
            哈萨克斯坦
          </Description>
          <Description term="信任" className={styles.UserStyle}>
            哈萨克斯坦
          </Description>
        </DescriptionList>
      </div>
    );
  };

  payWay = text => {
    return map(text, (item, index) => {
      if (item === 'weixin') {
        return <Icon type="wechat" style={{ margin: '0 5px' }} />;
      } else if (item === 'bank') {
        return <Icon type="alipay-circle" style={{ margin: '0 5px' }} />;
      }
    });
  };
  handleBuy = () => {
    console.log('买入');
  };
  handleSell = () => {
    console.log('卖出');
  };

  columns = [
    {
      title: '付款方式',
      dataIndex: 'payment_methods',
      width: '40%',
      render: text => {
        return <span>{this.payWay(text)}</span>;
      },
    },
    {
      title: '价格',
      dataIndex: 'trading_price',
      // width: '15%',
      render: text => {
        return <div>{text}</div>;
      },
    },
    {
      title: '',
      dataIndex: '3',
      width: '20%',
      render: () => {
        return (
          <div>
            {this.state.type === '1' ? (
              <Button type="primary" className={styles.btnstyle} onClick={this.handleBuy}>
                买入
              </Button>
            ) : (
              <Button type="primary" className={styles.btnstyle} onClick={this.handleSell}>
                卖出
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  handleTypeChange = e => {
    const type = e.target.value;
    this.setState({
      type,
    });
  };

  hadleShowAll = () => {};
  UserComment = () => {
    const { comment } = this.props;

    return (
      <div>
        <DescriptionList col={1} style={{ margin: '30px' }}>
          {map(comment, (item, index) => {
            return (
              <div style={{ width: '40%', borderBottom: '1px solid #ccc' }}>
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Icon
                        style={{ fontSize: 39 }}
                        type={item.rating_type === 1 ? 'like' : 'dislike'}
                      />
                    }
                    title={
                      <a href="https://ant.design">
                        {item.created_at
                          ? moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')
                          : '-'}
                      </a>
                    }
                    description={item.content}
                  />
                </List.Item>
              </div>
            );
          })}
        </DescriptionList>
        <a className={styles.All} onClick={this.hadleShowAll}>
          显示所有用户评论
        </a>
      </div>
    );
  };

  handleShowReport = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  handleSubmit = e => {
    // this.props.dispatch({
    //   type:'',
    //   payload:{
    //     ...value
    //   }
    // })
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    return (
      <div>
        <Modal
          title="举报用户"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={false}
        >
          <ReportForm onSubmit={this.handleSubmit} onCancel={this.handleCancel} />
        </Modal>
      </div>
    );
  };
  handleChange = id => {
    console.log(id);
    // this.props.dispatch({
    //   type:'',
    //   payload:{
    //     id
    //   }
    // })
  };

  render() {
    const { list = [] } = this.props;

    const { pagination = {}, loading } = this.props;
    const { type } = this.state;
    const { visible } = this.state;
    return (
      <PageHeaderLayout title="用户详情页">
        <div className={styles.background}>
          <div style={{ margin: '30px 0' }}>
            <h2>用户信息</h2>
          </div>
          {this.UserMessage()}
          <div>
            <div style={{ margin: '30px 0' }}>
              <h2>用户的其它交易广告</h2>
            </div>
            <div style={{ width: '90%', paddingLeft: '10%' }}>
              <div className={styles.type_box}>
                <RadioGroup
                  size="large"
                  value={type}
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
              <div>
                {type === '1' ? (
                  <Table
                    loading={loading}
                    rowKey={record => record.id}
                    dataSource={list.buy}
                    columns={this.columns}
                    pagination={false}
                    onChange={this.handleTableChange}
                    footer={null}
                  />
                ) : (
                  <Table
                    loading={loading}
                    rowKey={record => record.id}
                    dataSource={list.sell}
                    columns={this.columns}
                    pagination={false}
                    onChange={this.handleTableChange}
                    footer={null}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <div style={{ margin: '80px 0 30px' }} className={styles.comment}>
              <h2>评论</h2>
            </div>
          </div>
          <div>{this.UserComment()}</div>
        </div>
        {visible && this.showModal(visible)}
      </PageHeaderLayout>
    );
  }
}
