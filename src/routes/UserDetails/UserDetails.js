import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Icon, Table, Button, Modal, Radio, List, Badge } from 'antd';
import { map } from 'lodash';
import { Link, routerRedux } from 'dva/router';

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

const payMethod = {
  alipay: <Icon type="alipay-circle" />,
  bank: <Icon type="wallet" />,
  wechat: <Icon type="wechat" />,
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
      type: '1',
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { params: { ad_no } } = this.props.match || {};
    this.props.dispatch({
      type: 'userDetails/fetchDetails',
      payload: {
        userid: ad_no,
      },
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

  handleToTrust = e => {
    console.log(e);
    const { params: { userid } } = this.props.match || {};

    this.props.dispatch({
      type: 'userDetails/submitTrustUser',
      payload: {
        target_uid: userid,
        type: e,
        content: e,
      },
    });
    this.setState({
      visible: false,
    });
  };
  UserMessage = () => {
    const { userMessage = {}, trader = {} } = this.props;
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
            <Badge
              offset={[13, 0]}
              style={{ width: 8, height: 8 }}
              dot
              status={userMessage.online ? 'success' : 'default'}
            >
              <b style={{ fontSize: '30px', margin: '10px' }}>{userMessage.nickname}</b>
            </Badge>
            <a className={styles.report} onClick={this.handleShowReport}>
              <Icon type="flag" />举报
            </a>
          </span>
        </div>

        <div>
          {userMessage.is_trust === true ? (
            <Button className={styles.trust} onClick={this.handleToTrust.bind(this, 2)} type="1">
              <Icon type="heart" style={{ color: '#CFCFCF', marginRight: '5px' }} />取消信任
            </Button>
          ) : (
            <Button className={styles.UNtrust} onClick={this.handleToTrust.bind(this, 1)}>
              <Icon type="heart" style={{ color: '#fff', marginRight: '5px' }} />信任
            </Button>
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
            {/*<img*/}
            {/*style={{ width: '30px', height: '20px' }}*/}
            {/*src=""*/}
            {/*alt=""*/}
            {/*/>*/}
            {userMessage.country_code}
          </Description>
          <Description term="交易量" className={styles.UserStyle}>
            {trader.trade_volume ? trader.trade_volume : '-'}
          </Description>
          <Description term="已确认的交易次数" className={styles.UserStyle}>
            {trader.trade_times ? trader.trade_times : '-'}
          </Description>
          <Description term="评价得分" className={styles.UserStyle}>
            {trader.good_ratio ? trader.good_ratio : '-'}
          </Description>
          <Description term="第一次购买" className={styles.UserStyle}>
            {trader.first_trade_at
              ? moment(trader.first_trade_at * 1000).format('YYYY-MM-DD HH:mm')
              : '-'}
          </Description>
          <Description term="账户创建时间" className={styles.UserStyle}>
            {userMessage.last_login_at
              ? moment(userMessage.created_at * 1000).format('YYYY-MM-DD HH:mm')
              : '-'}
          </Description>
          <Description term="最后一次上线" className={styles.UserStyle}>
            {userMessage.last_login_at
              ? moment(userMessage.last_login_at * 1000).format('YYYY-MM-DD HH:mm')
              : '-'}
          </Description>
          <Description term="语言" className={styles.UserStyle}>
            {userMessage.country_code}
          </Description>
          <Description term="信任" className={styles.UserStyle}>
            {userMessage.is_trust ? (
              <span>{userMessage.is_trust === true ? '是' : '否'}</span>
            ) : (
              '-'
            )}
          </Description>
        </DescriptionList>
      </div>
    );
  };

  // payWay = text => {
  //   return map(text, (item, index) => {
  //     if (item === 'weixin') {
  //       return <Icon type="wechat" style={{ margin: '0 5px' }} />;
  //     } else if (item === 'bank') {
  //       return <Icon type="alipay-circle" style={{ margin: '0 5px' }} />;
  //     }
  //   });
  // };
  // handleBuy = () => {
  //   console.log('买入');
  // };
  // handleSell = () => {
  //   console.log('卖出');
  // };

  columns = [
    {
      title: '付款方式',
      dataIndex: 'payment_methods',
      render: (_, row) => {
        return (
          <div>
            {map(row.payment_methods, item => {
              return (
                <span className={styles.pay_method} key={item}>
                  {item && payMethod[item] ? payMethod[item] : '-'}
                </span>
              );
            })}
          </div>
        );
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
      render: row => {
        const { type } = this.state;
        return (
          <Fragment>
            <Link to={type === '1' ? `/trade/detail/${row.ad_id}` : ''}>
              <Button type="primary">{type ? typeMap[type] : '-'}</Button>
            </Link>
          </Fragment>
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
    // console.log(this.props)
    const { comment } = this.props;

    return (
      <div>
        <DescriptionList col={1} style={{ margin: '30px' }}>
          {map(comment, (item, index) => {
            return (
              <List.Item key={index} style={{ width: '40%', borderBottom: '1px solid #ccc' }}>
                <List.Item.Meta
                  avatar={
                    <Icon
                      style={{ fontSize: 39 }}
                      type={item.rating_type === 1 ? 'like' : 'dislike'}
                    />
                  }
                  title={
                    <a>
                      {item.created_at
                        ? moment(item.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')
                        : '-'}
                    </a>
                  }
                  description={item.content}
                />
              </List.Item>
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
  // handleSubmit = e => {
  //   this.props.dispatch({
  //     type:'',
  //     payload:{
  //
  //     }
  //   })
  //   this.setState({
  //     visible: false,
  //   });
  // };

  showModal = () => {
    return (
      <div>
        <Modal
          title="举报用户"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={false}
        >
          <ReportForm onSubmit={this.handleToTrust.bind(this.value)} onCancel={this.handleCancel} />
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
                    rowKey={record => record.ad_id}
                    dataSource={list.buy}
                    columns={this.columns}
                    pagination={false}
                    onChange={this.handleTableChange}
                    footer={null}
                  />
                ) : (
                  <Table
                    loading={loading}
                    rowKey={record => record.ad_id}
                    dataSource={list.sell}
                    columns={this.columns}
                    pagination={false}
                    onChange={this.handleTableChange}
                    footer={null}
                  />
                )}
              </div>
              <Link to="/trade/index">
                {' '}
                <div className={styles.showAllAd}>显示所有用户网上购买比特币的广告</div>
              </Link>
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
