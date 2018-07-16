import React, { Component } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form, Input, Button, Upload, Select, message, Icon } from 'antd';
import { omit, map, keys } from 'lodash';
import { getAuthority } from '../../../utils/authority';
import styles from './PayMethodForm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const Dragger = Upload.Dragger;
const { TextArea } = Input;

@connect(({ user, loading }) => ({
  result: user.changePassword.result,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class PayMethodForm extends Component {
  static defaultProps = {
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };
  state = {};

  constructor(props) {
    super(props);
    const { payment_detail = {} } = props.initialValues || {};

    this.state = {
      formItemLayout: {
        labelCol: {
          sm: { span: 4 },
        },
        wrapperCol: {
          sm: { span: 20 },
        },
      },
      fieldList: {
        wechat: {
          'payment_detail.name': {
            lablel: '姓名',
            component: <Input size="large" maxLength={20} placeholder="姓名" />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: '请输入姓名！',
                },
              ],
            },
          },
          'payment_detail.account': {
            lablel: '账号',
            component: <Input size="large" maxLength={30} placeholder="账号" />,
            options: {
              initialValue: payment_detail.account,
              rules: [
                {
                  required: true,
                  message: '请输入账号！',
                },
                {
                  pattern: /^[0-9]{4,30}$/,
                  message: '请输入4~30位的数字',
                },
              ],
            },
          },
          'payment_detail.ercodeUrl': {
            lablel: '收款码',
            component: () => this.renderDragger('payment_detail.ercodeUrl'),
            options: {
              initialValue: payment_detail.ercodeUrl
                ? [{ url: payment_detail.ercodeUrl, status: 'done' }]
                : [],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              rules: [
                {
                  required: true,
                  message: '请上传微信收款码！',
                },
              ],
            },
          },
        },
        alipay: {
          'payment_detail.name': {
            lablel: '姓名',
            component: <Input size="large" maxLength={20} placeholder="姓名" />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: '请输入姓名！',
                },
              ],
            },
          },
          'payment_detail.account': {
            lablel: '账号',
            component: <Input size="large" maxLength={30} placeholder="账号" />,
            options: {
              initialValue: payment_detail.account,
              rules: [
                {
                  required: true,
                  message: '请输入账号！',
                },
                {
                  pattern: /^[0-9]{4,30}$/,
                  message: '请输入4~30位的数字',
                },
              ],
            },
          },
          'payment_detail.ercodeUrl': {
            lablel: '收款码',
            component: () => this.renderDragger('payment_detail.ercodeUrl'),
            options: {
              initialValue: payment_detail.ercodeUrl
                ? [{ url: payment_detail.ercodeUrl, status: 'done' }]
                : [],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              rules: [
                {
                  required: true,
                  message: '请上传支付宝收款码！',
                },
              ],
            },
          },
        },
        bank: {
          'payment_detail.name': {
            lablel: '姓名',
            component: <Input size="large" maxLength={20} placeholder="姓名" />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: '请输入姓名！',
                },
              ],
            },
          },
          'payment_detail.bank_name': {
            lablel: '开户行',
            component: <Input size="large" maxLength={20} placeholder="开户行" />,
            options: {
              initialValue: payment_detail.bank_name,
              rules: [
                {
                  required: true,
                  message: '请输入开户行！',
                },
              ],
            },
          },
          'payment_detail.bank_account': {
            lablel: '银行卡号',
            component: <Input size="large" maxLength={30} placeholder="银行卡号" />,
            options: {
              initialValue: payment_detail.bank_account,
              rules: [
                {
                  required: true,
                  message: '请输入银行卡号！',
                },
                {
                  pattern: /^[0-9]{4,30}$/,
                  message: '请输入4~30位的数字',
                },
              ],
            },
          },
        },
        westernunion: {
          'payment_detail.name': {
            lablel: '姓名',
            component: <Input size="large" maxLength={20} placeholder="姓名" />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: '请输入姓名！',
                },
              ],
            },
          },
          'payment_detail.account': {
            lablel: '汇款信息',
            component: <TextArea rows={4} style={{ width: 390 }} />,
            options: {
              initialValue: payment_detail.account,
              rules: [
                {
                  required: true,
                  message: '请输入西联汇款信息！',
                },
              ],
            },
          },
        },
        paytm: {
          'payment_detail.name': {
            lablel: '姓名',
            component: <Input size="large" maxLength={20} placeholder="姓名" />,
            options: {
              initialValue: payment_detail.name,
              rules: [
                {
                  required: true,
                  message: '请输入姓名！',
                },
              ],
            },
          },
          'payment_detail.account': {
            lablel: '账号',
            component: <Input size="large" maxLength={30} placeholder="账号" />,
            options: {
              initialValue: payment_detail.account,
              rules: [
                {
                  required: true,
                  message: '请输入账号！',
                },
                {
                  pattern: /^[0-9]{4,30}$/,
                  message: '请输入4~30位的数字',
                },
              ],
            },
          },
          'payment_detail.ercodeUrl': {
            lablel: '收款码',
            component: () => this.renderDragger('payment_detail.ercodeUrl'),
            options: {
              initialValue: payment_detail.ercodeUrl
                ? [{ url: payment_detail.ercodeUrl, status: 'done' }]
                : [],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              rules: [
                {
                  required: true,
                  message: '请上传paytm收款码！',
                },
              ],
            },
          },
        },
      },
    };
  }

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && [e.file];
  };

  uploadHandler = (type, info) => {
    if (info.file.status === 'uploading') {
      this.setState({
        uploading: true,
      });
    } else if (info.file.status === 'done') {
      this.setState({ uploading: false });
    } else if (info.file.status === 'error') {
      this.setState({ uploading: false });
      message.error('上传错误，可能请求已过期，请刷新页面重试');
    }
  };

  getImgUrl = (obj = {}) => {
    const { upload = {} } = getAuthority() || {};
    let url = '';

    if (obj.status === 'done' && obj.url) {
      url = obj.url;
    } else if (obj.status === 'done' && obj.response) {
      url = obj.response.hash;
    }
    return url ? upload.prefix + url : null;
  };

  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('头像必须小于5M!');
    }
    return isLt2M;
  };

  renderDragger = type => {
    const { upload = {} } = getAuthority() || {};
    const fileList = this.props.form.getFieldValue(type);
    let imageUrl = null;
    if (Array.isArray(fileList) && fileList[0] && fileList[0].status === 'done') {
      const file = fileList[0];
      imageUrl = file.response && file.response.hash ? upload.prefix + file.response.hash : file.url;
    }

    const uploadButton = (
      <div>
        <p className="ant-upload-drag-icon">
          <Icon type={this.state.uploading ? 'loading' : 'inbox'} />
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
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

  handleSubmit = e => {
    e.preventDefault();
    const { getFieldValue } = this.props.form;
    const { fieldList } = this.state;
    const payment_method = getFieldValue('payment_method');
    const fields = payment_method && fieldList[payment_method] ? fieldList[payment_method] : null;

    this.props.form.validateFields(
      [...keys(fields), 'payment_method'],
      { force: true },
      (err, values) => {
        if(!err) {
          if (values.payment_detail && values.payment_detail.ercodeUrl) {
            const url = this.getImgUrl(values.payment_detail.ercodeUrl[0]);
            if(url) {
              values.payment_detail.ercodeUrl = url;
            }else {
              return message.error('请上传收款码')
            }
          }
          this.props.onSubmit(values);
        }

      }
    );
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  getContent = () => {
    const { formItemLayout, fieldList } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const payment_method = getFieldValue('payment_method');
    const fields = payment_method && fieldList[payment_method] ? fieldList[payment_method] : null;

    const content = (
      <div>
        {map(fields, (item, key) => {
          const comp = typeof item.component === 'function' ? item.component() : item.component;

          return (
            <FormItem {...formItemLayout} label={item.lablel} key={key}>
              {getFieldDecorator(key, item.options)(comp)}
            </FormItem>
          );
        })}
      </div>
    );

    return content;
  };

  render() {
    const { formItemLayout } = this.state;
    const { form, submitting, initialValues = {}, payMents=[] } = this.props;
    const { id } = initialValues || {};
    const { getFieldDecorator } = form;

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark>
          <Form.Item {...formItemLayout} label="支付方式">
            {getFieldDecorator('payment_method', {
              initialValue: initialValues.payment_method,
              rules: [{ required: true, message: '请选择支付方式' }],
            })(
              <Select size="large" placeholder="请选择支付方式">
                {map(payMents, (text, key) => (
                  <Option key={key} value={key}>
                    {text}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {this.getContent()}

          <FormItem className={styles.buttonBox}>
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>
            <Button loading={submitting} className={styles.submit} type="primary" htmlType="submit">
              {id ? '更新' : '确定'}
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
