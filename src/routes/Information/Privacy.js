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

export default class Privacy extends PureComponent {
  state = {};

  componentDidMount() {}

  render() {
    const { loading, data } = this.props;

    return (
      <PageHeaderLayout className={styles.title} title="隐私">
        <Content type="2" />
      </PageHeaderLayout>
    );
  }
}
