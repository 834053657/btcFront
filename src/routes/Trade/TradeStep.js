import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { map, findIndex } from 'lodash';
import { Button, Card, Row, Col, Modal, Spin, Input, Steps, Icon } from 'antd';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import { routerRedux } from 'dva/router';
import ConfirmModal from '../../components/ConfirmModal';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Step1 from './boxs/Step1.js';
import IM from './boxs/IM.js';
import styles from './TradeStep.less';

const { Step } = Steps;

/**
 * 页面逻辑
 // 买家视角
 // if(登录人 ===  trader && 买入订单) || (登录人 !== trader   出售订单) { 根据交易发起人和订单类型判断
 if(登录人 ===  owner && 买入) || (登录人 !== owner   出售) {

	----待支付 // 待支付 - 待释放 - 完成订单
	------

	----待释放 // 已支付 - 待释放 - 完成订单
	------ 确认释放 申述

	----完成 // 已支付 - 释放 - 完成订单
	------ //申述

	---- 申述 // 已支付 - 申述中
	--------- 确认释放


	----取消 // 待支付 - 取消
} else { // 卖家

---- 待支付 // 支付 - 释放比特币- 完成订单
------ 确认支付 取消订单

----待释放 // 已支付 - 待释放 - 完成订单
------ 申述


----取消 // 待支付 - 取消


----完成 // 已支付 - 释放 - 完成订单
------  xx // 申述

---- 申述 // 已支付 - 申述中
--------- 取消订单
}
 */
const msg = defineMessages({
  pay_affirm_title: {
    id: 'tradeStep.pay_affirm_title',
    defaultMessage: '确认支付?',
  },
  pay_affirm_content: {
    id: 'tradeStep.pay_affirm_content',
    defaultMessage: '请确定已经转款，再点击确认支付！',
  },
  release_affirm_title: {
    id: 'tradeStep.release_affirm_title',
    defaultMessage: '确认释放?',
  },
  release_affirm_content: {
    id: 'tradeStep.release_affirm_content',
    defaultMessage: '请确保已经收款，再点击确认释放！',
  },
  order_num: {
    id: 'tradeStep.order_num',
    defaultMessage: '订单号: ',
  },
});
@injectIntl()
@connect(({ trade, im, user, loading }) => ({
  orderDetail: trade.orderDetail,
  tradeIm: trade.tradeIm,
  im,
  currentUser: user.currentUser,
  loading: loading.effects['trade/fetchOrderDetail'],
}))
export default class TradeStep extends PureComponent {
  state = {
    cancelModal: false,
    appealModal: false,
    reportAdModal: false,
  };

  componentDidMount() {
    const { match: { params = {} } } = this.props;
    this.fetchDetail(params.id);
  }

  componentWillUpdate(nextProps, nextState) {
    const { id } = this.props.match.params || {};
    const { id: nextId } = nextProps.match.params || {};

    if (id !== nextId) {
      this.fetchDetail(nextId);
    }
  }

  fetchDetail = id => {
    this.props.dispatch({
      type: 'trade/fetchOrderDetail',
      payload: { id },
    });
  };

