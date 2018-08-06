import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Icon, Table, Button, Avatar, Radio, List, Badge } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { map, filter, get } from 'lodash';
import { Link } from 'dva/router';
import DescriptionList from 'components/DescriptionList';
import ConfirmModal from '../../components/ConfirmModal';
import styles from './UserDetails.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getPayIcon } from '../../utils/utils';

const { Description } = DescriptionList;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const typeMap = {
  '1': <FM id='userDetails.buy_title' defaultMessage='购买' />,
  '2': <FM id='userDetails.sell_title' defaultMessage='出售' />,
};

@connect(({ userDetails, loading, user }) => ({
  ...userDetails,
  currentUser: user.currentUser,
  loading: loading.effects['userDetails/fetchDetails'],
  loading_trust: loading.effects['userDetails/submitRating'],
}))
export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      type: '1',
      comment_visbile: true,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { params: { uid } } = this.props.match || {};
    this.props.dispatch({
      type: 'userDetails/fetchDetails',
      payload: {
        target_uid: uid,
      },
    });
  }

  checkLogined = () => {
    const { user, token } = this.props.currentUser || {};
    return !!(user && token);
  };


  handleToTrust = type => {
    const { params: { uid } } = this.props.match || {};
    this.props.dispatch({
      type: 'userDetails/submitRating',
      payload: {
        target_uid: uid,
        type,
      },
    });

    // this.setState({ loading: true });
    // setTimeout(() => {
    //   this.setState({ loading: false });
    // }, 1000);
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
    const { userMessage = {}, trader = {}, } = this.props;
    const uid = get(this.props, 'currentUser.user.id');
    const id = get(this.props, 'match.params.uid');

    const { online, avatar, nickname } = userMessage || {};
    return (
      <div className={styles.UserMassage}>
        <div>
          <Badge status={online ? 'success' : 'default'} offset={[60, -5]} dot>
            <Avatar className={styles.max_avatar} size="large" src={avatar} />
          </Badge>
          <span style={{ fontSize: 28, marginLeft: 15 }}>{nickname}</span>

          {
            this.checkLogined() && uid !== +id ? (
              <a className={styles.report} onClick={this.handleShowReport}>
                <Icon type="flag" /><FM id='userDetails.report_user' defaultMessage='举报' />
              </a>
            ): null
          }
        </div>

        <div className={styles.user_trust}>
          {this.checkLogined() ? (
            userMessage.is_trust === true ? (
              <Button
                className={styles.trust}
                onClick={this.handleToTrust.bind(this, 2)}
                loading={this.props.loading_trust}
              >
                <Icon type="heart-o" style={{ color: '#ccc', marginRight: '5px' }} /><FM id='userDetails.cancel_trust' defaultMessage='取消信任' />
              </Button>
            ) : (
              uid !== +id ? (
                <Button
                  type="primary"
                  className={styles.UNtrust}
                  onClick={this.handleToTrust.bind(this, 1)}
                  loading={this.props.loading_trust}
                >
                  <Icon type="heart-o" style={{ color: '#EAEAEA', marginRight: '5px' }} /><FM id='userDetails.to_trust' defaultMessage='信任' />
                </Button>
              ): null
            )
          ) : (
            <div style={{ margin: '30px' }}>
              <FM id='userDetails.please' defaultMessage='请' />
              <Link to="/user/login"><FM id='userDetails.login_in' defaultMessage='登录' /></Link>
              <FM id='userDetails.or' defaultMessage='或' />
              <Link to="/user/register"><FM id='userDetails.sign_in' defaultMessage='注册' /></Link> ，
              <FM id='userDetails.set_user_trust' defaultMessage='将 {name} 设置为值得信任。30秒注册~' values={{name:this.props.userMessage.nickname}} />
            </div>
          )}
        </div>
        <DescriptionList style={{ margin: '15px' }}>
          <Description term={<FM id='userDetails.country' defaultMessage='国家' />} className={styles.UserStyle}>
            {userMessage.country_code && CONFIG.countrysMap[userMessage.country_code]
              ? CONFIG.countrysMap[userMessage.country_code].name
              : '-'}
            {/*{CONFIG.countrysMap[userMessage.country_code].name ? CONFIG.countrysMap[userMessage.country_code].name : '-'}*/}
            {}
          </Description>
          <Description term={<FM id='userDetails.trade_volume' defaultMessage='交易量' />} className={styles.UserStyle}>
            {trader.trade_volume ? trader.trade_volume : '-'}
          </Description>
          <Description term={<FM id='userDetails.trade_times' defaultMessage='已确认的交易次数' />} className={styles.UserStyle}>
            {trader.trade_times ? trader.trade_times : '-'}
          </Description>
          <Description term={<FM id='userDetails.good_ratio' defaultMessage='好评率' />} className={styles.UserStyle}>
            {trader.good_ratio ? trader.good_ratio : '-'}
          </Description>
          <Description term={<FM id='userDetails.first_trade_at' defaultMessage='第一次购买' />} className={styles.UserStyle}>
            {trader.first_trade_at
              ? moment(trader.first_trade_at * 1000).format('YYYY-MM-DD HH:mm')
              : '-'}
          </Description>
          <Description term={<FM id='userDetails.created_at' defaultMessage='账户创建时间' />} className={styles.UserStyle}>
            {userMessage.created_at
              ? moment(userMessage.created_at * 1000).format('YYYY-MM-DD HH:mm')
              : '-'}
          </Description>
          <Description term={<FM id='userDetails.last_login_at' defaultMessage='最后一次上线' />} className={styles.UserStyle}>
            {userMessage.last_login_at
              ? moment(userMessage.last_login_at * 1000).format('YYYY-MM-DD HH:mm')
              : '-'}
          </Description>
          <Description term={<FM id='userDetails.language_' defaultMessage='语言' />} className={styles.UserStyle}>
            {userMessage.country_code}
          </Description>
          <Description term={<FM id='userDetails.trust_is' defaultMessage='信任' />} className={styles.UserStyle}>
            <span>{userMessage.is_trust === true ? <FM id='userDetails.yes_' defaultMessage='是' /> : <FM id='userDetails.no_' defaultMessage='否' />}</span>
          </Description>
        </DescriptionList>
      </div>
    );
  };

  renderColumns = () => {
    let columns = [
      {
        title: <FM id='userDetails.payment_methods' defaultMessage='付款方式' />,
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
        title: <FM id='userDetails.trading_price' defaultMessage='价格' />,
        dataIndex: 'trading_price',
        // width: '15%',
        render: text => {
          return <div>{text}</div>;
        },
      },
      {
        title: <FM id='userDetails.condition_' defaultMessage='限额' />,
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
        title: <FM id='userDetails.operator' defaultMessage='操作' />,
        render: row => {
          const { type } = this.state;
          const uid = get(this.props, 'currentUser.user.id');
          const id = get(this.props, 'match.params.uid');
          return (
            <Fragment>
              <Link to={type === '1' ? `/trade/detail/${row.ad_id}` : `/trade/detail/${row.ad_id}`}>
                <Button type="primary" disabled={+uid === +id}>{type ? typeMap[type] : '-'}</Button>
              </Link>
            </Fragment>
          );
        },
      },
    ];
    if (this.state.type === '2') {
      columns = filter(columns, item => item.dataIndex !== 'payment_methods');
    }
    return columns;
  };

  handleTypeChange = e => {
    const type = e.target.value;
    this.setState({
      type,
    });
  };

  handleShowAll = () => {
    const { comment_visbile } = this.state;
    this.setState({
      comment_visbile: !comment_visbile,
    });
  };

  UserComment = () => {
    // console.log(this.props)
    const { comment } = this.props;
    const { comment_visbile } = this.state;

    return (
      <div>
        <DescriptionList col={1} style={{ margin: '30px' }}>
          {map(comment, (item, index) => {
            return comment_visbile === true ? (
              index < 3 ? (
                <List.Item key={index} style={{ width: '100%', borderBottom: '1px solid #ccc' }}>
                  <List.Item.Meta
                    avatar={
                      <Icon
                        style={{ fontSize: 39 }}
                        type={item.star && item.star < 4 ? 'like' : 'dislike'}
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
              ) : null
            ) : (
              <List.Item key={index} style={{ width: '100%', borderBottom: '1px solid #ccc' }}>
                <List.Item.Meta
                  avatar={
                    <Icon
                      style={{ fontSize: 39 }}
                      type={item.star && item.star < 4 ? 'like' : 'dislike'}
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
        <a className={styles.All} onClick={this.handleShowAll}>
          {comment_visbile === true ? <FM id='userDetails.show_all' defaultMessage='显示所有用户评论' /> : <FM id='userDetails.show_some' defaultMessage='显示部分用户评论' />}
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
    // console.log(this.props.userMessage);
    const { list = [] } = this.props;
    const { pagination = {}, loading } = this.props;
    const { type } = this.state;
    const { visible } = this.state;
    return (
      <PageHeaderLayout title={<FM id='userDetails.page_user_detail' defaultMessage='用户详情页' />}>
        <div className={styles.background}>
          <div style={{ margin: '30px 0' }}>
            <h3><FM id='userDetails.user_msg' defaultMessage='用户信息' /></h3>
          </div>
          {this.UserMessage()}
          <div>
            <div style={{ margin: '30px 0' }}>
              <h3><FM id='userDetails.user_other_ad' defaultMessage='用户的其它交易广告' /></h3>
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
                    columns={this.renderColumns()}
                    pagination={false}
                    onChange={this.handleTableChange}
                    footer={null}
                  />
                ) : (
                  <Table
                    loading={loading}
                    rowKey={record => record.ad_id}
                    dataSource={list.sell}
                    columns={this.renderColumns()}
                    pagination={false}
                    onChange={this.handleTableChange}
                    footer={null}
                  />
                )}
              </div>
              <Link to="/trade/index">
                {' '}
                <div className={styles.showAllAd}><FM id='userDetails.show_all_ad' defaultMessage='显示所有用户网上购买比特币的广告' /></div>
              </Link>
            </div>
          </div>
          <div>
            <div className={styles.comment}>
              <h3><FM id='userDetails.to_comment' defaultMessage='评论' /></h3>
            </div>
          </div>
          <div>{this.UserComment()}</div>
        </div>

        <ConfirmModal
          visible={this.state.visible}
          title={<FM id='userDetails.to_report' defaultMessage='举报' />}
          onSubmit={this.handleSubmitReport}
          onCancel={this.handleHideReport}
        />
      </PageHeaderLayout>
    );
  }
}
