import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Card, Button, Alert, Radio } from 'antd';
import { map } from 'lodash';

import DescriptionList from 'components/DescriptionList';
import BlankLayout from '../../layouts/BlankLayout';
import styles from './AdPublish.less';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AdPublishForm from './Form/AdPublishForm';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const typeMap = {
  1: '购买',
  2: '出售',
};

// @connect(({ trade, loading }) => ({
//   ...trade.tradeList,
//   loading: loading.models.message,
// }))

export default class AdPublish extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {}

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: '',
    // });
  }

  handleTypeChange = e => {
    // const type = e.target.value;
    // this.setState({
    //   type
    // });
  };

  UserChoose = () => {
    const { type } = this.state;

    return (
      <div className={styles.type_box}>
        <div style={{ float: 'left' }}>
          <RadioGroup size="large" value={type} onChange={this.handleTypeChange}>
            {map(typeMap, (text, value) => (
              <RadioButton
                style={{ borderRadius: '4px', width: '200px', marginRight: '25px' }}
                key={value}
                value={value}
              >
                在线卖出
              </RadioButton>
            ))}
          </RadioGroup>
        </div>
        <Alert
          style={{ float: 'left', marginLeft: '20px' }}
          message={
            <span>
              <Icon type="exclamation-circle" /> 您还可以创建 4 条交易广告，查看:<a>发布条数说明</a>
            </span>
          }
        />
      </div>
    );
  };

  handleSubmit = e => {
    console.log(e);
  };

  render() {
    const { type } = this.state;

    return (
      <PageHeaderLayout title="发布广告">
        <div className={styles.background}>
          <div>{this.UserChoose()}</div>

          <Card style={{ margin: 15, width: 600 }} title="广告规则">
            <li>
              要想显示您的交易广告，您的【utomarket】钱包中需要有比特币。使用在线付款的交易广告至少需要
              0.05 BTC。
            </li>
            <li>特定付款方式要求您验证身份，然后您的交易广告才会显示。</li>
            <li>每笔完成的交易均会消耗广告主 1% 的总交易金额。查看我们费用页面上的所有费用。</li>
            <li>发起交易后，价格就会确定，除非定价中有明显的错误。</li>
            <li>您不能代表其他人（由经纪人处理）购买或出售比特币。</li>
            <li>您仅可以使用以自己名字注册的付款帐户（非第三方付款！）。</li>
            <li>您必须在交易广告或交易聊天中提供您的付款详细信息。</li>
            <li>所有交流必须在utomarket.com 上进行。</li>
            <li>
              标记为高风险的付款方式具有很大的欺诈风险。在使用高风险付款方式时，请务必小心且始终要求您的交易对方验证身份。
            </li>
          </Card>
          <div>
            <AdPublishForm formType={type} onSubmit={this.handleSubmit} />
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}
