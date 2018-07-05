import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Row, Col, Badge, Form, Input, Steps, Icon } from 'antd';
import DescriptionList from 'components/DescriptionList';

import styles from './Step1.less';


const { Description } = DescriptionList;
const { Meta } = Card;
const { Step } = Steps;

const formItemLayout = {
  labelCol: {
    sm: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 21 },
  },
};
const payMethod = {
  'alipay': <Icon style={{fontSize: 18, marginRight: 8}} type="alipay-circle" />,
  'bank': <Icon style={{fontSize: 18, marginRight: 8}} type="wallet" />,
  'wechat': <Icon style={{fontSize: 18, marginRight: 8}} type="wechat" />
}

export default class Step1 extends PureComponent {
  state = {};

  componentDidMount() {

  }

  handleReport = () => {
    console.log('举报')
    // const { dispatch } = this.props;
    //
    // dispatch({
    //   type: 'message/readMessage',
    //   payload: { all: false, id },
    // });
  };

  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info':
        return 0;
      case 'confirm':
        return 1;
      case 'result':
        return 2;
      default:
        return 0;
    }
  }

  render() {
    const { submitting } = this.props;

    return (
      <Fragment className={styles.page}>
        <Card bordered={false}  className={styles.info}>
          <Meta
            title="100CNY 买 0.004 BTC"
            // description="中国"
          />
          <DescriptionList style={{marginTop: 15}} size="large" col="1">
            <Description term="汇率">20000 CNY</Description>
            <Description term="交易限额"> 1 BTC (1 CNY ~ 555 CNY)</Description>
            <Description term="付款倒计时">30 分钟</Description>
            <Description term="付款方式">{payMethod['alipay']}{payMethod['wechat']}</Description>
          </DescriptionList>
          <div className={styles.buttonBox}>
            <Button
              onClick={this.props.onCancel}
            >
              取消订单
            </Button>
            <Button
              style={{ marginLeft: 25}}
              loading={submitting}
              type="primary"
            >
              确认支付
            </Button>
          </div>
          <Card
            className={styles.term_box}
            title="用户罗鹏的交易条款"
            actions={[(
              <a className={styles.report} onClick={this.handleReport}><Icon type="flag" /> 举报这则交易信息</a>
            )]}
          >
            <p>
              支付宝15966286489 胡海燕

              刷销量，刷完做卡，各位大神高抬贵手，如有不妥还请见谅，谢谢、

              我们支持支付宝、中国工商银行、微信支付。

              打款后，请注意留言写清何种方式支付的。
            </p>
          </Card>
        </Card>
      </Fragment>
    );
  }
}
