import { Steps, Button } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
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
    status: 1,
    reason: null,
    stepTitleList: [(PROMPT('C1_real_name')),(PROMPT('C2_real_name')),(PROMPT('C3_real_name'))],
  };

  render() {
    const { reason, step, status } = this.props;
    const stepStatus = ['wait', 'process', 'error', 'finish'][status - 1];
    return (
      <div className={this.props.className}>
        <Steps status={stepStatus} size={this.props.size || 'small'} current={step}>
          {this.props.stepTitleList.map((title, index) => {
            return (
              <Step
                key={index}
                title={title}
                description={step === index && status === 3 && reason ? reason : null}
              />
            );
          })}
        </Steps>
        {this.props.hideGotoButton === false && (
          <Link to="/authentication">
            <Button className={styles.btnBlock} size="large" type="primary">
              <FM id='authStep.approve_now' defaultMessage='立即认证' />
            </Button>
          </Link>
        )}
      </div>
    );
  }
}
