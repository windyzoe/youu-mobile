import { stringify } from 'qs';
import request from '../utils/request';

export async function query() {
  return request('/api/user');
}

export async function login(data) {
  return request('/login', {
    method: 'post',
    data: {
      ...data,
    },
  });
}

export async function logout(data) {
  return request('/logout', {
    method: 'post',
    data: {
      ...data,
    },
  });
}

export async function validateToken(data) {
  return request('/validateToken', {
    method: 'post',
    data: {
      ...data,
    },
  });
}

export async function getMenu(data) {
  return request('/menus');
}

export async function getAllMenu(data) {
  return request('/menu/menus');
}
