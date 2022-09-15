import request from '@/utils/request';

// export async function query() {
//   return request('/api/users');
// }
// export async function queryCurrent() {
//   return request('/api/currentUser');
// }
// export async function queryNotices() {
//   return request('/api/notices');
// }
export async function queryLoginQr(){
  return request('/ana-api/signin', {params: { json: 1 }});
}
export async function queryScanResult(params){
  return request('/ana-api/qrauthcheck', {params})
}