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

@connect(({ information, loading }) => ({
  data: information.infoDetail,
  loading: loading.models.information,
}))
/* @connect((userDetail, loading) => {
  return {data: userDetail, loading: loading}
}) */
export default class Content extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'information/fetchStaticContent',
      payload: { type: this.props.type },
    });
  }

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

    return (
      <div className={clsString}>
        <Card className={styles.content}>
          <div
            dangerouslySetInnerHTML={{
              __html: data.content,
            }}
          />
        </Card>
      </div>
    );
  }
}
