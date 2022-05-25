import request from './request';
import { WAREHOUSE } from './api';

export async function getWarehouseList(data) {
  return request(WAREHOUSE.LIST, {
    method: 'GET',
    params: data,
  });
}


export async function addWarehouse(data) {
  return request(WAREHOUSE.WAREHOUSE, {
    method: 'POST',
    data,
  })
}

export async function updateWarehouse(data) {
  return request(WAREHOUSE.WAREHOUSE, {
    method: 'PUT',
    data,
  });
}

export async function deleteWarehouse(ids) {
  if (!ids?.length) return false;
  const params = `ids=${ids.join('&ids=')}`;
  return request(`${WAREHOUSE.WAREHOUSE}?${params}`, {
    method: 'DELETE',
  });
}

export async function getWarehouse(id) {
  if (!id) return false;
  return request(`${WAREHOUSE.WAREHOUSE}/${id}`, {
    method: 'GET',
  });
}
