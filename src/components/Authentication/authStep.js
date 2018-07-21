import { Steps, Button } from 'antd';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'dva/router';
import styles from './index.less';

const Step = Steps.Step;
export default class Authentication extends Component {
  state = {};
  static propTypes = {
    hideGotoButton: PropTypes.bool,
    step: PropTypes.number,
    status: PropTypes.number, // 1：未认证，2：认证中，3：未通过，4，已通过
    reason: PropTypes.string,
    stepTitleList: PropTypes.array,
  };
  static defaultProps = {
    hideGotoButton: true,
    step: 0,
    status: 1, // 1：未认证，2：认证中，3：未通过，4，已通过
    reason: null,
    stepTitleList: ['C1实名认证', 'C2实名认证', 'C3视频认证'],
  };
  render() {
    const { reason, step, status } = this.props;
    const stepStatus = ['wait', 'process', 'error', 'finish'][status - 1];
    return (
      <div className={this.props.className}>
        <Steps status={stepStatus} size={this.props.size || 'small'} current={step}>
          {this.props.stepTitleList.map((title, index) => {
            return <Step title={title} description={step === index && reason ? reason : null} />;
          })}
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
