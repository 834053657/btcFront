import { AuthStep } from 'components/Authentication';
import UploadQiNiu from 'components/UploadQiNiu';
import React, { PureComponent } from 'react';
import { Row, Col, Icon, message, Form, Button, Spin } from 'antd';
import { connect } from 'dva';
import { get, map, includes } from 'lodash';
import styles from './AuthenticationPage.less';

const FormItem = Form.Item;
const Fragment = React.Fragment;
// styles
const formItemLayout = {
  required: false,
};
const buttonItemLayout = {
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
    faceid_url: null,
    goFaceID: false,
  };

  constructor(props) {
    super(props);
    const { country_code, card_type } = this.props.authentication;
    this.state.goFaceID = country_code === 'CN' && card_type === 1;
    this.props
      .dispatch({
        type: 'authentication/authForC3',
      })
      .then(res => {
        this.setState({
          faceid_url: get(res, 'data.url', null),
        });
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
      <Fragment>
        {this.state.goFaceID ? (
          <Spin spinning={!this.state.faceid_url}>
            <iframe
              width="100%"
              height="700px"
              frameBorder="0"
              src={this.state.faceid_url}
              title="视频认证"
            />
          </Spin>
        ) : (
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <FormItem label="录制视频" {...formItemLayout}>
              {getFieldDecorator('video', {
                valuePropName: 'file',
                rules: [{ type: 'url', required: true, message: '不正确的视频' }],
              })(
                <UploadQiNiu
                  disabled={disabledForm}
                  accept={UploadQiNiu.MIME_TYPE.VIDEO}
                  sizeLimitMB={5}
                  value={getFieldValue('video')}
                />
              )}
            </FormItem>
            <FormItem {...buttonItemLayout}>
              <Button type="primary" htmlType="submit" disabled={disabledForm}>
                <Icon type={uploadLoading ? 'loading' : 'upload'} />提交审核
              </Button>
            </FormItem>
          </Form>
        )}
      </Fragment>
    );
  }
}
