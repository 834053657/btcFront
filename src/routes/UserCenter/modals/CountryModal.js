import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Steps, Form, Select, Button } from 'antd';
import { FormattedMessage as FM } from 'react-intl';
import { delay, map } from 'lodash';
import G2Validation from 'components/G2Validation';
import CheckEmailForm from '../forms/EmailForm';
import styles from './CountryModal.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { Step } = Steps;
@Form.create()
export default class countryModal extends Component {
  static defaultProps = {
    title: <FM id='countryModal.select_country_title' defaultMessage='选择国家' />,
    onCancel: () => {},
  };
  static propTypes = {
    title: PropTypes.string,
    onCancel: PropTypes.func,
  };

  state = {};

  handleSubmit = e => {
    const { callback } = this.props;
    // console.log(e)
    this.props.form.validateFields((err, value) => {
      const { country } = value;
      if (!err) {
        this.props.dispatch({
          type: 'user/submitChangeCountry',
          payload: {
            country_code: country,
          },
        });
        this.handleOnCancel();
      }
    });
  };

  handleOnCancel = () => {
    this.props.onCancel && this.props.onCancel();
  };

  handleChanges = e => {
    console.log(e);
  };

  render() {
    const { visible, title, onCancel, currentUser } = this.props;
    const { getFieldDecorator } = this.props.form;
    console.log(this.props);

    return (
      <Modal
        width={500}
        title={title}
        visible={visible}
        onCancel={onCancel}
        maskClosable={false}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('country', {
              initialValue: currentUser.user.country_code,
              onChange: this.handleChanges,
            })(
              <Select
                showSearch
                style={{ width: '80%', marginLeft: '10%' }}
                placeholder={(PROMPT('countryModal.select_country')||'请选择国家')}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {map(CONFIG.country, item => {
                  return (
                    <Option value={item.code} key={item.code}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" className={styles.confirm}>
              <FM id='countryModal.select_country_btn_sure' defaultMessage='确定' />
            </Button>
            <Button onClick={this.handleOnCancel}><FM id='countryModal.select_country_btn_cancel' defaultMessage='取消' /></Button>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
