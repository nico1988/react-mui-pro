import request from './request';
import { SHELF } from './api';

export async function getShelfList(data) {
  return request(SHELF.LIST, {
    method: 'GET',
    params: data,
  });
}


export async function addShelf(data) {
  return request(SHELF.SHELF, {
    method: 'POST',
    data,
  })
}

export async function updateShelf(data) {
  return request(SHELF.SHELF, {
    method: 'PUT',
    data,
  });
}

export async function deleteShelf(ids) {
  if (!ids?.length) return false;
  const params = `ids=${ids.join('&ids=')}`;
  return request(`${SHELF.SHELF}?${params}`, {
    method: 'DELETE',
  });
}

export async function getShelf(id) {
  if (!id) return false;
  return request(`${SHELF.SHELF}/${id}`, {
    method: 'GET',
  });
}
