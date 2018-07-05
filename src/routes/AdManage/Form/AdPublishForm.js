import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Button, Form, Input, Radio, Checkbox, DatePicker, Col } from 'antd';
import { map } from 'lodash';

import styles from './AdPublishForm.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()
export default class AdPublishForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { id } = this.props.initialValues || {};
        this.props.onSubmit && this.props.onSubmit({ ...values, id });
      }
    });
  };

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const { getFieldDecorator } = this.props.form;
    const { formType } = this.props;
    return (
      <Form hideRequiredMark>
        <FormItem {...formItemLayout} label="交易币种">
          {getFieldDecorator('currency', {
            rules: [
              {
                required: true,
                message: '请输入',
              },
            ],
          })(
            <Select style={{ width: 170 }}>
              <Option value="交易币种">人民币</Option>
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="市场价比例">
          {getFieldDecorator('trading_price_ratio', {
            rules: [
              {
                required: true,
                message: '请输入',
              },
            ],
          })(<Input placeholder="市场价比例" style={{ width: 170 }} addonAfter="%" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="市场参考价格">
          {getFieldDecorator('consult', {
            rules: [{}],
          })(<div>123444444</div>)}
        </FormItem>

        <FormItem {...formItemLayout} label="交易价格">
          {getFieldDecorator('tradind_price', {
            rules: [
              {
                required: true,
                message: '请输入',
              },
            ],
          })(<Input placeholder="交易价格" style={{ width: 170 }} />)}
        </FormItem>

        <FormItem label="inline" {...formItemLayout}>
          <Col span={11}>
            <FormItem>
              {getFieldDecorator('limitBTC', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <span>
                  <Input placeholder="交易限额" addonAfter="BTC" />
                </span>
                // <span><Input placeholder="交易限额" style={{ width: 170, marginRight:'20px'}} addonAfter="CNY" /></span>
                // <span><Input placeholder="交易限额" style={{ width: 170, }} addonAfter="CNY" /></span>
              )}
            </FormItem>
          </Col>
          {/*<Col span={2}>*/}
          {/*<span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>*/}
          {/*-*/}
          {/*</span>*/}
          {/*</Col>*/}
          <Col span={11}>
            <FormItem>
              {getFieldDecorator('limitBTC', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <span>
                  <Input placeholder="交易限额" addonAfter="BTC" />
                </span>
                // <span><Input placeholder="交易限额" style={{ width: 170, marginRight:'20px'}} addonAfter="CNY" /></span>
                // <span><Input placeholder="交易限额" style={{ width: 170, }} addonAfter="CNY" /></span>
              )}
            </FormItem>
          </Col>
          <Col span={11}>
            <FormItem>
              {getFieldDecorator('limitBTC', {
                rules: [
                  {
                    required: true,
                    message: '请输入',
                  },
                ],
              })(
                <span>
                  <Input placeholder="交易限额" addonAfter="BTC" />
                </span>
                // <span><Input placeholder="交易限额" style={{ width: 170, marginRight:'20px'}} addonAfter="CNY" /></span>
                // <span><Input placeholder="交易限额" style={{ width: 170, }} addonAfter="CNY" /></span>
              )}
            </FormItem>
          </Col>
        </FormItem>

        <FormItem {...formItemLayout} label="付款期限">
          {getFieldDecorator('deadline', {
            rules: [
              {
                required: true,
                message: '请输入',
              },
            ],
          })(<Input placeholder="付款期限" style={{ width: 170 }} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="付款方式">
          {getFieldDecorator('way', {
            rules: [
              {
                required: true,
                message: '请输入',
              },
            ],
          })(<Input placeholder="付款方式" style={{ width: 170 }} addonAfter="分钟" />)}
        </FormItem>

        <FormItem {...formItemLayout} required label="安全选项">
          <div>
            <div>
              <div className="">
                <Checkbox>仅限受信任的交易者</Checkbox>
              </div>
            </div>

            <div>
              <div>
                <div className="">
                  <span className="bt-trade-level-auth">交易者的认证等级</span>
                  <span style={{ marginLeft: 20 }}>
                    <RadioGroup>
                      <Radio value="1">C1</Radio>
                      <Radio value="2">C2</Radio>
                      <Radio value="3">C3</Radio>
                      <Radio value="0">不限</Radio>
                    </RadioGroup>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </FormItem>

        <FormItem {...formItemLayout} label="交易备注">
          {getFieldDecorator('remark', {
            rules: [
              {
                required: true,
                message: '请输入',
              },
            ],
          })(<TextArea placeholder="交易备注" rows={4} style={{ width: 390 }} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="自动回复">
          {getFieldDecorator('self', {
            rules: [
              {
                required: true,
                message: '请输入',
              },
            ],
          })(<TextArea placeholder="自动回复" rows={4} style={{ width: 390 }} />)}
        </FormItem>

        <FormItem>
          <div className={styles.btnBox}>
            <Button type="primary" onClick={this.handleSubmit} className={styles.btn}>
              确认发布
            </Button>
          </div>
        </FormItem>
      </Form>
    );
  }
}
