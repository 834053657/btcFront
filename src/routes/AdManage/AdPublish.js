import React, { Component } from 'react';
import { connect } from 'dva';
// import { Icon, Table, Button, Modal } from 'antd';
import { map } from 'lodash';
import { Radio } from 'antd/lib/index';

import DescriptionList from 'components/DescriptionList';
import BlankLayout from '../../layouts/BlankLayout';
import styles from './AdPublish.less';

const { Description } = DescriptionList;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// @connect(({ trade, loading }) => ({
//   ...trade.tradeList,
//   loading: loading.models.message,
// }))

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: '',
    // });
  }

  handleTypeChange = e => {
    const type = e.target.value;
    this.setState({
      type,
    });
  };

  render() {
    const { list = [1], pagination = {}, loading } = this.props;
    const { type } = this.state;
    const typeMap = {
      1: '购买',
      2: '出售',
    };

    return (
      <BlankLayout>
        <div>
          <div className={styles.type_box}>
            <Radio.Group
              size="large"
              value={type}
              onChange={this.handleTypeChange}
              style={{ marginBottom: 8 }}
            >
              {map(typeMap, (text, value) => (
                <Radio.Button key={value} value={value}>
                  {text}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
        </div>
      </BlankLayout>
    );
  }
}
