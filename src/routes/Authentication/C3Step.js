import { AuthStep } from 'components/Authentication';
import UploadQiNiu from 'components/UploadQiNiu';
import React, { PureComponent } from 'react';
import { Row, Col, Icon, message, Form, Button } from 'antd';
import { connect } from 'dva';
import { map, includes } from 'lodash';
import styles from './AuthenticationPage.less';

const FormItem = Form.Item;

// styles
const formItemLayout = {
  wrapperCol: { span: 12 },
  required: false,
};
const buttonItemLayout = {
  wrapperCol: { span: 10 },
  style: { textAlign: 'right' },
};

@connect(({ authentication, user }) => ({
  authentication,
  user,
}))
@Form.create()
export default class C3Step extends PureComponent {
  state = {
    uploadLoading: false,
  };

  componentDidMount() {
    const { video } = this.props.authentication;
    // this.props.form.setFieldsValue({
    //   video
    // })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'authentication/submitInfo',
          payload: values,
        });
      }
    });
  };

  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('头像必须小于2M!');
    }
    return isLt2M;
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { status } = this.props.authentication;
    const disabledForm = includes([2, 4], status);
    const { upload = {} } = this.props.user.currentUser;
    const { uploadLoading } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" justify="center">
          <Col span={8}>
            <FormItem label="录制视频">
              {getFieldDecorator('video', {
                valuePropName: 'file',
              })(<UploadQiNiu value={getFieldValue('video')} />)}
            </FormItem>
          </Col>
        </Row>
        <FormItem {...buttonItemLayout}>
          <Button type="primary" htmlType="submit" disabled={disabledForm}>
            <Icon type={uploadLoading ? 'loading' : 'upload'} />提交审核
          </Button>
        </FormItem>
      </Form>
    );
  }
}
