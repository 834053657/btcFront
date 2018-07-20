import { Steps, Button } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

const Step = Steps.Step;
export default class Authentication extends Component {
  static state = {};
  static propTypes = {
    hideGotoButton: PropTypes.bool,
    step: PropTypes.number,
  };
  static defaultProps = {
    hideGotoButton: true,
    step: 0,
  };
  render() {
    return (
      <div className={this.props.className}>
        <Steps size={this.props.size || 'small'} current={this.props.step}>
          <Step title="C1实名认证" />
          <Step title="C2证件认证" />
          <Step title="C3视频认证" />
        </Steps>
        {this.props.hideGotoButton === false && (
          <Link to="/authentication">
            <Button className={styles.btnBlock} size="large" type="primary">
              立即认证
            </Button>
          </Link>
        )}
      </div>
    );
  }
}
