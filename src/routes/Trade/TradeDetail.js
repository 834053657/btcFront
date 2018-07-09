import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Button, Card, Row, Col, Badge, Form, Input, Avatar, Icon } from 'antd';
import DescriptionList from 'components/DescriptionList';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TradeDetail.less';

const { Description } = DescriptionList;
const { Meta } = Card;
const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    sm: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 21 },
  },
};
const payMethod = {
  alipay: <Icon style={{ fontSize: 18, marginRight: 8 }} type="alipay-circle" />,
  bank: <Icon style={{ fontSize: 18, marginRight: 8 }} type="wallet" />,
  wechat: <Icon style={{ fontSize: 18, marginRight: 8 }} type="wechat" />,
};
@connect(({ trade, loading }) => ({
  ...trade.detail,
  submitting: loading.effects['trade/fetchDetail'],
}))
@Form.create()
export default class TradeDetail extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'message/fetchInfoDetail',
      payload: { id: this.props.match.params.id },
      // callback: () => this.readMsg(this.props.match.params.id),
    });
  }

  handleReport = () => {
    console.log('举报');
    // const { dispatch } = this.props;
    //
    // dispatch({
    //   type: 'message/readMessage',
    //   payload: { all: false, id },
    // });
  };

  render() {
    const { submitting } = this.props;
    const { getFieldDecorator } = this.props.form;
    const breadcrumbList = [{ title: '首页', href: '/' }, { title: '购买' }];

    return (
      <PageHeaderLayout className="ant-layout-content" breadcrumbList={breadcrumbList}>
        <div className={styles.page}>
          <Row gutter={24}>
            <Col span={14} className={styles.left}>
              <Card bordered={false} className={styles.info}>
                <Meta
                  avatar={
                    <Badge status={true ? 'success' : 'default'} offset={[35, -5]} dot>
                      <Avatar
                        size="large"
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      />
                    </Badge>
                  }
                  title="罗鹏"
                  description="中国"
                />
                <DescriptionList style={{ marginTop: 15 }} size="large" col="2">
                  <Description term="交易价格">20000 CNY</Description>
                  <Description term="交易限额"> 1 BTC (1 CNY ~ 555 CNY)</Description>
                  <Description term="交易笔数 / 好评率"> 100 / 99%</Description>
                  <Description term="付款期限">30 分钟</Description>
                  <Description term="付款方式">
                    {payMethod.alipay}
                    {payMethod.wechat}
                  </Description>
                </DescriptionList>
                <Form hideRequiredMark style={{ marginTop: 15 }} onSubmit={this.handleSubmit}>
                  <FormItem label="我要买" {...formItemLayout}>
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('reb', {
                          rules: [{ required: true, message: '请输入标题(1-20字符)' }],
                        })(<Input addonAfter="CNY" />)}
                      </FormItem>
                    </Col>
                    <Col span={2}>
                      <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                        -
                      </span>
                    </Col>
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('btc', {
                          rules: [{ required: true, message: '请输入标题(1-20字符)' }],
                        })(<Input addonAfter="BTC" />)}
                      </FormItem>
                    </Col>
                  </FormItem>
                  <FormItem label="交易备注" {...formItemLayout}>
                    {getFieldDecorator('reb', {
                      rules: [{ required: true, message: '请输入标题(1-20字符)' }],
                    })(<TextArea rows={4} />)}
                  </FormItem>

                  <FormItem className={styles.buttonBox}>
                    <Button key="back" onClick={this.props.onCancel}>
                      取消
                    </Button>
                    <Button
                      loading={submitting}
                      style={{ marginLeft: 15 }}
                      type="primary"
                      htmlType="submit"
                    >
                      提交
                    </Button>
                  </FormItem>
                </Form>
              </Card>
            </Col>
            <Col span={10} className={styles.right}>
              <Card
                className={styles.term_box}
                title="用户罗鹏的交易条款"
                actions={[
                  <a className={styles.report} onClick={this.handleReport}>
                    <Icon type="flag" /> 举报这则交易信息
                  </a>,
                ]}
              >
                <p>
                  支付宝15966286489 胡海燕
                  刷销量，刷完做卡，各位大神高抬贵手，如有不妥还请见谅，谢谢、
                  我们支持支付宝、中国工商银行、微信支付。 打款后，请注意留言写清何种方式支付的。
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}
