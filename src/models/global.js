/* eslint-disable camelcase */
import { fetchMenu } from '@/services/global';
import { requestWithToken } from '@/utils/request';
import { loadLocalJson } from '@/utils/utils';

// 获取所有品牌列表
export async function fetchBrandList(params) {
  return requestWithToken('/yz-api/open-brand_list', { params });
};
// 获取所有门店列表
export async function fetchShopList(params) {
  return requestWithToken('/yz-api/open-shop_list', { params });
}
export async function fetchCategoryList(params) {
  return requestWithToken('/yz-api/open-category_list', { params });
}

const fetchShops = async params => {
  return requestWithToken('/ana-api/outlets/shops', { params });
};
const fetchBrands = async params => {
  return requestWithToken('/ana-api/outlets/brands', { params });
};
const fetchCompanies = async params => {
  return requestWithToken('/ana-api/outlets/companies', { params });
};

const GlobalModel = {
  namespace: 'global',
  state: {
    brand_list: [],
    shop_list: [],
    shops: [],
    brands: [],
    companies: []
  },
  effects: {
    *fetchBrandList(_, { call, put }) {
      const param = {};
      const response = yield call(fetchBrandList, param);
      if (response && response.data && response.data.td) {
        const brand_list = response.data.td.map(e => ({
          sid: e[0],
          name: e[1],
        }));
        yield put({ type: 'save', payload: { brand_list } });
        // localStorage.setItem('brand_list', JSON.stringify(brand_list));
      }
    },

    *fetchShopList(_, { call, put }) {
      const param = {};
      const response = yield call(fetchShopList, param);
      if (response && response.data && response.data.td) {
        const shop_list = response.data.td.map(e => ({
          sid: e[0],
          name: e[1],
        }));
        yield put({ type: 'save', payload: { shop_list } });
      }
    },
    *fetchCategoryList(_, { call, put }) {
      const param = {};
      const response = yield call(fetchCategoryList, param);
      if (response && response.data && response.data.td) {
        const category_list = response.data.td.map(e => ({
          sid: e[1],
          name: e[2],
        }));
        yield put({ type: 'save', payload: { category_list } });
      }
    },
    *fetchShops({ payload }, { put, call }) {
      const response = yield call(fetchShops, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { shops: response.data } });
      }
    },
    *fetchBrands({ payload }, { put, call }) {
      const response = yield call(fetchBrands, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { brands: response.data } });
      }
    },
    *fetchCompanies({ payload }, { put, call }) {
      const response = yield call(fetchCompanies, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { companies: response.data } });
      }
    },
    *fetchOpenReportRoutes(_, { put, call }) {
      const r = yield call(fetchMenu);
      yield put({ type: 'save', payload: { moreMenu: r.reports } });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default GlobalModel;
