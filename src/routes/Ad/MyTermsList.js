import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
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
  Badge,
  Popconfirm,
  Tooltip,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getMessageContent } from '../../utils/utils';
import TermsModal from './TermsModal';
import styles from './List.less';

const statusMap = ['default', 'warning', 'success'];

@connect(({ ad, loading }) => ({
  data: ad.termsData,
  loading: loading.models.ad,
  submitting: loading.effects['ad/saveTerms'],
}))
export default class TermsList extends Component {
  constructor(props) {
    super();

    this.state = {
      termsModalVisible: false,
      action: null,
      selectedTerms: null,
      selectedRows: [],
    };
  }

  componentWillMount() {}

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/fetchTermsList',
    });
  }

  addTerm = () => {
    this.setState({
      termsModalVisible: true,
      action: '_NEW',
    });
  };

  viewTerm = r => {
    this.setState({
      termsModalVisible: true,
      action: '_OPEN',
      selectedTerms: r,
    });
  };

  editTerm = r => {
    this.setState({
      termsModalVisible: true,
      action: '_EDIT',
      selectedTerms: r,
    });
  };

  deleteTerm = r => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/deleteTerms',
      payload: { id: r.id },
      callback: this.refreshGrid,
    });
  };

  hideTermsModal = () => {
    this.setState({
      termsModalVisible: false,
    });
  };

  handleSubmitTerms = v => {
    this.setState({
      termsModalVisible: false,
    });

    this.refreshGrid();
  };

  refreshGrid = v => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ad/fetchTermsList',
    });
  };

  columns = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '30%',
    },
    {
      title: '交易条款',
      dataIndex: 'content',
      width: '35%',
      className: styles.term_title,
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      width: '15%',
      render(val, row) {
        if (val === 1) {
          return (
            <span>
              <Badge status={statusMap[0]} text={val ? `${CONFIG.trans_term_status[1]}` : '-'} />
              <Tooltip title={row.reason}>
                <span className={styles.reason}>原因</span>
              </Tooltip>
            </span>
          );
        } else {
          return (
            <Badge status={statusMap[val - 1]} text={val ? CONFIG.trans_term_status[val] : '-'} />
          );
        }
      },
    },
    {
      title: '操作',
      width: '20%',
      render: r => (
        <Fragment>
          <a onClick={() => this.viewTerm(r)}>查看</a>
          {[1, 3].indexOf(r.status) > -1 && (
            <span>
              <Divider type="vertical" />
              <a onClick={() => this.editTerm(r)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="您确认要删除此交易条款?"
                onConfirm={() => this.deleteTerm(r)}
                okText="确认"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          )}
        </Fragment>
      ),
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
      type: 'ad/fetchTermsList',
      payload: params,
    });
  };

  render() {
    const { data: { list, pagination }, loading, submitting } = this.props;
    const { selectedRows, termsModalVisible, action, selectedTerms } = this.state;

    const breadcrumbList = [{ title: '我的广告', href: '/ad/my' }, { title: '交易条款管理' }];

    const content = (
      <Row gutter={24}>
        <Col span={12} className={styles.title}>
          交易条款管理
        </Col>
        <Col span={12} className={styles.more}>
          <Button type="primary" onClick={this.addTerm}>
            添加一条
          </Button>
        </Col>
      </Row>
    );

    return (
      <PageHeaderLayout content={content} breadcrumbList={breadcrumbList}>
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
        {termsModalVisible && (
          <TermsModal
            {...this.props}
            action={action}
            terms={selectedTerms}
            visible={termsModalVisible}
            onOK={this.handleSubmitTerms}
            onCancel={this.hideTermsModal}
          />
        )}
      </PageHeaderLayout>
    );
  }
}
