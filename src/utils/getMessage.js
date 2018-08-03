import { map, chain, template, mapValues, pickBy, includes } from 'lodash';

const messageTemplates = {
  1: {
    noticeType: 'trade',
    group: '广告<%- message.ad_no %>有新消息',
    title: '广告编号<%- message.ad_no %>已被管理员下架',
    description: '下架原因:<%- message.reason %>',
    to: '/ad/my',
  },
  11: {
    noticeType: 'trade',
    group: '身份认证',
    title: '您提交的<%- message.step %>认证申请已通过审核',
    to: '/authentication'
  },
  12: {
    noticeType: 'trade',
    group: '身份认证',
    title: '您提交的<%- message.step %>认证申请审核失败',
    to: '/authentication'
  },
  21: {
    noticeType: 'trade',
    group: '转账',
    title: '您提交的提现审核已通过审核，请留意资产到账',
    to: '/wallet?activeKey=1'
  },
  22: {
    noticeType: 'trade',
    group: '转账',
    title: '您提交的提现审核失败',
    description: '驳回原因:<%- message.reason %>',
    to: '/wallet?activeKey=1'
  },
  31: {
    noticeType: 'system',
    group: '公告',
    title: '新增公告<%- title %>',
    to: (data = {}) => {
      let path = '/exception/500'
      if (data.message && data.message.ref_id) {
        const ref_id = data.message.ref_id
        path = `/message/info-detail/${ref_id}`
      }
      return path
    }
  },
  101: {
    noticeType: 'im',
    content: '<%= message.content %>'
  },
  102: {
    noticeType: 'im',
    content: (data) => {
      if (data.buyer) {
        return '订单数字币已经由系统锁定托管，买家请在订单有效期内付款并标记付款完成。'
      } else {
        return '订单数字币已经由系统锁定托管，卖家请确认款项到账后再释放数字币。'
      }
    }
  },
  103: {
    noticeType: 'im',
    content: '买家已付款，等待卖家确认'
  },
  104: {
    noticeType: 'im',
    content: '卖家已释放托管BTC，请留意资产到账。'
  },
  105: {
    noticeType: 'im',
    content: '<%= sender.nickname %>发起申诉，客服正在介入...'
  },
  106: {
    noticeType: 'im',
    content: '客服<%= sender.nickname %>发起申诉，已受理申诉。'
  },
  107: {
    noticeType: 'im',
    content: '申诉通过，系统将自动释放托管的BTC。'
  },
  108: {
    noticeType: 'im',
    content: '申诉驳回，系统已自动取消订单。'
  },
  109: {
    noticeType: 'im',
    content: '买家已取消交易，订单已关闭。'
  },
  110: {
    noticeType: 'im',
    content: '订单超时未处理，系统已自动关闭'
  },
  151: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息',
    title: '您有一笔新的交易订单',
    to: '/trade/step/<%= message.ref_id %>',
  },
  152: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息',
    title: '您有一笔订单尚未标记付款完成，订单将在五分钟后超时自动取消',
    to: '/trade/step/<%= message.ref_id %>',
  }, 
  153: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息',
    title: '您有一笔订单已被标记付款完成，请确认款项到账',
    to: '/trade/step/<%= message.ref_id %>',
  },
  154: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息',
    title: '您有一笔订单已被标记释放BTC，请留意资产到账',
    to: '/trade/step/<%= message.ref_id %>',
  },
  155: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息',
    title: '您有一笔订单已被买家取消',
    to: '/trade/step/<%= message.ref_id %>',
  },
  156: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息', 
    title: '您有一笔订单因超时未处理，已被系统自动取消',
    to: '/trade/step/<%= message.ref_id %>',
  },
  157: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息', 
    title: '您有一条新的交易评价',
    to: '/trade/step/<%= message.ref_id %>',
  },
  158: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息',
    title: '订单<%- id %>客服已介入申诉',
    to: '/trade/step/<%= message.ref_id %>',
  },
  159: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息',
    title: '订单<%= message.ref_no %>有新消息',
    description: '<%= sender.nickname %>给你发来新消息',
    to: '/trade/step/<%= message.ref_id %>',
  },
  160: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息',
    title: '订单<%= message.ref_no %>有新消息',
    description: '买家对订单<%= message.ref_no %>发起申诉',
  },
  161: {
    noticeType: 'trade',
    group: '订单<%= message.ref_no %>有新消息',
    title: '订单<%= message.ref_no %>有新消息',
    description: '卖家对订单<%= message.ref_no %>发起申诉',
  }
};

const Types = chain(messageTemplates)
  .map((data, key) => { return { msg_type: key, ...data } })
  .groupBy('noticeType') 
  .mapValues(d => map(d, 'msg_type'))
  .value()

export default function getMessage(data = {}, pickList = ['im', 'trade', 'system']) {
  if (!data.msg_type) return null;
  const pickedTemplates = pickBy(messageTemplates, t => includes(pickList, t.noticeType))
  if (!pickedTemplates[data.msg_type]) return null
  const msgTemplate = pickedTemplates[data.msg_type];
  const msg = mapValues(msgTemplate, (value) => {
    if (!value) return null;
    if (typeof value === 'string') {
      return template(value)(data);
    } else if (typeof value === 'function') {
      return value(data);
    } else {
      return null;
    }
  });
  return { ...data, ...msg };
}

getMessage.Types = Types
