import request, { requestWithToken } from '@/utils/request';

export async function queryAllContract(params) {
  return requestWithToken('/von-api/open-consort_lists_all', {
    params,
  });
}

export async function searchContract(params) {
  return requestWithToken('/von-api/open-consort_lists', {
    params,
  });
}

export async function addContract(params) {
  return request('/ana-api/insert_record', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function getContract(params) {
  return request('/ana-api/query_sid', {
    params: { ...params, tbl: 'consort_terms' },
  });
}

export async function updateRule(params) {
  return request('/api/contract-contractlist', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function fetchSupplies(params) {
  return requestWithToken('/von-api/open-xdh_supplies', { params });
}

export async function fetchTransRate(params) {
  return requestWithToken('/von-api/open-trans_rate', { params });
}

export async function fetchFeeType(params) {
  return requestWithToken('/von-api/open-fee_type', { params });
}

export async function fetchShopList(params) {
  return requestWithToken('/von-api/open-company_shops', { params });
}

// 过期合同
export async function fetchExpired(params) {
  return requestWithToken('/von-api/open-consort_lists_expired', { params });
}

// 获取供应商可签约品牌列表
export async function fetchBrands(params) {
  return request('/ana-api/brand_list', { params });
}
