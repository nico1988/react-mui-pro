import request from './request';
import { STOCK } from './api';

export async function getStockList(data) {
  return request(STOCK.LIST, {
    method: 'GET',
    params: data
  });
}

export async function getStockInfo(data) {
  return request(STOCK.INFO, {
    method: 'GET',
    params: data
  })
}

export async function getStockLogs(data) {
  return request(STOCK.LOG, {
    method: 'GET',
    params: data
  })
}
