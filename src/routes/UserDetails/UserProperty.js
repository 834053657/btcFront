import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Link, routerRedux } from 'dva/router';

import { Tabs, Table, Button, Modal, Radio, List, Avatar } from 'antd';
import { map } from 'lodash';
import DescriptionList from 'components/DescriptionList';
import BlankLayout from '../../layouts/BlankLayout';
import styles from './UserProperty.less';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const TabPane = Tabs.TabPane;
const { Description } = DescriptionList;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// @connect(({ userDetails, loading }) => ({
//   ...userDetails,
//   loading: loading.models.message,
// }))
export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // visible: false,
      // type: '',
    };
  }

  componentWillMount() {}

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'userDetails/fetchDetails',
    // });
  }

  columns = [
    {
      title: '日期',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'BTC',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '手续费',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '状态',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '确认次数',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '地址',
      dataIndex: 'age',
      key: 'age',
    },
  ];

  render() {
    const { list = [] } = this.props;
    const { pagination = {}, loading } = this.props;
    const { ID = [] } = this.state;

    return (
      <PageHeaderLayout title="个人资产">
        <div className={styles.background}>
          <span className={styles.boxLeft}>
            <img
              className={styles.personalImg}
              src="http://wx3.sinaimg.cn/large/006m97Kgly1fmgmm7vtvdj30v90twq6d.jpg"
              alt=""
            />
            <div className={styles.nameAndEmail}>name</div>
            <div>Email</div>
            <div>
              <Link to={`/trade/detail/${ID.id}`}>
                <Button type="danger" className={styles.Btn}>
                  转账记录
                </Button>
              </Link>
            </div>
            <div>
              <Button type="danger" className={styles.Btn}>
                发送比特币
              </Button>
            </div>
            <div>
              <Button type="danger" className={styles.Btn}>
                接收比特币
              </Button>
            </div>
          </span>
          <span className={styles.boxRight}>
            <Tabs>
              <TabPane tab="全部" key="1">
                <Table
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={list}
                  columns={this.columns}
                  pagination={false}
                  onChange={this.handleTableChange}
                  footer={null}
                />
              </TabPane>
              <TabPane tab="待审核" key="2">
                <Table
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={list}
                  columns={this.columns}
                  pagination={false}
                  onChange={this.handleTableChange}
                  footer={null}
                />
              </TabPane>
              <TabPane tab="已取消" key="3">
                <Table
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={list}
                  columns={this.columns}
                  pagination={false}
                  onChange={this.handleTableChange}
                  footer={null}
                />
              </TabPane>
              <TabPane tab="已发送" key="4">
                <Table
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={list}
                  columns={this.columns}
                  pagination={false}
                  onChange={this.handleTableChange}
                  footer={null}
                />
              </TabPane>
              <TabPane tab="待确认" key="5">
                <Table
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={list}
                  columns={this.columns}
                  pagination={false}
                  onChange={this.handleTableChange}
                  footer={null}
                />
              </TabPane>
              <TabPane tab="已收到" key="6">
                <Table
                  loading={loading}
                  rowKey={record => record.id}
                  dataSource={list}
                  columns={this.columns}
                  pagination={false}
                  onChange={this.handleTableChange}
                  footer={null}
                />
              </TabPane>
            </Tabs>
          </span>
        </div>
      </PageHeaderLayout>
    );
  }
}
