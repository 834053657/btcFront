import { getSystemUrl } from './utils';

const { base_url, web_name, socket_url } = getSystemUrl(__KG_API_ENV__);

export default {
  socket_url,
  base_url,
  web_name,
  videoAuthConcat: [
    {
      text: '客服电话1',
      account: '123',
    },
    {
      text: '客服电话2',
      account: '1234',
    },
    {
      text: '客服电话3',
      account: '1235',
    },
    {
      text: '客服QQ1',
      account: '312321312321',
    },
  ],
  web_sub_title: '比特币在线交易平台',
  verify_type: {
    sms: '手机验证',
    mail: '邮箱验证',
  },
  language: {
    en_GB: 'English',
    zh_CN: '简体中文',
  },
  payments: {
    alipay: '支付宝',
    bank: '银行卡',
    wechat: '微信',
    westernunion: '西联汇款',
    paytm: 'PayTm', // 印度支付宝
  },
  ad_type: {
    1: '买入',
    2: '出售',
  },
  auth_status: {
    1: '未认证',
    2: '认证中',
    3: '未通过',
    4: '已通过',
  },
  ad_status: {
    1: '已发布',
    2: '已暂停',
    3: '已冻结',
    4: '已取消',
    5: '已删除',
  },
  order_status: {
    1: '待付款',
    2: '已付款',
    3: '申述中',
    4: '已完成',
    5: '已取消',
  },
  currencyList: {
    CNY: '人民币',
    USD: '美元',
  },
  country: [
    {
      code: 'CN',
      name: '中国',
      nation_code: 86,
    },
    {
      code: 'HK',
      name: '香港',
      nation_code: 852,
    },
  ],
  countrysMap: {},
  message_type_zh_CN: {
    1: '系统资讯',
    11: '您的{auth_type}已通过',
    12: '您的{auth_type}未通过',
    21: '您的{payment_method}{account}审核已通过',
    22: '您的{payment_method}{account}审核未通过',
    31: '您的提现请求审核已通过',
    32: '您的提现请求审核未通过',
    33: '您的充值请求审核已通过',
    34: '您的充值请求审核未通过',
    41: '交易条款"{title}"审核已通过',
    42: '交易条款"{title}"审核未通过',
    101: '{dealer}向您出售{goods_type}',
    102: '{dealer}向您购买{goods_type}',
    103: '您有新的订单待查收，请在10分钟内确认',
    104: '您有新的订单消息',
    105: '订单{order_no}超出保障时间，已自动释放',
    106: '{dealer}已取消订单',
    107: '{dealer}发起了申诉',
    108: '您有新的申诉消息',
    109: '客服已释放订单{order_no}',
    110: '客服已取消订单{order_no}',
    111: '{dealer}已释放订单{order_no}',
    112: '订单{order_no}超出查收时间，已自动取消',
    113: '订单{order_no}超出发卡时间，已自动取消',
    114: '{dealer}已查收，请耐心等待释放',
    131: '您的广告卡密已经出售完，广告已自动暂停',
    132: '您的余额不足，广告已自动暂停',
    133: '同时处理订单数达到最大，广告已自动暂停',
  },
  message_type_en_GB: {
    1: '系统资讯',
    11: '您的{auth_type}已通过',
    12: '您的{auth_type}未通过',
    21: '您的{payment_method}{account}审核已通过',
    22: '您的{payment_method}{account}审核未通过',
    31: '您的提现请求审核已通过',
    32: '您的提现请求审核未通过',
    33: '您的充值请求审核已通过',
    34: '您的充值请求审核未通过',
    41: '交易条款"{title}"审核已通过',
    42: '交易条款"{title}"审核未通过',
    101: '{dealer}向您出售{goods_type}',
    102: '{dealer}向您购买{goods_type}',
    103: '您有新的订单待查收，请在10分钟内确认',
    104: '您有新的订单消息',
    105: '订单{order_no}超出保障时间，已自动释放',
    106: '{dealer}已取消订单',
    107: '{dealer}发起了申诉',
    108: '您有新的申诉消息',
    109: '客服已释放订单{order_no}',
    110: '客服已取消订单{order_no}',
    111: '{dealer}已释放订单{order_no}',
    112: '订单{order_no}超出查收时间，已自动取消',
    113: '订单{order_no}超出发卡时间，已自动取消',
    114: '{dealer}已查收，请耐心等待释放',
    131: '您的广告卡密已经出售完，广告已自动暂停',
    132: '您的余额不足，广告已自动暂停',
    133: '同时处理订单数达到最大，广告已自动暂停',
  },
  tradeType: {
    1: '交易',
    2: '充值',
    3: '提现',
  },
  paymentStatus: {
    1: '已付款',
    2: '未付款',
  },
  orderEngStatus: {
    1: 'wait_pay',
    2: 'wait_release',
    3: 'done',
    4: 'cancel',
    5: 'appeal',
  },
  articleList: {
    agreement: '服务条款',
    duty: '免责申明',
    about: '团队介绍',
    privacy: '隐私保护',
    fee: '费率说明',
    course: '新手教程',
    problem: '常见问题',
    operate: '操作指南',
    safe: '安全指南',
  },
  //社交账号
  QQ: {
    1: '客服： 乌小笨',
    2: '客服： 乌小辉',
    3: '客服： 乌小贤',
    4: '客服： 乌小博',
    5: '客服： 乌小刚',
    6: '客服： 乌小新',
    7: '客服： 乌小明',
  },
  //账号对应的链接
  QQ_link: {
    1: 'http://wpa.qq.com/msgrd?v=3&uin=3002734213&site=qq&menu=yes',
    2: 'http://wpa.qq.com/msgrd?v=3&uin=3002791486&site=qq&menu=yes',
    3: 'http://wpa.qq.com/msgrd?v=3&uin=3002752935&site=qq&menu=yes',
    4: 'http://wpa.qq.com/msgrd?v=3&uin=3002733618&site=qq&menu=yes',
    5: 'http://wpa.qq.com/msgrd?v=3&uin=3002772861&site=qq&menu=yes',
    6: 'http://wpa.qq.com/msgrd?v=3&uin=3002763180&site=qq&menu=yes',
    7: 'http://wpa.qq.com/msgrd?v=3&uin=3002793748&site=qq&menu=yes',
  },
  //邮箱
  Email: {
    1: 'contact@utomarket.com',
  },
  //微信二维码图片
  WeChat: {
    1: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=2136740882,3271518133&fm=58&bpow=630&bpoh=630',
  },
  //微博二维码图片
  weibo: {
    1: 'https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1426575500,1228520832&fm=58&bpow=727&bpoh=536',
  },

  transaction_status: {
    '1': '待审核',
    '2': '已取消',
    '3': '已发送',
    '4': '待确认',
    '5': '已收到',
  },
  //从字典中复制过来的
  order_type: {
    '1': '买入',
    '2': '出售',
  },
  startList: {
    1: {
      title: '可信任的',
      subTitle: '增加他的信誉并将他标记为值得信赖的用户',
    },
    2: {
      title: '好评',
      subTitle: '对您的交易伙伴做出好评，这将会增加他的信誉',
    },
    3: {
      title: '中评',
      subTitle: '对您的交易伙伴做出中评，这将不会影响他的信誉',
    },
    4: {
      title: '差评及屏蔽',
      subTitle: '这将降低他的信誉',
    },
    5: {
      title: '无反馈屏蔽',
      subTitle: '阻止交易伙伴与您进行交易，不要给他任何评价。',
    },
  },
  order_type_desc: {
    '1': '买',
    '2': '卖',
  },

  card_type: [],
};
