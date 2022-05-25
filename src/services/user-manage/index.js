import request from '../request';
import API_LIST from '../api/user-manage';


export const USER_STATUS_OPTIONS = [
  {
    label: '未审核1',
    value: 0,
  },
  {
    label: '未审核2',
    value: 1,
  },
  {
    label: '未审核3',
    value: 2,
  },
  {
    label: '未审核4',
    value: 3,
  },
]

/**
 * 分页查询子账户
 * @param {*} data 
 * @param {*} data.account 登录名称
 * @param {*} data.name 用户姓名
 * @param {*} data.pageIndex 当前页码
 * @param {*} data.pageSize 每页条数
 * @returns 
 */
export async function getUserList(data) {
  return request(API_LIST.LIST, {
    method: 'GET',
    params: data,
  });
}

// 添加子账户
export async function addUserAccount(data) {
  return request(API_LIST.LIST, {
    method: 'POST',
    data,
  });
}

// 删除子账户
export async function deleteUserAccount(data) {
  return request(`${API_LIST.LIST}?ids=${data}`, {
    method: 'DELETE',
  });
}

// 编辑子账户
export async function editUserAccount(data) {
  return request(`${API_LIST.LIST}/${data.id}`, {
    method: 'PUT',
    data,
  });
}