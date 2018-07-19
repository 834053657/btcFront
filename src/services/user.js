import { stringify } from 'qs';
import request from '../utils/request';

export async function queryCurrent() {
  return request('/btc/user/info');
}

export async function forgetPassword(params) {
  return request('/btc/user/forget_password', {
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
  return request('/btc/user/reset_password', {
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
  const { old_password, password: new_password, verify_token } = params || {};
  return request('/btc/user/update_password', {
    method: 'POST',
    body: {
      old_password,
      new_password,
      verify_token,
    },
  });
}

export async function updateEmail(params) {
  return request('/btc/user/update_email', {
    method: 'POST',
    body: params,
  });
}

export async function updateCountry(params) {
  return request('/btc/user/country', {
    method: 'POST',
    body: params,
  });
}
export async function updateMobile(params) {
  return request('/btc/user/update_telephone', {
    method: 'POST',
    body: params,
  });
}

export async function updateG2Validate(params) {
  return request('/btc/user/2fa_validate', {
    method: 'POST',
    body: params,
  });
}

export async function checkG2Validate(params) {
  return request('/btc/user/2fa_verify', {
    method: 'POST',
    body: params,
  });
}

export async function postAuth(params) {
  return request('/btc/user/auth', {
    method: 'POST',
    body: params,
  });
}

export async function postPayMethod(params) {
  return request('/btc/user/payment/update', {
    method: 'POST',
    body: params,
  });
}

export async function deletePayMethod(params) {
  return request('/btc/user/payment/delete', {
    method: 'POST',
    body: params,
  });
}

export async function updateAvatar(params) {
  return request('/btc/user/avatar', {
    method: 'POST',
    body: params,
  });
}

export async function getG2Secret(params) {
  return request(`/btc/user/2fa_secret?${stringify(params)}`);
}

export async function queryMyOrderList(params) {
  return request(`/btc/order/mine?${stringify(params)}`);
}

export function authForC1(stage, body) {
  return request(`/btc/user/auth/c1`, { method: 'POST', body });
}
export function authForC2(stage, body) {
  return request(`/btc/user/auth/c2`, { method: 'POST', body });
}
export function authForC3(stage, body) {
  return request(`/btc/user/auth/c3`, { method: 'POST', body });
}
