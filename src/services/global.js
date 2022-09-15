import { message } from 'antd';
import request, { requestWithToken } from '@/utils/request';
import { COMPANY_ID } from '@/settings';

export async function querySid(params) {
  return request('/ana-api/query_sid', { params });
}

export async function fetchMenu(params) {
  return request('/ana-api/api_list', { params: { ...params, company_sid: COMPANY_ID, json: 1 } });
}

// 添加数据
export async function addTbData(params) {
  return request('/ana-api/insert_record', {
    method: 'POST',
    data: {
      ...params,
      company_sid: COMPANY_ID,
    },
  });
}

// 请求数据
export async function fetchApidata(params) {
  try {
    const res = await requestWithToken('/ana-api/report', {
      params: { ...params, groupid: 'data', company_sid: COMPANY_ID },
    });
    if (res && res.err === 0 && res.data && res.data.td && res.data.th) {
      const { th } = res.data;
      const contracts = res.data.td.map(e => {
        const data = {};
        th.forEach((v, i) => {
          data[th[i]] = e[i];
        });
        return data;
      });
      return { err: 0, data: contracts };
    }
    message.error('数据获取失败！');
    return { err: -1, data: [], msg: res.msg || '获取数据失败' };
  } catch (error) {
    message.error('数据获取失败！');
    return { err: -1, data: [], msg: '页面发生异常' };
  }
}

