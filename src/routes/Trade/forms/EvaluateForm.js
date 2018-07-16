import React, { Component } from 'react';
import { Radio, Input, Row, Col, Form, Select, DatePicker, Button, InputNumber } from 'antd';
import { map } from 'lodash';
import TagSelect from 'components/TagSelect';
import styles from './EvaluateForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
@Form.create()
export default class SearchForm extends Component {
  // constructor(props) {
  //   super(props);
  // }
  state = {};

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { id } = this.props.initialValues || {};
        this.props.onSubmit && this.props.onSubmit({ ...values, id });
      }
      console.log(values);
    });
  };

  onChange = e => {
    console.log(e.target.value);
  };
  render() {
    const { form: { getFieldDecorator } } = this.props;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal" className={styles.tableListForm}>
        <FormItem>
          {getFieldDecorator('choose', {
            initialValue: '1',
          })(
            <RadioGroup className={styles.select}>
              <div>
                <Radio style={radioStyle} value="1">
                  可信任的
                </Radio>
                <div>增加他的信誉并将他标记为值得信赖的用户</div>
              </div>
              <div>
                <Radio style={radioStyle} value="2">
                  好评
                </Radio>
                <div>对您的交易伙伴做出好评，这将会增加他的信誉</div>
              </div>
              <div>
                <Radio style={radioStyle} value="3">
                  中评
                </Radio>
                <div>对您的交易伙伴做出中评，这将不会影响他的信誉</div>
              </div>
              <div>
                <Radio style={radioStyle} value="4">
                  差评及屏蔽
                </Radio>
                <div>这将降低他的信誉</div>
              </div>
              <div>
                <Radio style={radioStyle} value="5">
                  无反馈屏蔽
                </Radio>
                <div>阻止交易伙伴与您进行交易，不要给他任何评价。</div>
              </div>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem>{getFieldDecorator('input', {})(<TextArea rows={4} />)}</FormItem>
        <div style={{ overflow: 'hidden' }}>
          <Button type="primary" htmlType="submit">
            评价
          </Button>
        </div>
      </Form>
    );
  }
}
