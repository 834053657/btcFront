import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {FormattedMessage as FM ,defineMessages} from 'react-intl';
import {injectIntl } from 'components/_utils/decorator';
import moment from 'moment';
import cx from 'classnames';
import { Link } from 'dva/router';
import {
  Row,
  Col,
  Avatar,
  Divider,
  Upload,
  message,
  Button,
  Icon,
  Modal,
  Popconfirm,
  Popover,
} from 'antd';
import { map, omit, size } from 'lodash';
import { AuthStep } from 'components/Authentication';
import G2Validation from 'components/G2Validation';
import DescriptionList from 'components/DescriptionList';
import { getPayIcon } from '../../utils/utils';
import EmailModal from './modals/EmailModal';
import MobileModal from './modals/MobileModal';
import PayMethodModal from './modals/PayMethodModal';
import PwdModal from './modals/PwdModal';
import RealNameForm from './forms/RealNameForm';
import VideoAuthForm from './forms/VideoAuthForm';
import CountryModal from './modals/CountryModal';
import styles from './UserCenterPage.less';

const { Description } = DescriptionList;
const msg = defineMessages({
  change_photo_true: {
    id: 'userCenterPage.change_photo_true',
    defaultMessage: '修改头像成功',
  },

  change_photo_false: {
    id: 'userCenterPage.change_photo_false',
    defaultMessage: '上传错误，可能请求已过期，请刷新页面重试',
  },
  user_photo_limit: {
    id: 'userCenterPage.user_photo_limit',
    defaultMessage: '头像必须小于2M!',
  },
  user_change_payments: {
    id: 'userCenterPage.user_change_payments',
    defaultMessage: '修改支付方式',
  },
  user_add_payments: {
    id: 'userCenterPage.user_add_payments',
    defaultMessage: '添加支付方式',
  },
});
@injectIntl()

@connect(({ authentication, global, user, loading }) => ({
  authentication,
  currentUser: user.currentUser,
  loading: loading.models.global,
}))
export default class UserCenterPage extends Component {
  state = {
    emailModalVisible: false,
    mobileModalVisible: false,
    pwdModalVisible: false,
    g2ModalVisible: false,
    realNameModalVisible: false,
    videoAuthModalVisible: false,
    payMethodModalVisible: false,
    uploadLoading: false,
    countryModalVisible: false,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
  }

  componentWillUnmount() {}

  hideEmailModal = () => {
    this.setState({
      emailModalVisible: false,
    });
  };

  showEmailModal = () => {
    this.setState({
      emailModalVisible: true,
    });
  };

  hideMobilelModal = () => {
    this.setState({
      mobileModalVisible: false,
    });
  };

  showMobileModal = () => {
    this.setState({
      mobileModalVisible: true,
    });
  };

  hidePwdlModal = () => {
    this.setState({
      pwdModalVisible: false,
    });
  };

  showPwdeModal = () => {
    this.setState({
      pwdModalVisible: true,
    });
  };

  showG2Modal = () => {
    this.setState({
      g2ModalVisible: true,
    });
  };

  hideG2Modal = () => {
    this.setState({
      g2ModalVisible: false,
    });
  };