  orderSteps = {
    wait_pay: {
      steps: [
        {
          key: 'wait_pay',
          text: <FM id='tradeStep.wait_pay' defaultMessage='待支付' />,
        },
        {
          key: 'wait_release',
          text: <FM id='tradeStep.wait_pay_release' defaultMessage='待释放' />,
        },
        {
          key: 'done',
          text: <FM id='tradeStep.wait_pay_finish_order' defaultMessage='完成订单' />,
        },
      ],
      renderButtons: () => {
        return this.checkIsBuyer()
          ? [
            <Button key="ok" type="primary" onClick={this.handlePay}>
              <FM id='tradeStep.btn_affirm_pay' defaultMessage='确认支付' />
            </Button>,
            <Button key="cancel" style={{ marginLeft: 25 }} onClick={this.handleShowCancelModal}>
              <FM id='tradeStep.cancel_order' defaultMessage='取消订单' />
            </Button>,
            ]
          : null;
      },
    },
    wait_release: {
      steps: [
        {
          key: 'wait_pay',
          text: <FM id='tradeStep.already_pay' defaultMessage='已支付' />,
        },
        {
          key: 'wait_release',
          text: <FM id='tradeStep.wait_release_release' defaultMessage='待释放' />,
        },
        {
          key: 'done',
          text: <FM id='tradeStep.wait_release_pay' defaultMessage='完成订单' />,
        },
      ],
      renderButtons: () => {
        const buttons = [];

        if (!this.checkIsBuyer()) {
          buttons.push(
            <Button
              key="ok"
              type="primary"
              style={{ marginRight: 25 }}
              onClick={this.handleRelease}
            >
              <FM id='tradeStep.btn_affirm_release' defaultMessage='确认释放' />
            </Button>
          );
        }
        buttons.push(
          <Button key="cancel" onClick={this.handleShowAppealModal}>
            <FM id='tradeStep.btn_user_state' defaultMessage='申述' />
          </Button>
        );

        return buttons;
      },
    },
    done: {
      steps: [
        {
          key: 'wait_pay',
          text: <FM id='tradeStep.done_already_pay' defaultMessage='已支付' />,
        },
        {
          key: 'wait_release',
          text: <FM id='tradeStep.done_already_release' defaultMessage='已释放' />,
        },
        {
          key: 'done',
          text: <FM id='tradeStep.done_finish_order' defaultMessage='完成订单' />,
        },
      ],
      // renderButtons: () => {
      //   return (
      //     <Button key="cancel" onClick={this.handleShowAppealModal}>
      //       申述
      //     </Button>
      //   );
      // },
    },
    cancel: {
      steps: [
        {
          key: 'wait_pay',
          text: <FM id='tradeStep.cancel_wait_pay' defaultMessage='待支付' />,
        },
        {
          key: 'cancel',
          text: <FM id='tradeStep.cancel_cancel_order' defaultMessage='订单取消' />,
          status: 'error',
        },
        {
          key: 'done',
          text: <FM id='tradeStep.cancel_finish_order' defaultMessage='完成订单' />,
        },
      ],
    },
    appeal: {
      steps: [
        {
          key: 'wait_pay',
          text: <FM id='tradeStep.appeal_already_pay' defaultMessage='已支付' />,
        },
        {
          key: 'appeal',
          text: <FM id='tradeStep.appeal_state' defaultMessage='申述中' />,
        },
        {
          key: 'done',
          text: <FM id='tradeStep.appeal_finish_order' defaultMessage='完成订单' />,
        },
      ],
      renderButtons: () => {
        let buttons = null;

        if (this.checkIsBuyer()) {
          buttons = (
            <Button key="cancel" onClick={this.handleShowCancelModal}>
              <FM id='tradeStep.btn_cancel_order' defaultMessage='取消订单' />
            </Button>
          );
        } else {
          buttons = (
            <Button key="ok" type="primary" onClick={this.handleRelease}>
              <FM id='tradeStep.btn_affirm_release' defaultMessage='确认释放' />
            </Button>
          );
        }
        return buttons;
      },
    },
  };

  // 确认支付
  handlePay = () => {
    Modal.confirm({
      title: this.props.intl.formatMessage(msg.pay_affirm_title),
      content:this.props.intl.formatMessage(msg.pay_affirm_content),
      onOk: () => {
        const { dispatch, match: { params = {} } } = this.props;
        dispatch({
          type: 'trade/orderConfirm',
          payload: { order_id: params.id },
        });
      },
      onCancel() {},
    });
  };

  // 确认释放
  handleRelease = () => {
    Modal.confirm({
      title: this.props.intl.formatMessage(msg.release_affirm_title),
      content: this.props.intl.formatMessage(msg.release_affirm_content),
      onOk: () => {
        const { dispatch, match: { params = {} } } = this.props;
        dispatch({
          type: 'trade/orderRelease',
          payload: { order_id: params.id },
        });
      },
      onCancel() {},
    });
  };

  handleShowCancelModal = () => {
    this.setState({
      cancelModal: true,
    });
  };

  handleHideCancelModal = () => {
    this.setState({
      cancelModal: false,
    });
  };

  handleSubmitCancel = (err, values) => {
    if (!err) {
      const { dispatch, match: { params = {} } } = this.props;
      dispatch({
        type: 'trade/orderCancel',
        payload: { ...values, order_id: params.id },
        callback: this.handleHideCancelModal,
      });
    }
  };

  handleShowAppealModal = () => {
    this.setState({
      appealModal: true,
    });
  };

  handleHideAppealModal = () => {
    this.setState({
      appealModal: false,
    });
  };

