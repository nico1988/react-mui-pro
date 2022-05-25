import request from './request';
import { ROLES } from './api';

// 新增角色
export async function addRoles(data) {
  return request(ROLES.ROLES, {
    method: 'POST',
    data,
  });
}

// 删除角色
export async function deleteRoles(data) {
  return request(`${ROLES.ROLES}?ids=${data}`, {
    method: 'DELETE',
  });
}

// 编辑角色
export async function editRoles(data) {
  return request(`${ROLES.ROLES}/${data.id}`, {
    method: 'PUT',
    data,
  });
}

// 查询列表
export async function getRolesList(data) {
  return request(ROLES.ROLES, {
    method: 'GET',
    params: data,
  });
}

// 角色权限信息
export async function getRolesMenus(data) {
  return request(`${ROLES.ROLES}/${data}${ROLES.MENUS}`, {
    method: 'GET',
  });
}

// 编辑角色权限信息
export async function editRolesMenus(data) {
  return request(`${ROLES.ROLES}/${data.id}${ROLES.MENUS}`, {
    method: 'PUT',
    data,
  });
}

// 菜单数据
export async function getMenusData(data) {
  return request(ROLES.MENUS, {
    method: 'GET',
    params: data,
  });
}
