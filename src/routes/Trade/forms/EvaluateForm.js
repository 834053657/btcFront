import React, { Component } from 'react';
import { Radio, Input, Form, Button } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { map } from 'lodash';
import styles from './EvaluateForm.less';
import { getLocale } from '../../../utils/authority';

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
    const lang = getLocale() || 'zh_CN';
    const msgText = CONFIG[`startList_${lang}`]
    console.log(lang)
    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal" className={styles.tableListForm}>
        <FormItem>
          {getFieldDecorator('star', {
            initialValue: initialValues.star,
            rules: [
              {
                required: true,
                message: <FM id='evaluateForm.choose_evaluate' defaultMessage='请选择评价' />,
              },
            ],
          })(
            <RadioGroup className={styles.select}>
              {map(msgText, (item, key) => {
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
                message: <FM id='evaluateForm.choose_evaluate_input' defaultMessage='请输入评价' />,
              },
            ],
          })(<TextArea rows={4} />)}
        </FormItem>
        <div style={{ overflow: 'hidden' }}>
          <Button type="primary" htmlType="submit">
            {!initialValues.star ? <FM id='evaluateForm.btn_evaluate' defaultMessage='评价' /> : <FM id='evaluateForm.refresh_evaluate' defaultMessage='更新评价' />}
          </Button>
        </div>
      </Form>
    );
  }
}
