import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Modal, Row, Col } from 'antd';
import classNames from 'classnames';
import styles from './index.less';
import { getCaptcha } from '../../services/api';

const FormItem = Form.Item;

class ImageValidation extends Component {
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
    image: null,
  };

  componentDidMount() {
    this.loadCaptcha();
  }

  componentWillUpdate(nextProps, nextState) {
    const { visible } = this.props;
    const { visible: nextVisible } = nextProps;

    if (nextVisible && nextVisible !== visible) {
      this.loadCaptcha();
    }
  }

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.onSubmit(values.code, this.loadCaptcha);
      }
    });
  };

  loadCaptcha = async () => {
    const params = {
      r: Math.random(),
      usage: 'login',
    };
    const res = await getCaptcha(params);
    if (res.data) {
      this.setState({
        image: res.data.img,
      });
    }
  };

  render() {
    const { className, form, submitting, visible, title } = this.props;
    const { image } = this.state;
    const { getFieldDecorator } = form;

    return (
      <Modal
        width={360}
        title={title}
        destroyOnClose
        visible={visible}
        onCancel={this.handleCancel}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={submitting}
            htmlType="submit"
            onClick={this.handleSubmit}
          >
            确定
          </Button>,
        ]}
      >
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('code', {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码！',
                      },
                    ],
                  })(<Input size="large" placeholder="验证码" />)}
                </Col>
                <Col span={8}>
                  <img
                    alt="captcha"
                    src={image}
                    onClick={this.loadCaptcha}
                    className={styles.captcha}
                  />
                </Col>
              </Row>
            </FormItem>
          </Form>
        </div>
      </Modal>
    );
  }
}
export default Form.create()(ImageValidation);
