import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Button, Card, Row, Col, Modal, Form, Input, Table, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Detail.less';
import getMessage from '../../utils/getMessage';

const FormItem = Form.Item;

const size = 'large';
const clsString = classNames(
  styles.detail,
  'horizontal',
  {},
  {
    [styles.small]: size === 'small',
    [styles.large]: size === 'large',
  }
);

@connect(({ message, loading }) => ({
  data: message.infoDetail,
  loading: loading.models.message,
}))
/* @connect((userDetail, loading) => {
  return {data: userDetail, loading: loading}
}) */
@Form.create()
export default class InfoDetail extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'message/fetchInfoDetail',
      payload: { id: this.props.match.params.id },
      // callback: () => this.readMsg(this.props.match.params.id),
    });
  }

  readMsg = id => {
    const { dispatch } = this.props;

    dispatch({
      type: 'message/readMessage',
      payload: { all: false, id },
    });
  };

  render() {
    const { loading, data } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const breadcrumbList = [
      { title: '首页', href: '/' },
      { title: '更多资讯', href: '/message/info-list' },
      { title: '资讯详情' },
    ];

    return (
      <PageHeaderLayout title="资讯详情" breadcrumbList={breadcrumbList}>
        <div className={clsString}>
          <Card bordered={false}>
            <div>
              <a
                className={styles.itunes_btn}
                onClick={() => this.props.dispatch(routerRedux.goBack())}
              >
                返回
              </a>
            </div>
            <div className={styles.title}>{getMessage(data).title}</div>
            <div className={styles.publish}>
              <Icon type="clock-circle-o" />
              <span>
                {data.publish_at
                  ? moment(new Date(data.publish_at * 1000)).format('YYYY-MM-DD HH:mm:ss')
                  : '-'}
              </span>
            </div>
          </Card>
          <Card className={styles.content}>
            <div
              dangerouslySetInnerHTML={{
                __html: data.content,
              }}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
