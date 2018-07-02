import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import { routerRedux } from 'dva/router';
import Content from './Content';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Detail.less';

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

/* @connect((userDetail, loading) => {
  return {data: userDetail, loading: loading}
}) */
export default class Terms extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    const { loading, data } = this.props;

    return (
      <PageHeaderLayout className={styles.title} title="条款">
        <Content type="3" />
      </PageHeaderLayout>
    );
  }
}
