import { AuthStep } from 'components/Authentication';
import React, { Component } from 'react';
import { Form, Select } from 'antd';
// import { connect } from 'dva';

const FormItem = Form.Item;
const Option = Select.Option;

// @connect(({ user }) => ({
//   global: user.currentUser,
//   loading: loading.models.global,
// }))
export default class AuthenticationPage extends Component {
  static state = {};
  render() {
    return (
      <div>
        <AuthStep />
      </div>
    );
  }
}
