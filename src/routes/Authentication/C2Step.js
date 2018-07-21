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
export default class C2Step extends PureComponent {
  state = {
    uploadLoading: false,
  };

  componentDidMount() {
    const { front_image, back_image } = this.props.authentication;
    this.props.form.setFieldsValue({
      front_image,
      back_image,
    });
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

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { status } = this.props.authentication;
    const disabledForm = includes([2, 4], status);
    const { upload = {} } = this.props.user.currentUser;
    const { uploadLoading } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" justify="center">
          <Col offset={2} span={8}>
            <FormItem label="正面">
              {getFieldDecorator('front_image', {
                valuePropName: 'file',
              })(
                <UploadQiNiu value={getFieldValue('front_image')}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或者拖拽文件到这里上传</p>
                  <p className="ant-upload-hint">上传您的证件正面</p>
                </UploadQiNiu>
              )}
            </FormItem>
          </Col>
          <Col offset={2} span={8}>
            <FormItem label="反面">
              {getFieldDecorator('back_image', {
                valuePropName: 'file',
              })(
                <UploadQiNiu value={getFieldValue('back_image')}>
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或者拖拽文件到这里上传</p>
                  <p className="ant-upload-hint">上传您的证件背面</p>
                </UploadQiNiu>
              )}
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
