import { Steps, Button } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from './index.less';

const Step = Steps.Step;
export default class Authentication extends Component {
  static state = {};
  static propTypes = {
    hideSubmitButton: PropTypes.bool,
  };
  static defaultProps = {
    hideSubmitButton: true,
  };
  render() {
    return (
      <div className={this.props.className}>
        <Steps size="small" current={0}>
          <Step title="C1实名认证" />
          <Step title="C2证件认证" />
          <Step title="C3视频认证" />
        </Steps>
        {this.props.hideSubmitButton === false && (
          <Button className={styles.btnBlock} size="large" type="primary">
            开始认证
          </Button>
        )}
      </div>
    );
  }
}
