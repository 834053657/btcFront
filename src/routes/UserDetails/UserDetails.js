import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';

import { Icon, Table, Button, Modal, Radio, List, Badge } from 'antd';
import { map } from 'lodash';
import { Link, routerRedux } from 'dva/router';
import DescriptionList from 'components/DescriptionList';
import ConfirmModal from '../../components/ConfirmModal';
import BlankLayout from '../../layouts/BlankLayout';
import styles from './UserDetails.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import ReportForm from './Form/ReportForm';
import { getPayIcon } from '../../utils/utils';

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
      type: '1',
      disabled: false,
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

  handleUserName = () => {
    const { userMessage } = this.props;
    return <a>{userMessage.nickname}</a>;
  };

  handleToTrust = type => {
    const { loading } = this.state;
    const { params: { uid } } = this.props.match || {};
    this.props.dispatch({
      type: 'userDetails/submitRating',
      payload: {
        target_uid: uid,
        type,
      },
    });

    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
    }, 1000);
  };

  handleSubmitReport = (err, values) => {
    if (!err) {
      const { dispatch, match: { params = {} } } = this.props;
      dispatch({
        type: 'userDetails/submitRating',
        payload: { ...values, target_uid: params.uid, type: 3 },
        callback: this.handleHideReport,
      });
    }
  };

  UserMessage = () => {
    const { userMessage = {}, trader = {} } = this.props;
    const { disabled } = this.state;
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
            <Button
              className={styles.trust}
              onClick={this.handleToTrust.bind(this, 2)}
              type="1"
              loading={this.state.loading}
            >
              <Icon type="heart-o" style={{ color: '#ccc', marginRight: '5px' }} />取消信任
            </Button>
          ) : (
            <Button
              className={styles.UNtrust}
              onClick={this.handleToTrust.bind(this, 1)}
              loading={this.state.loading}
            >
              <Icon type="heart-o" style={{ color: '#ccc', marginRight: '5px' }} />信任
            </Button>
          )}
          {userMessage.online === true ? (
            ''
          ) : (
            <div style={{ margin: '30px' }}>
              请 <Link to="/user/login">登录</Link> 或 <Link to="/user/register">注册</Link> ， 将{' '}
              {this.handleUserName()} 设置为值得信任。30秒注册~
            </div>
          )}
        </div>
        <DescriptionList style={{ margin: '30px' }}>
          <Description term="国家" className={styles.UserStyle}>
            {userMessage.country_code && CONFIG.countrysMap[userMessage.country_code]
              ? CONFIG.countrysMap[userMessage.country_code].name
              : '-'}
            {/*{CONFIG.countrysMap[userMessage.country_code].name ? CONFIG.countrysMap[userMessage.country_code].name : '-'}*/}
            {}
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
                  <Icon key={item} type={getPayIcon(item)} />
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
  handleHideReport = () => {
    this.setState({
      visible: false,
    });
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

        <ConfirmModal
          visible={this.state.visible}
          title="举报"
          onSubmit={this.handleSubmitReport}
          onCancel={this.handleHideReport}
        />
      </PageHeaderLayout>
    );
  }
}
