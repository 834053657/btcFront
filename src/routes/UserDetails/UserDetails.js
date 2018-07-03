import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Table, Button, Modal, Radio } from 'antd';
import { map } from 'lodash';

import DescriptionList from 'components/DescriptionList';
import BlankLayout from '../../layouts/BlankLayout';
import styles from './UserDetails.less';

import ReportForm from './Form/ReportForm';

const { Description } = DescriptionList;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// @connect(({ trade, loading }) => ({
//   ...trade.tradeList,
//   loading: loading.models.message,
// }))

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentWillMount() {}

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: '',
    // });
  }

  handleLogin = () => {
    return <a>登录</a>;
  };
  handleSign = () => {
    return <a>注册</a>;
  };
  handleUserName = () => {
    return <a>罗鹏</a>;
  };
  handleTrust = () => {
    console.log('123');
  };

  UserMessage = () => {
    return (
      <div className={styles.UserMassage}>
        <div className={styles.UserName}>
          <span style={{ margin: '30px' }}>
            <img
              style={{ width: '100px', borderRadius: '50%' }}
              src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2970597459,3762914954&fm=58&bpow=705&bpoh=675"
              alt=""
            />
          </span>
          <span>
            <span style={{ fontSize: '30px', margin: '10px' }}>罗鹏</span>
            <span>
              <span style={{}}>
                {1 > 2 ? (
                  <img
                    style={{ width: '12px', height: '12px', borderRadius: '50%' }}
                    src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2458720419,3434473651&fm=58&bpow=2592&bpoh=1944"
                    alt=""
                  />
                ) : (
                  <img
                    style={{ width: '12px', height: '12px', borderRadius: '50%' }}
                    src="https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3341195850,2802222578&fm=58&bpow=831&bpoh=623"
                    alt=""
                  />
                )}
              </span>
            </span>
            <a className={styles.report} onClick={this.handleShowReport}>
              <Icon type="flag" />举报
            </a>
          </span>
        </div>

        <div>
          {1 > 0 ? (
            <div className={styles.trust} onClick={this.handleTrust}>
              <Icon type="heart" style={{ color: '#fff', marginRight: '5px' }} />信任
            </div>
          ) : (
            <div className={styles.UNtrust}>
              <Icon type="heart" style={{ color: '#fff', marginRight: '5px' }} />信任
            </div>
          )}
          {1 > 0 ? (
            <div style={{ margin: '30px' }}>
              请 {this.handleLogin()} 或 {this.handleSign()} ， 将 {this.handleUserName()}{' '}
              设置为值得信任。30秒注册~
            </div>
          ) : (
            ''
          )}
        </div>
        <DescriptionList col={1} style={{ margin: '30px' }}>
          <Description term="国家" className={styles.countrys}>
            <img
              style={{ width: '30px', height: '20px' }}
              src="https://gss1.bdstatic.com/-vo3dSag_xI4khGkpoWK1HF6hhy/baike/w%3D268%3Bg%3D0/sign=f7623b467e8b4710ce2ffacafbf5a4c0/1b4c510fd9f9d72a2d9ad37ad82a2834359bbbdf.jpg"
              alt=""
            />
          </Description>
          <Description term="交易量" className={styles.UserStyle}>
            中文
          </Description>
          <Description term="已确认的交易次数" className={styles.UserStyle}>
            中文
          </Description>
          <Description term="评价得分" className={styles.UserStyle}>
            中文
          </Description>
          <Description term="第一次购买" className={styles.UserStyle}>
            中文
          </Description>
          <Description term="账户已创建" className={styles.UserStyle}>
            中文
          </Description>
          <Description term="最后一次上线" className={styles.UserStyle}>
            中文
          </Description>
          <Description term="语言" className={styles.UserStyle}>
            中文
          </Description>
          <Description term="信任" className={styles.UserStyle}>
            中文
          </Description>
        </DescriptionList>
      </div>
    );
  };

  columns = [
    {
      title: '付款方式',
      dataIndex: '1',
      width: '45%',
      render: text => {
        return <div>text</div>;
      },
    },
    {
      title: '价格',
      dataIndex: '2',
      width: '30%',
      render: text => {
        return <div>text</div>;
      },
    },
    {
      title: '',
      dataIndex: '3',
      width: '25%',
      render: () => {
        return (
          <div>
            {1 > 0 ? (
              <Button type="primary" className={styles.btnstyle}>
                买入
              </Button>
            ) : (
              <Button type="primary" className={styles.btnstyle}>
                卖出
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  handleTypeChange = e => {
    const type = e.target.value;
    this.setState({
      type,
    });
  };

  UserComment = () => {
    const typeMap = {
      1: '购买',
      2: '出售',
      3: '',
      4: '111111',
    };

    return (
      <div className={styles.comment}>
        <DescriptionList col={1} style={{ margin: '30px' }}>
          {/*获取接口评论数据遍历*/}
          {map(typeMap, (text, value) => (
            <Description term="👍" className={styles.UserStyle} key={value}>
              <li>{text}</li>
              <li>thanks nice trade with you,thanks nice trade with you</li>
            </Description>
          ))}
        </DescriptionList>
        <a className={styles.All}>显示所有用户评论</a>
      </div>
    );
  };

  handleShowReport = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  handleSubmit = e => {
    // this.props.dispatch({
    //   type:'',
    //   payload:{
    //     ...value
    //   }
    // })
  };

  showModal = () => {
    return (
      <div>
        <Modal
          title="举报用户"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={false}
        >
          <ReportForm onSubmit={this.handleSubmit} onCancel={this.handleCancel} />
        </Modal>
      </div>
    );
  };
  handleChange = id => {
    console.log(id);
    // this.props.dispatch({
    //   type:'',
    //   payload:{
    //     id
    //   }
    // })
  };

  render() {
    const { list = [{ id: 'a', 1: 'a', 2: '3', 3: 'ff' }], pagination = {}, loading } = this.props;
    const { type } = this.state;
    const typeMap = {
      1: '购买',
      2: '出售',
    };
    const { visible } = this.state;
    return (
      <BlankLayout>
        <div className={styles.background}>
          <div style={{ margin: '30px 0' }}>
            <h2>用户信息</h2>
          </div>
          {this.UserMessage()}
          <div>
            <div style={{ margin: '30px 0' }}>
              <h2>用户的其它交易广告</h2>
            </div>
            <div>
              <div className={styles.type_box}>
                <Radio.Group
                  size="large"
                  value={type}
                  onChange={this.handleTypeChange}
                  style={{ marginBottom: 8 }}
                >
                  {map(typeMap, (text, value) => (
                    <Radio.Button
                      key={value}
                      value={value}
                      onClick={this.handleChange.bind(this, value)}
                    >
                      {text}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
              <Table
                loading={loading}
                rowKey={record => record.id}
                dataSource={list}
                columns={this.columns}
                pagination={false}
                onChange={this.handleTableChange}
                footer={null}
              />
            </div>
          </div>

          <div>
            <div style={{ margin: '80px 0 30px' }}>
              <h2>评论</h2>
            </div>
          </div>
          <div>{this.UserComment()}</div>
        </div>
        {visible && this.showModal(visible)}
      </BlankLayout>
    );
  }
}
