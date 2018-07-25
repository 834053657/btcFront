import { map, chain, template, mapValues } from 'lodash';

const messageTemplates = {
  1: {
    noticeType: 'trade',
    group: '广告<%- content.ad_no %>有新消息',
    title: '广告编号<%- content.ad_no %>已被管理员下架',
    description: '下架原因:<%- content.reason %>',
    to: '/ad/my',
  },
  11: {
    noticeType: 'trade',
    group: '身份认证',
    title: '您提交的<%- content.step %>认证申请已通过审核'
  },
  12: {
    noticeType: 'trade',
    group: '身份认证',
    title: '您提交的<%- content.step %>认证申请审核失败'
  },
  21: {
    noticeType: 'trade',
    group: '转账',
    title: '您提交的提现审核已通过审核'
  },
  22: {
    noticeType: 'trade',
    group: '转账',
    title: '您提交的提现审核失败',
    description: '驳回原因:<%- content.reason %>'
  },
  31: {
    noticeType: 'system',
    group: '公告',
    title: '新增公告<%- title %>'
  },
  151: {
    noticeType: 'trade',
    group: '订单<%= content.ref_id %>有新消息',
    title: '您有一笔新的交易订单'
  },
  152: {
    noticeType: 'trade',
    group: '订单<%= content.ref_id %>有新消息',
    title: '您有一笔订单尚未标记付款完成，订单将在五分钟后超时自动取消'
  }, 
  153: {
    noticeType: 'trade',
    group: '订单<%= content.ref_id %>有新消息',
    title: '您有一笔订单已被标记付款完成，请确认款项到账'
  },
  154: {
    noticeType: 'trade',
    group: '订单<%= content.ref_id %>有新消息',
    title: '您有一笔订单已被标记释放BTC，请留意资产到账'
  },
  155: {
    noticeType: 'trade',
    group: '订单<%= content.ref_id %>有新消息',
    title: '您有一笔订单已被买家取消'
  },
  156: {
    noticeType: 'trade',
    group: '订单<%= content.ref_id %>有新消息', 
    title: '您有一笔订单因超时未处理，已被系统自动取消'
  },
  157: {
    noticeType: 'trade',
    group: '订单<%= content.ref_id %>有新消息', 
    title: '您有一条新的交易评价'
  },
  158: {
    noticeType: 'trade',
    group: '订单<%= content.ref_id %>有新消息',
    title: '订单<%- id %>客服已介入申诉'
  }
};

const Types = chain(messageTemplates)
  .map((data, key) => { return { msg_type: key, ...data } })
  .groupBy('noticeType') 
  .mapValues(d => map(d, 'msg_type'))
  .value()

export default function getMessage(data = {}) {
  if (!data.msg_type || messageTemplates[data.msg_type] == null) return null;
  const msgTemplate = messageTemplates[data.msg_type];
  const msg = mapValues(msgTemplate, (value) => {
    if (!value) return null;
    if (typeof value === 'string') {
      return template(value)(data);
    } else if (typeof value === 'function') {
      return value(data)();
    } else {
      return null;
    }
  });
  return { ...data, ...msg };
}

getMessage.Types = Types
