import { stringify } from 'qs';
import request from '../utils/request';

export async function juejinList(cursor: string) {
  return request('/v1/article/recommend_all_feed?aid=2608', {
    prefix: '/recommend_api',
    method: 'post',
    data: { id_type: 2, client_type: 2608, sort_type: 200, cursor, limit: 20 },
  });
}
