import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { delay } from 'lodash';
import { FormattedMessage as FM } from 'react-intl';
import { Link, routerRedux } from 'dva/router';
import moment from 'moment';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Card,
  Modal,
  Row,
  Col,
  Divider,
  message,
  Badge,
  Tooltip,
  Popconfirm,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getMessageContent } from '../../utils/utils';
import styles from './List.less';
//import message from "../../models/message";

const statusMap = ['warning', 'processing', 'error', 'default'];

@connect(({ ad, loading }) => ({
  data: ad.myAdData,
  loading: loading.models.ad,
}))
export default class List extends Component {
  constructor(props) {
    super();

    this.state = {
      selectedRows: [],
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/fetchMyAdList',
    });
  }

  updateAd = (r, status) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/updateAd',
      payload: { ad_id: r.id },
      callback: this.refreshGrid,
    });
  };

  recoverAd = row => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/recoverAd',
      payload: {
        ad_id: row.id,
      },
      callback: this.refreshGrid,
    });
  };
  DeleteAd = r => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/daleteAd',
      payload: { ad_id: r.id },
      callback: this.refreshGrid,
    });
  };
  viewAd = (r, action) => {
    message.warning('跳转页面开发中');
    return null;
    // todo
    // if (r.goods_type !== 1) {
    //   //?id=${r.id}&ad_type=${r.ad_type}&action=${action}`
    //   this.props.dispatch(routerRedux.push(`/card/a_detail`));
    // } else {
    //   this.props.dispatch(
    //     routerRedux.push(`/ad/itunes/detail?id=${r.id}&ad_type=${r.ad_type}&action=${action}`)
    //   );
    // }
  };

  deleteAd = r => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/deleteAd',
      payload: { id: r.id },
      callback: this.refreshGrid,
    });
  };

  refreshGrid = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/fetchMyAdList',
    });
  };

  columns = [
    {
      title: <FM id='myAdList.ad_no' defaultMessage='广告编号' />,
      dataIndex: 'ad_no',
      width: '15%',
      className: styles.ad_no,
      render: (val, row) => {
        return (
          <span>
            <Link to={`/ad/edit/${row.id}`}>{val}</Link>
          </span>
        );
      },
    },
    {
      title: <FM id='myAdList.ad_type' defaultMessage='交易类型' />,
      dataIndex: 'ad_type',
      width: '15%',
      render: (val, row) => CONFIG.ad_type[val],
    },
    {
      title: <FM id='myAdList.trading_price' defaultMessage='出售单价' />,
      dataIndex: 'trading_price',
      width: '15%',
      render(val, row) {
        return (
          <span>
            {val} {row.currency}/BTC
          </span>
        );
      },
    },
    {
      title: <FM id='myAdList.status' defaultMessage='状态' />,
      dataIndex: 'status',
      width: '15%',
      render(val, row) {
        if (val === 4) {
          return (
            <span>
              <Badge status={statusMap[3]} text={val ? `${CONFIG.ad_status[4]}` : '-'} />
              <Tooltip title={row.reason}>
                <span className={styles.reason}>原因</span>
              </Tooltip>
            </span>
          );
        } else {
          return <Badge status={statusMap[val - 1]} text={val ? CONFIG.ad_status[val] : '-'} />;
        }
      },
    },
    {
      title: <FM id='myAdList.operator' defaultMessage='操作' />,
      width: '25%',
      render: (_, r) => {
        return (
          <Fragment>
            {/*<a onClick={() => this.viewAd(r, '_OPEN')}>查看</a>*/}
            {r.status === 1 && (
              <span>
                {/*<Divider type="vertical" />*/}
                <a onClick={() => this.updateAd(r, 2)} className="text-red">
                  <FM id='myAdList.stop' defaultMessage='暂停' />
                </a>
              </span>
            )}
            {r.status === 2 && (
              <span>
                {/*<Divider type="vertical" />*/}
                <a onClick={() => this.recoverAd(r, 1)} className="text-green">
                  <FM id='myAdList.recover' defaultMessage='恢复' />
                </a>
              </span>
            )}
            {[1, 2].indexOf(r.status) > -1 && (
              <span>
                <Divider type="vertical" />
                <Link to={`/ad/edit/${r.id}`}><FM id='myAdList.adit' defaultMessage='编辑' /></Link>
              </span>
            )}
            {[ 2, 4].indexOf(r.status) > -1 && (
              <span>
                <Divider type="vertical" />
                <Popconfirm
                  title={<FM id='myAdList.tip_toCancel' defaultMessage='您确认要删除此广告?' />}
                  onConfirm={() => this.DeleteAd(r, 5)}
                  okText={<FM id='myAdList.ok_text' defaultMessage='确认' />}
                  cancelText={<FM id='myAdList.cancel_text' defaultMessage='取消' />}
                >
                  <a className="text-red"><FM id='myAdList.cancel_btn' defaultMessage='删除' /></a>
                </Popconfirm>
              </span>
            )}
          </Fragment>
        );
      },
    },
  ];
  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, getValue } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      page_size: pagination.pageSize,
      ...formValues,
      // ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'ad/fetchMyAdList',
      payload: params,
    });
  };

  render() {
    const { data: { list, pagination }, loading } = this.props;
    const { selectedRows } = this.state;

    const content = (
      <Row gutter={24}>
        <Col span={12} className={styles.title}>
          <FM id='myAdList.my_ad' defaultMessage='我的广告' />
        </Col>
        <Col span={12} className={styles.more}>
          <a
            className={styles.itunes_btn}
            onClick={() => this.props.dispatch(routerRedux.goBack())}
          >
            <FM id='myAdList.goBack' defaultMessage='返回' />
          </a>
        </Col>
      </Row>
    );

    return (
      <PageHeaderLayout content={content}>
        <div>
          <Card bordered={false} className={styles.message_list}>
            <Table
              loading={loading}
              rowKey={record => record.id}
              dataSource={list}
              columns={this.columns}
              pagination={pagination}
              onChange={this.handleTableChange}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
