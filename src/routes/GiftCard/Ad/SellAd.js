import React, { Component, Fragment } from 'react';
import { Select, Button, Icon, Input, message, Form, InputNumber, Radio, Modal } from 'antd';
import { map } from 'lodash';
import styles from './PreviewAd.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
export default class SellAd extends Component {
  state = {
    termModalInfo: false,
  };

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err, values);
      // if (!err) {
      //   this.props.onSubmit(values);
      // }
    });
  };

  handleShowTerm = () => {
    const { form } = this.props;
    const term_id = form.getFieldValue('term_id');
    this.setState({
      termModalInfo: true,
    });
  };

  handleHideTermModal = () => {
    this.setState({
      termModalInfo: false,
    });
  };

  render() {
    const { termModalInfo } = this.state;
    const {
      terms = [],
      form: { getFieldDecorator, getFieldValue, resetForm },
      initialValues = {},
    } = this.props;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };

    return (
      <Form className={styles.form} onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label="类型">
          {getFieldDecorator('card_type', {
            initialValue: initialValues.card_type,
            rules: [
              {
                required: true,
                message: '请选择类型',
              },
            ],
          })(
            <Select style={{ width: 200 }}>
              {map(CONFIG.card_type, item => (
                <Option key={item.type} value={item.type}>
                  {item.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="单价">
          {getFieldDecorator('unit_price', {
            initialValue: initialValues.unit_price,
            rules: [
              {
                required: true,
                message: '请输入单价',
              },
            ],
          })(<InputNumber />)}
        </FormItem>

        <FormItem {...formItemLayout} label="保障时间">
          {getFieldDecorator('guarantee_time', {
            initialValue: initialValues.guarantee_time,
            rules: [
              {
                required: true,
                message: '请选择保障时间',
              },
            ],
          })(
            <Select style={{ width: 200 }}>
              {map(CONFIG.guarantee_time, (item, index) => (
                <Option key={item} value={item}>
                  {item}分钟
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label={
            <span>
              交易条款<i>(可选)</i>
            </span>
          }
        >
          {getFieldDecorator('term_id', {
            initialValue: initialValues.term_id,
            rules: [],
          })(
            <div>
              <Select style={{ width: 200 }}>
                {map(terms, (item, index) => (
                  <Option key={item.id} value={item.id}>
                    {item.title}
                  </Option>
                ))}
              </Select>
              {/*getFiedzfdsazzldValzzz`ue('term_id') >= 0 && <a onClick={this.handleShowTerm}>查看</a>*/}
            </div>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="同时处理订单数">
          {getFieldDecorator('concurrency_order', {
            initialValue: initialValues.concurrency_order,
            rules: [
              {
                required: true,
                message: '请输入同时处理订单数',
              },
            ],
          })(<InputNumber />)}
        </FormItem>

        <FormItem {...formItemLayout} label="包含">
          {getFieldDecorator('password_type', {
            initialValue: initialValues.password_type,
            rules: [
              {
                required: true,
                message: '请输入选择密保卡类型',
              },
            ],
          })(
            <RadioGroup>
              {map(CONFIG.cardPwdType, (text, value) => <Radio value={value}>{text}</Radio>)}
            </RadioGroup>
          )}
        </FormItem>

        <p>{getFieldValue('password_type')}</p>

        <FormItem className={styles.buttonBox}>
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>
          <Button className={styles.submit} type="primary" htmlType="submit">
            发布
          </Button>
        </FormItem>
        {termModalInfo && (
          <Modal
            title={termModalInfo.title}
            visible={termModalInfo}
            onOk={this.handleHideTermModal}
            onCancel={this.handleHideTermModal}
          >
            <p>termModalInfo.content</p>
          </Modal>
        )}
      </Form>
    );
  }
}
