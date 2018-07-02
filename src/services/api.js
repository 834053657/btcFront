import { stringify } from 'qs';
import request from '../utils/request';

export async function queryBanners() {
  return request('/itunes/info/banners');
}

export async function queryInfoList(params) {
  return request(`/itunes/info/all?${stringify(params)}`);
}

export async function queryInfoDtl(params) {
  return request(`/itunes/info/detail?${stringify(params)}`);
}

export async function queryMessageList(params) {
  return request(`/itunes/message/all?${stringify(params)}`);
}

export async function queryMoreMessageList(params) {
  return request(`/itunes/message/more?${stringify(params)}`);
}

export async function readMessage(params) {
  return request('/itunes/message/read', {
    method: 'POST',
    body: params,
  });
}

export async function readOrderMessage(params) {
  return request('/itunes/message/read_chat', {
    method: 'POST',
    body: params,
  });
}

export async function queryChatHistory(params) {
  return request(`/itunes/message/get_chat_history?${stringify(params)}`);
}

export async function queryPayments(params) {
  return request('/itunes/wallet/platform/payments');
}

export async function queryFee(params) {
  return request('/itunes/wallet/fee', {
    method: 'POST',
    body: params,
  });
}

export async function userRecharge(params) {
  return request('/itunes/wallet/recharge', {
    method: 'POST',
    body: params,
  });
}

export async function userWithdraw(params) {
  return request('/itunes/wallet/withdraw', {
    method: 'POST',
    body: params,
  });
}

export async function queryMyAdList(params) {
  return request(`/itunes/user/ad/all?${stringify(params)}`);
}

export async function queryTermsList(params) {
  return request(`/itunes/user/trans_term/all?${stringify(params)}`);
}

export async function fakeAd(params) {
  return request('/itunes/user/ad/status', {
    method: 'POST',
    body: params,
  });
}

export async function removeAd(params) {
  return request('/itunes/user/my_ad/delete', {
    method: 'POST',
    body: params,
  });
}

export async function fakeTerms(params) {
  return request('/itunes/user/trans_term/update', {
    method: 'POST',
    body: params,
  });
}

export async function removeTerms(params) {
  return request('/itunes/user/trans_term/delete', {
    method: 'POST',
    body: params,
  });
}

export async function queryStaticDtl(params) {
  return request(`/itunes/config/footer?${stringify(params)}`);
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function accountLogin(params) {
  return request('/itunes/user/login', {
    method: 'POST',
    body: params,
  });
}

// -------------- 注册 start --------------

export async function fakeRegister(params) {
  return request('/itunes/user/register', {
    method: 'POST',
    body: params,
  });
}

export async function postVerify(params) {
  return request('/itunes/user/send_code', {
    method: 'POST',
    body: params,
  });
}

// -------------- 注册 end --------------

export async function postVerifyCaptcha(params) {
  return request('/itunes/user/verify_code', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function queryStatistics() {
  return request('/itunes/statistics/trade');
}

export async function queryConfigs() {
  return request('/itunes/defines');
}

//礼品卡列表actions开始

export async function getCardlist(params) {
  return request(`/itunes/ad/card/all?${stringify(params)}`);
}

// //获取交易条款
// export async function getTransTerms(params) {
//   return request(`/itunes/user/trans_term/all?${stringify(params)}`);
// }

// 出售创建订单
export async function createSellOrder(params) {
  return request('/itunes/order/sell/create', {
    method: 'POST',
    body: params,
  });
}

// 购买创建订单
export async function createBuyOrder(params) {
  return request('/itunes/order/buy/create', {
    method: 'POST',
    body: params,
  });
}

//获取订单详情
export async function getOrderDetail(params) {
  if (!params) {
    return false;
  }
  console.log('params');
  console.log(params);
  return request(`/itunes/order/detail?${stringify(params)}`);
}

//getToken
export async function getToken(params) {
  return request('/itunes/user/upload_token', {
    method: 'POST',
    body: params,
  });
}

//创建出售
export async function addSellAd(params) {
  console.log('post postSell in api');
  return request('/itunes/ad/card/sell', {
    method: 'POST',
    body: params,
  });
}

//创建购买广告
export async function addBuyAd(params) {
  return request('/itunes/ad/card/buy', {
    method: 'POST',
    body: params,
  });
}

//创建购买
export async function getAdDetail(params) {
  return request(`/itunes/ad/card/detail?${stringify(params)}`);
}

//创建出售
export async function getSellDetail(params) {
  return request(`/itunes/ad/card/sell/detail?${stringify(params)}`);
}

//获取申诉详情
export async function getAppealInfo(params) {
  return request(`/itunes/message/get_chat_history?${stringify(params)}`);
}

export async function postCheck(params) {
  return request('/itunes/order/check', {
    method: 'POST',
    body: params,
  });
}

//礼品卡列表actions结束

export async function getCaptcha(params) {
  return request(`/itunes/user/captcha?${stringify(params)}`);
}

//发送CDK
export async function sendCDK(params) {
  return request('/itunes/order/ship', {
    method: 'POST',
    body: params,
  });
}

//取消订单
export async function cacelOrder(params) {
  return request('/itunes/order/cancel', {
    method: 'POST',
    body: params,
  });
}

//释放订单
export async function releaseOrder(params) {
  return request('/itunes/order/release', {
    method: 'POST',
    body: params,
  });
}

//申诉
export async function appealOrder(params) {
  return request('/itunes/order/appeal', {
    method: 'POST',
    body: params,
  });
}

//评价订单
export async function ratingOrder(params) {
  return request('/itunes/order/rating', {
    method: 'POST',
    body: params,
  });
}

//发送快捷短语
export async function sendQuickMsg(params) {
  return request('/itunes/socket/post_quick_message', {
    method: 'POST',
    body: params,
  });
}

//礼品卡列表actions结束

export async function getTransfers(params) {
  return request(`/itunes/wallet/tansaction?${stringify(params)}`);
}
