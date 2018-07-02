import React, { Component } from 'react';
import { Button, Icon, Steps, Avatar, Select } from 'antd';

export default class SetInterval extends Component {
  constructor(props) {
    super();
    this.gurantee = props.time / 60;
  }

  timeInterval = time => {
    return 1;
  };

  render() {
    const time = this.props.time;
    return <span>{parseInt(this.gurantee)}</span>;
  }
}
