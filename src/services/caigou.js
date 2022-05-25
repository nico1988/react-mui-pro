import request from './request';
import { CAIGOU } from './api';

export async function getCaiGouOrderList(data) {
  return request(CAIGOU.LIST, {
    method: 'GET',
    params: data,
  });
}
export async function getGoodsList(data) {
  return request(CAIGOU.GOODS_LIST, {
    method: 'GET',
    params: data,
  });
}
export async function saveCaiGou(data) {
  return request(CAIGOU.SAVE_ADD, {
    method: 'POST',
    data,
  });
}
export async function auditCaiGou(data) {
  return request(`${CAIGOU.AUDIT}?ids=${data}`, {
    method: 'PUT',
  });
}
export async function revertAuditCaiGou(data) {
  return request(`${CAIGOU.REVERT_AUDIT}?ids=${data}`, {
    method: 'PUT',
  });
}
export async function deleteCaiGou(data) {
  return request(`${CAIGOU.SAVE_ADD}?ids=${data}`, {
    method: 'DELETE',
  });
}
export async function getOperator(data) {
  return request(`${CAIGOU.OPERATOR}?subs=${data}`, {
    method: 'GET',
  });
}
// 查询采购单
export async function queryCaiGou(id) {
  return request(`${CAIGOU.SAVE_ADD}/${id}`, {
    method: 'POST',
  });
}
// 编辑采购单
export async function editCaiGou(data) {
  return request(CAIGOU.SAVE_ADD, {
    method: 'PUT',
    data,
  });
}
// 采购入库——————————————————————————————————————————————————————————————————————————————————————————————————
export async function getCaiGouRuKuList(data) {
  return request(CAIGOU.RuKu.LIST, {
    method: 'GET',
    params: data,
  });
}
// 仓库列表
export async function getStoreList(data) {
  return request(CAIGOU.Store.LIST, {
    method: 'GET',
    params: data,
  });
}
// 货架列表
export async function getShelfList(data) {
  return request(CAIGOU.Shelf.LIST, {
    method: 'GET',
    params: { ...data },
  });
}
// 新增采购入库
export async function ruKuAdd(data) {
  return request(CAIGOU.RuKu.ADD, {
    method: 'POST',
    data,
  });
}
// 编辑采购入库
export async function ruKuEdit(data) {
  return request(CAIGOU.RuKu.ADD, {
    method: 'PUT',
    data,
  });
}
// 删除采购入库单
export async function deleteRuKu(data) {
  return request(`${CAIGOU.RuKu.ADD}?ids=${data}`, {
    method: 'DELETE',
  });
}
// 查看采购入库详情
export async function queryRuKu(id) {
  return request(`${CAIGOU.RuKu.ADD}/${id}`, {
    method: 'GET',
  });
}
// 审核入库
export async function auditRuKu(data) {
  return request(`${CAIGOU.RuKu.AUDIT}?ids=${data}`, {
    method: 'PUT',
  });
}
// 反审核入库
export async function revertAuditRuKu(data) {
  return request(`${CAIGOU.RuKu.REVERT_AUDIT}?ids=${data}`, {
    method: 'PUT',
  });
}
// 采购退货——————————————————————————————————————————————————————————————————————————————————————————————————
export async function getCaiGouReturnList(data) {
  return request(CAIGOU.Return.LIST, {
    method: 'GET',
    params: data,
  });
}

// 新增采购入库
export async function returnAdd(data) {
  return request(CAIGOU.Return.ADD, {
    method: 'POST',
    data,
  });
}
// 编辑采购入库
export async function returnEdit(data) {
  return request(CAIGOU.Return.ADD, {
    method: 'PUT',
    data,
  });
}
// 删除采购入库单
export async function deleteReturn(data) {
  return request(`${CAIGOU.Return.ADD}?ids=${data}`, {
    method: 'DELETE',
  });
}
// 查看采购入库详情
export async function queryReturn(id) {
  return request(`${CAIGOU.Return.ADD}/${id}`, {
    method: 'GET',
  });
}
// 审核入库
export async function auditReturn(data) {
  return request(`${CAIGOU.Return.AUDIT}?ids=${data}`, {
    method: 'PUT',
  });
}
// 反审核入库
export async function revertAuditReturn(data) {
  return request(`${CAIGOU.Return.REVERT_AUDIT}?ids=${data}`, {
    method: 'PUT',
  });
}
// 通过条形码查询
export async function barcodeSearch(data) {
  return request(CAIGOU.BARCODE_SEARCH, {
    method: 'GET',
    params: data,
  });
}
