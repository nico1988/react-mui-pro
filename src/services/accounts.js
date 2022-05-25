import request from './request';
import { ACCOUNTS } from './api';


  // 登录注册
export async function userLogin(data) {
  return request(ACCOUNTS.LOGIN, {
    method: 'POST',
    silent: true,
    params: data
  });
}
export async function userRegister(data) {
  return request(ACCOUNTS.REGISTER, {
    method: 'POST',
    data
  });
}
export async function getCode(data) {
  return request(ACCOUNTS.GETPHONECODE, {
    method: 'POST',
    data,
  });
}
export async function checkUsable(data) {
  return request(ACCOUNTS.REGISTER, {
    method: 'GET',
    params: data,
    silent: true,
  });
}

// 当前登录用户
export async function getUserInfo(data) {
  return request(ACCOUNTS.USER, {
    method: 'GET',
  });
}
export async function changePassword(data) {
  return request(`${ACCOUNTS.ACCOUNTS}?pass`, {
    method: 'PUT',
    data,
  })
}

// 用户主账号信息
export async function getAccountInfo() {
  return request(ACCOUNTS.ACCOUNTS, {
    method: 'GET',
  });
}
export async function updateAccountInfo(data) {
  return request(ACCOUNTS.ACCOUNTS, {
    method: 'PUT',
    data,
  })
}

// 关联账号
export async function getRelation(data) {
  return request(`${ACCOUNTS.ACCOUNTS}?relation`, {
    method: 'GET',
  })
}