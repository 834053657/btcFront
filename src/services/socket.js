import { stringify } from 'qs';
import request from '../utils/request';

export async function push_system_message(params) {
  return request(`/btc/socket/push_system_message?${stringify(params)}`);
}

export async function enter_chat_room(params) {
  return request(`/btc/socket/enter_chat_room?${stringify(params)}`);
}

export async function leave_chat_room(params) {
  return request(`/btc/socket/leave_chat_room?${stringify(params)}`);
}

export async function receive_message(params) {
  return request(`/btc/socket/receive_message?${stringify(params)}`);
}

export async function auth_status_update(params) {
  return request(`/btc/socket/auth_status_update?${stringify(params)}`);
}
