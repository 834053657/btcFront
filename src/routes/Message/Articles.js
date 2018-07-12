import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Button, Card, Row, Col, Modal, Form, Input, Table, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Detail.less';

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
    const { id } = this.props.match.params || {};
    const { dispatch } = this.props;
    console.log(id);
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

  handleChooseTitle = () => {
    const { id } = this.props.match.params || {};
    if (id === 'about') {
      return '团队介绍';
    } else if (id === 'agreement') {
      return '服务条款';
    } else if (id === 'duty') {
      return '免责声明';
    } else if (id === 'privacy') {
      return '隐私保护';
    } else if (id === 'fee') {
      return '费率说明';
    } else if (id === 'course') {
      return '新手教程';
    } else if (id === 'problem') {
      return '常见问题';
    } else if (id === 'operate') {
      return '操作指南';
    } else if (id === 'safe') {
      return '安全指南';
    }
  };

  render() {
    const { loading, data } = this.props;

    return (
      <PageHeaderLayout title={this.handleChooseTitle()}>
        <div className={clsString}>
          <Card bordered={false}>
            <div className={styles.title}>{data.title}</div>
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
