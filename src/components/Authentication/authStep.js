import { Steps, Button } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './index.less';

const Step = Steps.Step;
export default class Authentication extends Component {
  static state = {};
  static propTypes = {
    hideGotoButton: PropTypes.bool,
  };
  static defaultProps = {
    hideGotoButton: true,
  };
  render() {
    return (
      <div className={this.props.className}>
        <Steps size={this.props.size || 'small'} current={0}>
          <Step title="C1实名认证" />
          <Step title="C2证件认证" />
          <Step title="C3视频认证" />
        </Steps>
        {this.props.hideGotoButton === false && (
          <Button className={styles.btnBlock} size="large" type="primary">
            开始认证
          </Button>
        )}
      </div>
    );
  }
}
