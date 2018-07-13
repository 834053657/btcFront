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

@connect(({ global, loading }) => ({
  local: global.local,
  loading: loading.models.message,
}))
/* @connect((userDetail, loading) => {
  return {data: userDetail, loading: loading}
}) */
@Form.create()
export default class InfoDetail extends PureComponent {
  state = {
    title: '',
    content: '',
  };

  componentDidMount() {
    const { type } = this.props.match.params || {};
    const { local } = this.props;
    this.fetchDetail(type, local);
  }

  componentWillUpdate(nextProps, nextState) {
    const { type } = this.props.match.params || {};
    const { type:nextType } = nextProps.match.params || {};

    if (this.props.local !== nextProps.local || type !== nextType) {
      this.fetchDetail(nextType, nextProps.local)
    }
  }

  fetchDetail = (type, local)=> {
    const { dispatch } = this.props;

    dispatch({
      type: 'global/getArticle',
      payload: {
        type,
        local,
      },
      callback: content => {
        this.setState({
          title: CONFIG.articleList[type],
          content,
        });
      },
    });
  }

  render() {
    // const { loading } = this.props;
    const { title, content } = this.state;

    return (
      <PageHeaderLayout title={title}>
        <div className={clsString}>
          <Card className={styles.content}>
            <div
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
