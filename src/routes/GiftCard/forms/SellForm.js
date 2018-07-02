import React, { Component, Fragment } from 'react';
import {
  Select,
  Button,
  Icon,
  Input,
  message,
  Form,
  InputNumber,
  Radio,
  Modal,
  Popover,
  Card,
} from 'antd';
import { map, last } from 'lodash';
import styles from './SellForm.less';
import OnlyPassWord from './OnlyPassWord';
import OnlyPicture from './OnlyPicture';
import PicWithPass from './PicWithPass';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
export default class SellForm extends Component {
  state = {
    termModalInfo: false,
    addDenoVisible: false,
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

  add = () => {};

  //添加面额种类
  addDeno = () => {
    const { form } = this.props;
    const formDataObj = {
      money: this.state.denoVaule,
      receipt: '', // 凭证
      items: [
        {
          id: 0,
          password: '', // 卡密
          picture: '', // 图片
        },
      ],
    };
    const cards = form.getFieldValue('cards[]') || [];
    console.log(cards);
    cards.push(formDataObj);

    this.props.form.setFieldsValue({
      'cards[]': cards,
    });

    console.log(cards);
    // if (isNaN(this.state.denoVaule)) {
    //   return message.warning('请输入正确格式');
    // }
    // const a = this.state.cards;
    // const item = {
    //   money: this.state.denoVaule,
    //   items: [],
    // };
    // a.push(item);
    // this.state.cards = a;
    // this.setState({
    //   cards: a,
    // });
    // this.setState({addDenoVisible: false});
  };

  //添加面额输入框
  removeIpt = (id, index) => {
    const { form } = this.props;
    const cards = form.getFieldValue('cards[]') || [];
    const newItems = cards[index].items.filter(i => i.id !== id);
    cards[index].items = newItems;
    this.props.form.setFieldsValue({
      'cards[]': cards,
    });
  };

  //添加面额输入框
  addDenoIpt = index => {
    const { form } = this.props;
    const cards = form.getFieldValue('cards[]') || [];
    const lastId = last(cards[index].items, {}).id + 1;
    console.log(lastId);
    cards[index].items.push({
      id: lastId,
      password: '', // 卡密
      picture: '', // 图片
    });
    console.log(cards);
    this.props.form.setFieldsValue({
      'cards[]': cards,
    });
    // this.setState({
    //   date: new Date()
    // })
  };

  changeData = (i, item, index) => {
    const { form } = this.props;

    const { value } = item.password || {};
    const cards = form.getFieldValue('cards[]') || [];
    cards[index].items[i].password = value;
    console.log(cards);
  };

  handleCard = (index, items) => {
    const { form } = this.props;
    const cards = form.getFieldValue('cards[]') || [];
    cards[index].items = items;
    form.setFieldsValue({
      'cards[]': cards,
    });
  };

  render() {
    const { termModalInfo } = this.state;
    const {
      terms = [],
      form: { getFieldDecorator, getFieldValue, resetForm, onFieldsChange },
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

    const addDenoBox = (
      <div>
        <span className={styles.left}>面额:</span>
        <div className={styles.right}>
          <Input
            placeholder="请输入面额"
            defaultValue=""
            onChange={e => {
              this.setState({ denoVaule: e.target.value });
            }}
            onPressEnter={() => this.addDeno()}
          />
        </div>
        <div className={styles.btnBox}>
          <Button
            onClick={() => {
              this.setState({ addDenoVisible: false });
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              this.setState({ addDenoVisible: false });
              this.addDeno();
            }}
            type="primary"
          >
            确定
          </Button>
        </div>
      </div>
    );

    getFieldDecorator('cards[]', {
      // initialValue: []
    });

    const cards = getFieldValue('cards[]') || [];
    console.log(cards);
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
            initialValue: '1',
            rules: [
              {
                required: true,
                message: '请输入选择密保卡类型',
              },
            ],
          })(
            <RadioGroup>
              {map(CONFIG.cardPwdType, (text, value) => (
                <Radio key={value} value={value}>
                  {text}
                </Radio>
              ))}
            </RadioGroup>
          )}
        </FormItem>

        <FormItem {...formItemLayout}>
          <Popover
            key={this.state.date}
            placement="topRight"
            content={addDenoBox}
            title="添加面额"
            trigger="click"
            visible={this.state.addDenoVisible}
            onVisibleChange={() => {
              this.setState({ addDenoVisible: !this.state.addDenoVisible });
            }}
          >
            <Button type="dashed" style={{ width: '60%' }}>
              <Icon type="plus" /> 添加面额
            </Button>
          </Popover>
        </FormItem>
        <p>{getFieldValue('password_type')}</p>
        {getFieldValue('password_type') === '1'
          ? cards.map((item, index) => {
              return (
                <OnlyPassWord
                  key={index}
                  filedName={`cards[${index}]`}
                  data={item}
                  onChange={this.handleCard.bind(this, index)}
                  addDenoIpt={() => this.addDenoIpt(index)}
                  removeIpt={id => this.removeIpt(id, index)}
                  changeData={(i, changeItem) => this.changeData(i, changeItem, index)}
                />
              );
            })
          : null}
        {getFieldValue('password_type') === '2' && <OnlyPicture />}
        {getFieldValue('password_type') === '3' && <OnlyPassWord />}

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
