import React, { Component } from 'react';
import { Radio, Input, Form, Button } from 'antd';
import { map } from 'lodash';
import styles from './EvaluateForm.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

@Form.create()
export default class EvaluateForm extends Component {
  state = {};

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { id } = this.props || {};
        this.props.onSubmit && this.props.onSubmit({ ...values, order_id: id });
      }
    });
  };

  render() {
    const { form: { getFieldDecorator }, initialValues = {} } = this.props;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal" className={styles.tableListForm}>
        <FormItem>
          {getFieldDecorator('star', {
            initialValue: initialValues.star,
            rules: [
              {
                required: true,
                message: '请选择评价',
              },
            ],
          })(
            <RadioGroup className={styles.select}>
              {map(CONFIG.startList, (item, key) => {
                return (
                  <div key={key}>
                    <Radio style={radioStyle} value={+key}>
                      {item.title}
                    </Radio>
                    <div>{item.subTitle}</div>
                  </div>
                );
              })}
            </RadioGroup>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('content', {
            initialValue: initialValues.content,
            rules: [
              {
                required: true,
                message: '请输入评价',
              },
            ],
          })(<TextArea rows={4} />)}
        </FormItem>
        <div style={{ overflow: 'hidden' }}>
          <Button type="primary" htmlType="submit">
            {!initialValues.star ? '评价' : '更新评价'}
          </Button>
        </div>
      </Form>
    );
  }
}
