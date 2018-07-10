import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { Button, Card, Row, Col, Badge, Form, Input, Avatar, Icon } from 'antd';
import { map, isNumber } from 'lodash';
import DescriptionList from 'components/DescriptionList';
import InputNumber from 'components/InputNumber';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TradeDetail.less';
import { getPayIcon } from '../../utils/utils';

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

@connect(({ trade, loading }) => ({
  detail: trade.detail,
  loading: loading.effects['trade/fetchDetail'],
  submitting: loading.effects['trade/createOrder'],
}))
@Form.create()
export default class TradeDetail extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'trade/fetchDetail',
      payload: { id: this.props.match.params.id },
    });
  }

  handleReport = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'trade/reportAd',
      payload: { ad_id: this.props.match.params.id },
    });
  };

  handleChangeVolume = (v) => {
    if(!isNumber(v)) {
      return
    }
    const { detail={}, form } = this.props;
    const trading_count = v / detail.trading_price;

    form.setFieldsValue({trading_count})
  }

  handleChangeCount = (v) => {
    if(!isNumber(v)) {
      return
    }
    const { detail={}, form } = this.props;
    const trading_volume = v * detail.trading_price;

    form.setFieldsValue({trading_volume})
  }

  handleSubmit = e => {
    e.preventDefault();

    const { detail={}, match:{params} } = this.props;
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(err, values)
      if (!err) {
        this.props.dispatch({
          type: 'trade/createOrder',
          payload: {
            ad_id: params.id,
            order_type: detail.ad.order_type,
            ...values
          },
        });
      }
    });
  };


  render() {
    const { submitting, detail={} } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { owner={} } = detail || {}
    const breadcrumbList = [{ title: '首页', href: '/' }, { title: '购买' }];
    // const currencyDes =  detail.currency ? CONFIG.currencyList[detail.currency]: '-';

    return (
      <PageHeaderLayout className="ant-layout-content" breadcrumbList={breadcrumbList}>
        <div className={styles.page}>
          <Row gutter={24}>
            <Col span={14} className={styles.left}>
              <Card bordered={false} className={styles.info}>
                <Meta
                  avatar={
                    <Badge status={owner.online ? 'success' : 'default'} offset={[35, -5]} dot>
                      <Avatar
                        size="large"
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                      />
                    </Badge>
                  }
                  title={owner.nickname}
                  description={owner.country_code && CONFIG.countrysMap[owner.country_code] ? CONFIG.countrysMap[owner.country_code].name: '-'}
                />
                <DescriptionList style={{ marginTop: 15 }} size="large" col="2">
                  <Description term="交易价格">{detail.trading_price} {detail.currency} / BTC</Description>
                  <Description term="交易限额"> 1 BTC ({detail.min_volume} {detail.currency } ~ {detail.max_volume} {detail.currency })</Description>
                  <Description term="交易笔数 / 好评率"> {owner.trade_times} / {owner.good_ratio}%</Description>
                  <Description term="付款期限">{detail.payment_limit} 分钟</Description>
                  <Description term="付款方式">
                    {
                      map(detail.payment_methods, item => <Icon  className={styles.pay_method} key={item} type={getPayIcon(item)} />)
                    }
                  </Description>
                </DescriptionList>
                <Form hideRequiredMark style={{ marginTop: 15 }} onSubmit={this.handleSubmit}>
                  <FormItem label="我要买" {...formItemLayout}>
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('trading_volume', {
                          onChange: this.handleChangeVolume,
                          rules: [
                            { required: true, message: '请输入' },
                          ],
                        })(<InputNumber size="large" addonAfter={detail.currency} />)}
                      </FormItem>
                    </Col>
                    <Col span={2}>
                      <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>
                        -
                      </span>
                    </Col>
                    <Col span={11}>
                      <FormItem>
                        {getFieldDecorator('trading_count', {
                          onChange: this.handleChangeCount,
                          rules: [{ required: true, message: '请输入' }],
                        })(<InputNumber size="large" addonAfter="BTC" />)}
                      </FormItem>
                    </Col>
                  </FormItem>
                  <FormItem label="交易备注" {...formItemLayout}>
                    {getFieldDecorator('order_notes', {
                      rules: [],
                    })(<TextArea rows={6} />)}
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
                title={`用户${owner.nickname}的交易条款`}
                actions={[
                  <a className={styles.report} onClick={this.handleReport}>
                    <Icon type="flag" /> 举报这则交易信息
                  </a>,
                ]}
              >
                <p>
                  {detail.trading_term}
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}
