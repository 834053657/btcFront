import { mapValues, template } from 'lodash';

const messageTemplates = {
  '1': {
    group: 'ad',
    title: '广告编号<%= ad_no %>已被管理员下架',
    description: '下架原因:{content.reason}',
    to: '/ad/my',
  },
};

export default function getMessage(content = {}) {
  if (!content.msg_type) return null;
  const msgTemplate = messageTemplates[content.msgType] || {};
  const msg = mapValues(msgTemplate, (key, value) => {
    if (!value) return null;
    if (typeof value === 'string') {
      return template(value, content);
    } else if (typeof value === 'function') {
      return template(content)();
    } else {
      return null;
    }
  });
  return { content, ...msg };
}
