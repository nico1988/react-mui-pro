import request from './request';
import { SERVICES } from './api';

export async function getServicesList(data) {
  return request(SERVICES.SERVICES, {
    method: 'GET',
    params:data
  });
}

export async function getPayInfo(data) {
  return request(SERVICES.PAYS, {
    method: 'POST',
    data,
  })
}

export async function getOrderList(data) {
  return request(SERVICES.ORDERS, {
    method: 'GET',
    params: data
  });
}

export async function checkScanResult(id) {
  return request(`${SERVICES.CHECKSCAN}${id}`, {
    method: 'GET',
  });
}

export async function checkPayResult(id) {
  return request(`${SERVICES.CHECKRESULT}${id}`, {
    method: 'GET',
  });
}
