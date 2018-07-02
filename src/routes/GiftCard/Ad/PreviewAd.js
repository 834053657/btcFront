import React, { Component, Fragment } from 'react';
import { Select, Button, Icon, Input, message, Form, InputNumber, Radio, Modal } from 'antd';
import { map } from 'lodash';
import SellAd from './SellAd';
import styles from './PreviewAd.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
export default class PreviewAd extends Component {
  state = {};

  render() {
    return (
      <div>
        <SellAd />
      </div>
    );
  }
}
