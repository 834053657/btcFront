import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Steps } from 'antd';
import { routerRedux } from 'dva/router';

const Step = Steps.Step;

export default class StepModel extends React.PureComponent {
  render(props) {
    const { current, steps } = this.props;

    return (
      <Steps current={current}>
        {steps.map((step, index) => {
          return <Step title={step.title} key={index} />;
        })}
      </Steps>
    );
  }
}
