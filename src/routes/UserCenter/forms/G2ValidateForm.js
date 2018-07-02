import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Icon, Row, Col, Checkbox, message } from 'antd';
import classNames from 'classnames';
import jrQrcode from 'jr-qrcode';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styles from './G2ValidateForm.less';

const FormItem = Form.Item;

class G2ValidateForm extends Component {
  static defaultProps = {
    className: '',
    onSubmit: () => {},
    onCancel: () => {},
  };
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  };

  state = {
    ready: false,
  };

  componentDidMount() {}

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, this.props.onSubmit);
  };

  render() {
    const { className, form, submitting, data = {} } = this.props;
    const { ready } = this.state;
    const { getFieldDecorator } = form;
    const url = jrQrcode.getQrBase64(data.url);
    const copy = (
      <CopyToClipboard text={data.secret} onCopy={() => message.success('复制成功')}>
        <a>
          <Icon type="copy" />
        </a>
      </CopyToClipboard>
    );

    return (
      <div className={classNames(className, styles.form_wrapper)}>
        <Form onSubmit={this.handleSubmit} className={styles.form}>
          <Row>
            <Col xs={24} sm={10} className={styles.left}>
              <img className={styles.image} src={url} alt="二维码图片" />
            </Col>
            <Col xs={24} sm={14} className={styles.right}>
              <FormItem>
                <h3>身份密匙</h3>
                <Input placeholder="身份密匙" value={data.secret} addonAfter={copy} disabled />
              </FormItem>
              <FormItem>
                <h3>验证码</h3>
                {getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ],
                })(<Input size="large" placeholder="验证码" />)}
              </FormItem>
              <FormItem>
                <Checkbox
                  checked={ready}
                  onChange={e => this.setState({ ready: e.target.checked })}
                >
                  我已经备份了身份验证秘钥
                </Checkbox>
              </FormItem>

              <FormItem className={styles.buttonBox}>
                <Button key="back" onClick={this.handleCancel}>
                  返回
                </Button>
                <Button
                  loading={submitting}
                  disabled={!ready}
                  className={styles.submit}
                  type="primary"
                  htmlType="submit"
                >
                  启用
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default Form.create()(G2ValidateForm);