  handleSubmitG2 = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'user/submitChangeG2Validate',
        payload: {
          enable: false,
          code: values.code,
        },
        callback: this.hideG2Modal,
      });
    }
  };

  showRealNameModal = () => {
    this.setState({
      realNameModalVisible: true,
    });
  };

  hideRealNameModal = () => {
    this.setState({
      realNameModalVisible: false,
    });
  };

  hideVideoAuthModal = () => {
    this.setState({
      videoAuthModalVisible: false,
    });
  };

  showVideoAuthModal = () => {
    this.setState({
      videoAuthModalVisible: true,
    });
  };

  handleSubmitRealName = auth_detail => {
    this.props.dispatch({
      type: 'user/submitUserAuth',
      payload: {
        auth_type: 1,
        auth_detail,
      },
      callback: this.hideRealNameModal,
    });
  };

  hidePayMethodModal = () => {
    this.setState({
      payMethodModalVisible: false,
    });
  };

  showPayMethodModal = (data = true) => {
    this.setState({
      payMethodModalVisible: data,
    });
  };

  showCountryModal = () => {
    this.setState({
      countryModalVisible: true,
    });
  };
  hideCountryModal = () => {
    this.setState({
      countryModalVisible: false,
    });
  };

  renderRealNameModal = () => {
    const { realNameModalVisible } = this.state;
    const { currentUser } = this.props;
    const { auth } = currentUser || {};
    const { real_name = {} } = auth || {};
    const { auth_detail = {} } = real_name || {};
    return (
      <Modal
        width={500}
        title={<FM id='userCenterPage.user_real_name' defaultMessage='实名认证' />}
        visible={realNameModalVisible}
        onCancel={this.hideRealNameModal}
        maskClosable={false}
        footer={null}
      >
        {realNameModalVisible && (
          <RealNameForm
            initialValues={auth_detail}
            onCancel={this.hideRealNameModal}
            onSubmit={this.handleSubmitRealName}
          />
        )}
      </Modal>
    );
  };

  renderVideoAuthModal = () => {
    const { videoAuthModalVisible } = this.state;
    return (
      <Modal
        width={500}
        title={<FM id='tradeStep.video_approve' defaultMessage='视频认证' />}
        visible={videoAuthModalVisible}
        onCancel={this.hideVideoAuthModal}
        maskClosable={false}
        footer={null}
      >
        {videoAuthModalVisible && <VideoAuthForm />}
      </Modal>
    );
  };

  handleGetLevel = user => {
    let level = <span className={styles.low}><FM id='userCenterPage.passWorld_low_title' defaultMessage='低' /></span>;
    if (user.email) {
      level = <span className={styles.low}><FM id='userCenterPage.passWorld_low' defaultMessage='低' /></span>;
    }
    if (user.email && (user.g2fa_on || user.telephone)) {
      level = <span className={styles.middle}><FM id='userCenterPage.passWorld_middle' defaultMessage='中' /></span>;
    }
    if (user.email && user.telephone && user.g2fa_on) {
      level = <span className={styles.hight}><FM id='userCenterPage.passWorld_high' defaultMessage='高' /></span>;
    }

    return level;
  };

  getMethodContent = item => {
    const { payment_method, payment_detail = {} } = item || {};
    let content = '';

    switch (payment_method) {
      case 'wechat':
      case 'alipay':
      case 'paytm':
        content = (
          <div className={styles.box_item_content}>
            <div className={styles.mb4}>{payment_detail.name}</div>
            <div>{payment_detail.account}</div>
          </div>
        );
        break;
      case 'bank':
        content = (
          <div className={styles.box_item_content}>
            <div className={styles.mb4}>{payment_detail.name}</div>
            {/*<div>{payment_detail.bank_name}</div>*/}
            <div>{payment_detail.bank_account}</div>
          </div>
        );
        break;
      case 'westernunion':
        content = (
          <div className={styles.box_item_content}>
            <div className={styles.mb4}>{payment_detail.name}</div>
            <div>{payment_detail.account}</div>
          </div>
        );
        break;
    }
    return content;
  };

  handleDeletePayMethod = async id => {
    this.props.dispatch({
      type: 'user/submitDeleteUserPayMethod',
      payload: {
        id,
      },
    });
  };
  uploadHandler = info => {
    const { upload } = this.props.currentUser || {};

    if (info.file.status === 'uploading') {
      this.setState({
        uploadLoading: true,
      });
    } else if (info.file.status === 'done') {
      const avatar = upload.prefix + info.file.response.hash;
      this.props.dispatch({
        type: 'user/submitChangeAvatar',
        payload: {
          avatar,
        },
        callback: () => {
          message.success(this.props.intl.formatMessage(msg.change_photo_true));
          this.setState({ uploadLoading: false });
        },
      });
    } else if (info.file.status === 'error') {
      this.setState({ uploadLoading: false });
      message.error(this.props.intl.formatMessage(msg.change_photo_false));
    }
  };

  beforeUpload = file => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(this.props.intl.formatMessage(msg.user_photo_limit));
    }
    return isLt2M;
  };

  render() {
    const {
      emailModalVisible,
      mobileModalVisible,
      g2ModalVisible,
      realNameModalVisible,
      pwdModalVisible,
      payMethodModalVisible,
      uploadLoading,
      countryModalVisible,
    } = this.state;
    const { currentUser, authentication } = this.props;
    const { auth, user = {}, payments = [], upload = {}, trade = {} } = currentUser || {};
    const { real_name = {}, video = {} } = auth || {};
    const real_name_status = real_name.status || 1;
    const video_status = video.status || 1;
    const { first_trade_at } = trade || {};
    const existsPayments = map(payments, item => item.payment_method);
    const ENABLE_PAY_MENTS = omit(CONFIG.payments, existsPayments);

    return (
      <Fragment>
        <Row gutter={24} className={styles.user_center}>
          <Col span={8}>
            <div className={styles.left}>
              <div className={styles.left_wrapper}>
                <div className={styles.user_info}>
                  <Avatar size="lager" className={styles.avatar} src={user.avatar} />
                  <div className={styles.info}>
                    <div className={styles.name}>{user.nickname}</div>
                    <div className={styles.uid}>UID: {user.id}</div>
                  </div>
                </div>
                <div>
                  <Upload
                    name="file"
                    accept="image/gif, image/png, image/jpg, image/jpeg, image/bmp"
                    beforeUpload={this.beforeUpload}
                    // fileList={false} // 请勿添加此属性 否则 onchange status 不改变
                    showUploadList={false}
                    action={upload.domain}
                    onChange={this.uploadHandler}
                    data={{ token: upload.token }}
                  >
                    <Button disabled={uploadLoading}>
                      <Icon type={uploadLoading ? 'loading' : 'upload'} /> <FM id='userCenterPage.user_photo_upload' defaultMessage='上传头像' />
                    </Button>
                  </Upload>
                </div>
                <Divider />
                <DescriptionList col={1} className={styles.detailBox}>
                  <Description term={<FM id='userCenterPage.good_ratio' defaultMessage='好评率' />}>{trade.good_ratio || 0}%</Description>
                  <Description term={<FM id='userCenterPage.trust_count' defaultMessage='信任数' />}><FM id='userCenterPage.user_trust' defaultMessage='被{num}人信任' values={{num:user.trust_count || 0}} /></Description>
                  <Description term={<FM id='userCenterPage.block_count' defaultMessage='屏蔽数' />}><FM id='userCenterPage.user_un_look' defaultMessage='被{num}人屏蔽' values={{num:user.block_count || 0}} /></Description>
                  <Description term={<FM id='userCenterPage.trade_volume' defaultMessage='已完成交易量' />}>{trade.trade_volume} BTC
                  </Description>
                  <Description term={<FM id='userCenterPage.last_login_at' defaultMessage='最后上线时间' />}>
                    {moment(user.last_login_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
                  </Description>
                </DescriptionList>
                <Divider />
                <p>
                  <FM id='userCenterPage.account_create_at' defaultMessage='本帐号于' />{' '}
                  <span>
                    {user.created_at
                      ? moment(user.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')
                      : '-'}
                  </span>{' '}
                  <FM id='userCenterPage.account_sign_in' defaultMessage='注册' />
                </p>
                <p>
                  {first_trade_at
                    ? <FM id='userCenterPage.account_first_deal' defaultMessage='首次交易于 {time}' values={{time:moment(first_trade_at * 1000).format('YYYY-MM-DD HH:mm:ss')}} />
                    : null}
                </p>
              </div>
            </div>
          </Col>
          <Col span={16}>
            <div className={styles.right}>
              {/* 账号与安全 */}
              <div className={styles.box}>
                <div className={styles.box_head}>
                  <div className={styles.box_head_wrapper}>
                    <div className={styles.box_head_title}><FM id='userCenterPage.account_safe' defaultMessage='账号与安全' /></div>
                    <div className={styles.box_head_extra}>
                      <span> <FM id='userCenterPage.account_safe_lave' defaultMessage='安全等级:' />{this.handleGetLevel(user)}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.box_content}>
                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="global" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}><FM id='userCenterPage.user_country' defaultMessage='国家' /></h4>
                        <div className={styles.box_item_descript}>
                          {user.country_code ? <FM id='userCenterPage.user_country_choose' defaultMessage='已选择' /> : <FM id='userCenterPage.user_country_unChoose' defaultMessage='未选择' />}
                        </div>
                      </div>
                    </div>
                    <div className={styles.box_item_content}>
                      {user.country_code && CONFIG.countrysMap[user.country_code]
                        ? CONFIG.countrysMap[user.country_code].name
                        : null}
                    </div>
                    <ul className={styles.box_item_action}>
                      <li>
                        <a onClick={this.showCountryModal}><FM id='userCenterPage.user_country_btn_choose' defaultMessage='选择' /></a>
                      </li>
                    </ul>
                  </div>

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="mail" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}><FM id='userCenterPage.user_Email' defaultMessage='邮箱' /></h4>
                        <div className={styles.box_item_descript}>
                          {user.email ? <FM id='userCenterPage.user_Email_bind' defaultMessage='已绑定' /> : <FM id='userCenterPage.user_Email_unBind' defaultMessage='未绑定' />}
                        </div>
                      </div>
                    </div>
                    <div className={styles.box_item_content}>{user.email}</div>
                    <ul className={styles.box_item_action}>
                      <li>
                        <a onClick={this.showEmailModal}>{user.email ? <FM id='userCenterPage.user_Email_change' defaultMessage='修改' /> : <FM id='userCenterPage.user_Email_toBind_btn' defaultMessage='绑定' />}</a>
                      </li>
                    </ul>
                  </div>

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="mobile" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}><FM id='userCenterPage.mobile_num' defaultMessage='手机' /></h4>
                        <div className={styles.box_item_descript}>
                          {user.telephone ? <FM id='userCenterPage.mobile_binding' defaultMessage='已绑定' /> : <FM id='userCenterPage.mobile_unBind' defaultMessage='未绑定' />}
                        </div>
                      </div>
                    </div>
                    <div className={styles.box_item_content}>{user.telephone}</div>
                    <ul className={styles.box_item_action}>
                      <li>
                        <a onClick={this.showMobileModal}>{user.telephone ? <FM id='userCenterPage.mobile_change_' defaultMessage='修改' /> : <FM id='userCenterPage.mobile_toBind_' defaultMessage='绑定' /> }</a>
                      </li>
                    </ul>
                  </div>

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="chrome" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}><FM id='userCenterPage.chrome_code' defaultMessage='谷歌验证码' /></h4>
                        <div className={styles.box_item_descript}>
                          {user.g2fa_on ? <FM id='userCenterPage.chrome_binding' defaultMessage='已绑定' /> :  <FM id='userCenterPage.chrome_unBind' defaultMessage='未绑定' />}
                        </div>
                      </div>
                    </div>
                    <div className={styles.box_item_content} />
                    <ul className={styles.box_item_action}>
                      <li>
                        {user.g2fa_on ? (
                          <a onClick={this.showG2Modal}><FM id='userCenterPage.chrome_unUse' defaultMessage='停用' /></a>
                        ) : (
                          <Link to="/user-center/g2validate"><FM id='userCenterPage.chrome_set' defaultMessage='设置' /></Link>
                        )}
                      </li>
                    </ul>
                  </div>

                  <div className={styles.box_item}>
                    <div className={styles.box_item_meta}>
                      <Icon type="unlock" />
                      <div className={styles.box_item_meta_head}>
                        <h4 className={styles.box_item_title}><FM id='userCenterPage.lock_passWord' defaultMessage='登录密码' /></h4>
                        <div className={styles.box_item_descript} />
                      </div>
                    </div>
                    <div className={styles.box_item_content} />
                    <ul className={styles.box_item_action}>
                      <li>
                        <a onClick={this.showPwdeModal}><FM id='userCenterPage.lock_passWord_change' defaultMessage='修改' /></a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 身份认证 */}
              <div className={styles.box}>
                <div className={styles.box_head}>
                  <div className={styles.box_head_wrapper}>
                    <div className={styles.box_head_title}><FM id='userCenterPage.user_personal_approve' defaultMessage='身份认证' /></div>
                    <div className={styles.box_head_extra}>
                      {authentication.step === 0 && authentication.status !== 4 ? (
                        <span><FM id='userCenterPage.user_personal_unApprove' defaultMessage='未认证' /></span>
                      ) : (
                        <span>
                          <FM id='userCenterPage.user_personal_approve_lave' defaultMessage='认证等级:' />{' '}
                          {'C' + (authentication.step + (authentication.status === 4 ? 1 : 0))}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.box_head_subtitle}>
                    <FM id='userCenterPage.user_personal_approve_affirm' defaultMessage='请如实填写您的身份信息，一经认证不可修改 ' />
                  </div>
                </div>
                <AuthStep
                  hideGotoButton={authentication.step > 1 && authentication.status === 4}
                  step={this.props.authentication.step}
                  className={styles.box_content}
                  status={this.props.authentication.status}
                />
              </div>

              {/* 支付方式 */}
              <div className={styles.box}>
                <div className={styles.box_head}>
                  <div className={styles.box_head_wrapper}>
                    <div className={styles.box_head_title}><FM id='userCenterPage.user_payment' defaultMessage='支付方式' /></div>
                  </div>
                  <div className={styles.box_head_subtitle}><FM id='userCenterPage.user_real_name_account' defaultMessage='请务必使用您本人的实名账号' /></div>
                </div>
                <div className={styles.box_content}>
                  {map(payments, item => {
                    return (
                      <div key={item.id} className={styles.box_item}>
                        <div className={styles.box_item_meta}>
                          <Icon type={getPayIcon(item.payment_method)} />
                          <div className={styles.box_item_meta_head}>
                            <h4 className={styles.box_item_title}>
                              {item.payment_method && CONFIG.payments[item.payment_method]
                                ? CONFIG.payments[item.payment_method]
                                : '-'}
                            </h4>
                            {/*<div className={styles.box_item_descript}>
                              {item.status && CONFIG.auth_status[item.status]
                                ? CONFIG.auth_status[item.status]
                                : '-'}
                              {item.status === 3 ? (
                                <Popover
                                  placement="bottomRight"
                                  title="审核反馈"
                                  content={item.reason}
                                  trigger="click"
                                >
                                  <a> 原因 </a>
                                </Popover>
                              ) : null}
                            </div>*/}
                          </div>
                        </div>
                        {this.getMethodContent(item)}
                        <ul className={styles.box_item_action}>
                          <li>
                            <a onClick={this.showPayMethodModal.bind(this, item)}><FM id='userCenterPage.payments_setting' defaultMessage='设置' /></a>
                          </li>
                          <li>
                            <Popconfirm
                              title={<FM id='userCenterPage.user_sure_delete' defaultMessage='确定要删除吗?' />}
                              onConfirm={this.handleDeletePayMethod.bind(this, item.id)}
                            >
                              <a className="text-red"><FM id='userCenterPage.user_sure_delete_btn' defaultMessage='删除' /></a>
                            </Popconfirm>
                          </li>
                        </ul>
                      </div>
                    );
                  })}
                </div>
                {size(ENABLE_PAY_MENTS) > 0 && (
                  <div className={styles.box_footer}>
                    <a onClick={this.showPayMethodModal}>
                      <Icon type="plus" /> <FM id='userCenterPage.user_add_new' defaultMessage='添加新的支付方式' />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {countryModalVisible && (
              <CountryModal
                {...this.props}
                // email={user.email}
                visible={countryModalVisible}
                onCancel={this.hideCountryModal}
              />
            )}

            {emailModalVisible && (
              <EmailModal
                {...this.props}
                email={user.email}
                visible={emailModalVisible}
                onCancel={this.hideEmailModal}
              />
            )}

            {mobileModalVisible && (
              <MobileModal
                {...this.props}
                visible={mobileModalVisible}
                onCancel={this.hideMobilelModal}
              />
            )}

            {pwdModalVisible && (
              <PwdModal {...this.props} visible={pwdModalVisible} onCancel={this.hidePwdlModal} />
            )}

            {/*{this.renderPwdModal()}*/}

            <G2Validation
              title={<FM id='userCenterPage.user_safe_verify' defaultMessage='安全验证' />}
              visible={g2ModalVisible}
              onCancel={this.hideG2Modal}
              onSubmit={this.handleSubmitG2}
            />

            {this.renderRealNameModal()}

            {this.renderVideoAuthModal()}

            <PayMethodModal
              {...this.props}
              payMents={ENABLE_PAY_MENTS}
              title={payMethodModalVisible && payMethodModalVisible.id ?
                (this.props.intl.formatMessage(msg.user_change_payments))
                :
                (this.props.intl.formatMessage(msg.user_add_payments))
              }
              data={payMethodModalVisible}
              onCancel={this.hidePayMethodModal}
            />
          </Col>
        </Row>
      </Fragment>
    );
  }
}
