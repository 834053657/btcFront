import { stringify } from 'qs';
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/itunes/user/info');
}

export async function forgetPassword(params) {
  return request('/itunes/user/forget_password', {
    method: 'POST',
    body: params,
  });
}

/**
 * 忘记密码后 修改密码
 * @param params
 * @returns {Promise<Object>}
 */
export async function resetPassword(params) {
  const { code, new_password } = params || {};
  return request('/itunes/user/reset_password', {
    method: 'POST',
    body: {
      code,
      new_password,
    },
  });
}

/**
 * 用户主动修改密码
 * @param params
 * @returns {Promise<Object>}
 */
export async function updatePassword(params) {
  const { old_password, password: new_password } = params || {};
  return request('/itunes/user/update_password', {
    method: 'POST',
    body: {
      old_password,
      new_password,
    },
  });
}

export async function updateEmail(params) {
  return request('/itunes/user/update_email', {
    method: 'POST',
    body: params,
  });
}

export async function updateMobile(params) {
  return request('/itunes/user/update_telephone', {
    method: 'POST',
    body: params,
  });
}

export async function updateG2Validate(params) {
  return request('/itunes/user/2fa_validate', {
    method: 'POST',
    body: params,
  });
}

export async function postAuth(params) {
  return request('/itunes/user/auth', {
    method: 'POST',
    body: params,
  });
}

export async function postPayMethod(params) {
  return request('/itunes/user/payment/update', {
    method: 'POST',
    body: params,
  });
}

export async function deletePayMethod(params) {
  return request('/itunes/user/payment/delete', {
    method: 'POST',
    body: params,
  });
}

export async function updateAvatar(params) {
  return request('/itunes/user/avatar', {
    method: 'POST',
    body: params,
  });
}

export async function getG2Secret(params) {
  return request(`/itunes/user/2fa_secret?${stringify(params)}`);
}

export async function queryMyOrderList(params) {
  return request(`/itunes/user/order/all?${stringify(params)}`);
}
