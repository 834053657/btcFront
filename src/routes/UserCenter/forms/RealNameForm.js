import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form, Input, Button, Upload, Icon, message } from 'antd';
import styles from './PasswordForm.less';

const FormItem = Form.Item;
const Dragger = Upload.Dragger;

@connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class RealNameForm extends Component {
  static defaultProps = {
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };
  state = {
    uploadLoadingF: false,
    uploadLoadingB: false,
  };

  getImgUrl = (obj = {}) => {
    const { upload = {} } = this.props.currentUser || {};
    let url = '';

    if (obj.status === 'done' && obj.url) {
      url = obj.url;
    } else if (obj.status === 'done' && obj.response) {
      url = obj.response.hash;
    }
    return upload.prefix + url;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, value) => {
      if (!err) {
        const info = {
          name: value.name,
          cardno: value.cardno,
          front_image: this.getImgUrl(value.front_image[0]),
          back_image: this.getImgUrl(value.back_image[0]),
        };
        this.props.onSubmit(info);
      }
    });
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  uploadHandler = (type, info) => {
    const loadingKey = type === 'back_image' ? 'uploadLoadingB' : 'uploadLoadingF';

    if (info.file.status === 'uploading') {
      this.setState({
        [loadingKey]: true,
      });
    } else if (info.file.status === 'done') {
      this.setState({ [loadingKey]: false });
    } else if (info.file.status === 'error') {
      this.setState({ [loadingKey]: false });
      message.error('上传错误，可能请求已过期，请刷新页面重试');
    }
  };

  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('头像必须小于5M!');
    }
    return isLt2M;
  };

  renderDragger = type => {
    const loadingKey = type === 'back_image' ? 'uploadLoadingB' : 'uploadLoadingF';
    const { upload = {} } = this.props.currentUser || {};
    const title = type === 'back_image' ? '身份证反面' : '身份证正面';
    const fileList = this.props.form.getFieldValue(type);
    let imageUrl = null;
    if (Array.isArray(fileList) && fileList[0] && fileList[0].status === 'done') {
      const file = fileList[0];
      imageUrl = file.response ? upload.prefix + file.response.hash : file.url;
    }

    const uploadButton = (
      <div>
        <p className="ant-upload-drag-icon">
          <Icon type={this.state[loadingKey] ? 'loading' : 'inbox'} />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
        <p className="ant-upload-hint">{title}</p>
      </div>
    );

    const uploadBtn = (
      <Dragger
        name="file"
        accept="image/gif, image/png, image/jpg, image/jpeg, image/bmp"
        showUploadList={false}
        multiple={false}
        action={upload.domain}
        onChange={this.uploadHandler.bind(this, type)}
        beforeUpload={this.beforeUpload}
        data={{ token: upload.token }}
      >
        {imageUrl ? (
          <img style={{ maxWidth: '100%', maxHeight: '150px' }} src={imageUrl} alt={type} />
        ) : (
          uploadButton
        )}
      </Dragger>
    );

    return uploadBtn;
  };

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && [e.file];
  };

  render() {
    const { form, submitting, initialValues = {} } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 20 },
      },
    };

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="真实姓名">
            {getFieldDecorator('name', {
              initialValue: initialValues.name,
              rules: [
                {
                  required: true,
                  message: '请输入真实姓名！',
                },
              ],
            })(<Input size="large" maxLength={20} placeholder="真实姓名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="身份证号">
            {getFieldDecorator('cardno', {
              initialValue: initialValues.cardno,
              rules: [
                {
                  required: true,
                  message: '请输入身份证号！',
                },
              ],
            })(<Input size="large" maxLength={30} placeholder="身份证号" />)}
          </FormItem>
          <h3>上传证件</h3>

          <FormItem>
            {getFieldDecorator('front_image', {
              initialValue: initialValues.front_image
                ? [{ url: initialValues.front_image, status: 'done' }]
                : [],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              rules: [
                {
                  required: true,
                  message: '请上传身份证正面！',
                },
              ],
            })(this.renderDragger('front_image'))}
          </FormItem>
          <FormItem>
            {getFieldDecorator('back_image', {
              initialValue: initialValues.back_image
                ? [{ url: initialValues.back_image, status: 'done' }]
                : [],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              rules: [
                {
                  required: true,
                  message: '请上传身份证反面！',
                },
              ],
            })(this.renderDragger('back_image'))}
          </FormItem>

          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              确定
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
