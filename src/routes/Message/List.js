import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import { map } from 'lodash';
import { Table, Tabs, Button, Icon, Card, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getMessageContent } from '../../utils/utils';
import styles from './Message.less';

const TabPane = Tabs.TabPane;

@connect(({ message, loading }) => ({
  data: message.msgData,
  loading: loading.models.message,
}))
export default class List extends Component {
  constructor(props) {
    super();

    this.state = {
      type: 'trade',
      status: '',
      selectedRows: [],
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'message/fetchMessageList',
    });
  }

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '70%',
      render: (val, row) => {
        if (row.id === -1)
          return (
            <a onClick={() => this.readMsg(row)} className={row.status === 1 ? styles.read : ''}>
              {row.msg_type === 1 ? <Icon type="file-text" /> : <Icon type="bell" />}{' '}
              {row.msg_type === 1 ? val : getMessageContent(row)}
            </a>
          );
        else
          return (
            <Link to={`/message/info-detail/${row.id}`}>
              <span className={row.status === 1 ? styles.read : ''}>
                <Icon type="file-text" /> {val}
              </span>
            </Link>
          );
      },
    },
    {
      title: '发布时间',
      dataIndex: 'publish_at',
      width: '30%',
      align: 'right',
      render: val => (
        <span>{val ? moment(new Date(val * 1000)).format('YYYY-MM-DD HH:mm:ss') : '-'}</span>
      ),
    },
  ];

  readMsg = row => {
    const { dispatch } = this.props;

    if (row.status === 0) {
      dispatch({
        type: 'message/readMessage',
        payload: { all: false, id: row.id },
        callback: () => {
          this.changeNotice();
          this.showMsg(row);
        },
      });
    } else {
      this.showMsg(row);
    }
  };

  changeNotice = () => {
    const { dispatch } = this.props;

    this.props.dispatch({
      type: 'global/fetchNotices',
      payload: { status: 0 },
    });
  };

  showMsg = item => {
    const { dispatch } = this.props;

    if (item.msg_type === 1) {
      this.props.dispatch(
        routerRedux.push(`/message/info-detail/${item.content && item.content.ref_id}`)
      );
    } else if ([11, 12, 21, 22].indexOf(item.msg_type) >= 0) {
      /* Modal.success({
        // title: item.title,
        title: '提示',
        content: getMessageContent(item),
        onOk: () => {},
      }); */
      this.props.dispatch(routerRedux.replace(`/user-center/index`));
    } else if ([31, 32, 33, 34].indexOf(item.msg_type) >= 0) {
      this.props.dispatch(routerRedux.replace(`/wallet?activeKey=3`));
    } else if ([41, 42].indexOf(item.msg_type) >= 0) {
      this.props.dispatch(routerRedux.replace(`/ad/terms`));
    } else if (item.msg_type >= 100 && item.msg_type <= 114) {
      //todo redict to order detail
      if (item.content && item.content.goods_type === 1)
        this.props.dispatch(routerRedux.replace(`/itunes/order/${item.content.order_id}`));
      else if (item.content && item.content.goods_type === 2) {
        this.props.dispatch(routerRedux.replace(`/card/deal-line/${item.content.order_id}`));
      }
    } else if ([131, 132, 133].indexOf(item.msg_type) >= 0) {
      this.props.dispatch(routerRedux.replace(`/ad/my`));
    } else {
      // todo
      console.log(item.msg_type);
    }

    this.props.dispatch({
      type: 'global/fetchNotices',
      payload: { status: 0, type: 3 },
    });
  };

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, getValue } = this.props;
    const { formValues } = this.state;

    const { status, type } = this.state;
    const msg_type = CONFIG.message.types[type].value;
    // console.log(msg_type)
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    // const type = e.target.value;
    // this.setState({
    //   type,
    // });
    console.log(status, type);
    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
      status,
      msg_type,
      // ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'message/fetchMessageList',
      payload: params,
    });
  };

  handleChangeType = type => {
    console.log(CONFIG.message.types[type].value);
    this.props.dispatch({
      type: 'message/fetchMessageList',
      payload: {
        msg_type: CONFIG.message.types[type].value,
      },
    });
    this.setState({
      type,
    });
  };

  handleChangeStatus = value => {
    const status = value;
    // console.log(status);
    this.props.dispatch({
      type: 'message/fetchMessageList',
      payload: {
        status: value,
      },
    });
    this.setState({
      status,
    });
  };

  render() {
    const { data: { list, pagination }, loading } = this.props;
    const { type, status } = this.state;

    // console.log(this.props)
    // console.log(type);
    return (
      <PageHeaderLayout title="消息中心">
        <div className={styles.message_bgc}>
          <Tabs activeKey={type} onChange={this.handleChangeType}>
            {map(CONFIG.message.types, (item, value) => <TabPane tab={item.text} key={value} />)}
          </Tabs>
          <Tabs activeKey={status} onChange={this.handleChangeStatus}>
            <TabPane tab="全部" key="" />
            {map(CONFIG.message.status, (text, value) => (
              <TabPane tab={text && text} key={+value} />
            ))}
          </Tabs>
          <Card bordered={false} className={styles.message_list}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={this.columns}
              pagination={pagination}
              onChange={this.handleTableChange}
              showHeader={false}
              rowClassName={(r, index) => {
                return r.status === 1 ? styles.read : '';
              }}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