  handleSubmitAppeal = (err, values) => {
    if (!err) {
      const { dispatch, match: { params = {} } } = this.props;
      dispatch({
        type: 'trade/orderAppeal',
        payload: { ...values, order_id: params.id },
        callback: this.handleHideAppealModal,
      });
    }
  };

  handleShowReportModal = () => {
    this.setState({
      reportAdModal: true,
    });
  };

  handleHideReportModal = () => {
    this.setState({
      reportAdModal: false,
    });
  };

  handleSubmitReport = (err, values) => {
    if (!err) {
      const { dispatch, match: { params = {} } } = this.props;
      dispatch({
        type: 'trade/reportAd',
        payload: { ...values, ad_id: params.id },
        callback: this.handleHideReportModal,
      });
    }
  };

  // 判断当前登录用户是否是买家
  checkIsBuyer = () => {
    const { ad = {}, trader = {}, order = {} } = this.props.orderDetail || {};
    const { user = {} } = this.props.currentUser || {};
    const { ad_type, owner = {} } = ad || {};
    const { id } = user || {};
    // ------- start 根据广告主 和 广告类型 以及当前登录人 判断谁是买家 start--------
    // if(登录人 ===  owner && 买入) || (登录人 !== owner   出售) {
    // console.log(`${CONFIG.ad_type[ad_type]}广告 当前登录人是 ${id === owner.id ? '广告主': '交易人'}`)
    // console.log(((id === owner.id && ad_type === 1) || (id !== owner.id && ad_type === 2))? '买家': '卖家')
    // return ((id === owner.id && ad_type === 1) || (id !== owner.id && ad_type === 2))
    // ------- end 根据广告主 和 广告类型 以及当前登录人 判断谁是买家 end--------

    // ------- start 根据下单人 和 订单类型 以及当前登录人 判断谁是买家 start--------
    return (
      (id === trader.id && order.order_type === 1) || (id !== trader.id && order.order_type === 2)
    );
    // ------- end 根据下单人 和 订单类型 以及当前登录人 判断谁是买家 end--------
  };

  render() {
    const { loading, orderDetail, match: { params = {} } } = this.props;
    const { order = {} } = orderDetail || {};
    const order_status = CONFIG.orderEngStatus[order.status];
    const currentObj = order_status ? this.orderSteps[order_status] : {};
    const current = findIndex(currentObj.steps, item => item.key === order_status);
    const breadcrumbList = [{ title: <FM id='tradeStep.main_page' defaultMessage='首页' />, href: '/' }, { title: this.props.intl.formatMessage(msg.order_num) + params.id }];

    return (
      <PageHeaderLayout
        className="ant-layout-content"
        breadcrumbList={breadcrumbList}
        tabActiveKey={params.id}
        extraContent={
          <Button onClick={() => this.props.dispatch(routerRedux.goBack())}><FM id='tradeStep.goBack' defaultMessage='返回' /></Button>
        }
      >
        <Spin spinning={loading}>
          <Card bordered={false}>
            <Steps current={current} className={styles.steps}>
              {map(currentObj.steps, item => (
                <Step key={item.key} title={item.text} status={item.status} />
              ))}
            </Steps>
            <div className={styles.page}>
              <Row gutter={24}>
                <Col span={10} className={styles.left}>
                  <Step1
                    {...this.props}
                    renderButtons={currentObj.renderButtons}
                    handleReport={this.handleShowReportModal}
                  />
                </Col>
                <Col span={14} className={styles.right}>
                  <IM {...this.props} orderId={params.id} />
                </Col>
              </Row>
            </div>
          </Card>
        </Spin>

        <ConfirmModal
          visible={this.state.cancelModal}
          title={<FM id='tradeStep.cancel_form_pay' defaultMessage='取消订单' />}
          onSubmit={this.handleSubmitCancel}
          onCancel={this.handleHideCancelModal}
        />
        <ConfirmModal
          visible={this.state.appealModal}
          title={<FM id='tradeStep.my_state' defaultMessage='我要申述' />}
          onSubmit={this.handleSubmitAppeal}
          onCancel={this.handleHideAppealModal}
        />
        <ConfirmModal
          visible={this.state.reportAdModal}
          title={<FM id='tradeStep.report_order' defaultMessage='举报' />}
          onSubmit={this.handleSubmitReport}
          onCancel={this.handleHideReportModal}
        />
      </PageHeaderLayout>
    );
  }
}
