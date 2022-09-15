/* eslint-disable camelcase */
import { fetchMenu } from '@/services/global';
import { requestWithToken } from '@/utils/request';
import { loadLocalJson } from '@/utils/utils';
import { COMPANY_ID } from '@/settings';

export async function fetchSupplies(params) {
  return requestWithToken('/ana-api/allsupplyinfo', { params });
}

// 获取所有品牌列表
export async function fetchBrandList(params) {
  return requestWithToken('/yz-api/open-brandlist', { params });
}

// 获取品类列表
export async function fetchCategoryList(params) {
  return requestWithToken('/yz-api/open-categorylist', { params });
}

export async function fetchStandardCategory(params) {
  return requestWithToken('/yz-api/open-standard_category', { params });
}

export async function FetchSourceList(params) {
  return requestWithToken('/yz-api/open-sources', { params });
}

// 获取门店列表
export async function fetchShopList(params) {
  return requestWithToken('/ana-api/shoplist', { params });
}

// 获取运费模板列表
export async function fetchTemplateList(params) {
  return requestWithToken('/ana-api/templatelist', { params });
}
// 获取供应商可签约品牌列表
export async function fetchBrands(params) {
  return requestWithToken('/ana-api/brand_list', { params });
}
// 获取品牌列表及匹配的资源店铺
export async function fetchBrandSource(params) {
  return requestWithToken('/xzs-api/pool_brand', { params });
}

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [], // 消息object的列表
    supply_list: loadLocalJson('supply_list') || [],
    brand_list: loadLocalJson('brand_list') || [],
    category_list: loadLocalJson('category_list') || [],
    shop_list: loadLocalJson('shop_list') || [],
    template_list: loadLocalJson('template_list') || [],
    brands: [],
    brand_source: [],
    source_list: [],
    standard_category: [],
  },
  effects: {
    *fetchNotices(_, { call, put }) {
      const params = { company_sid: COMPANY_ID };
      const res = yield call(requestWithToken, '/ana-api/recentnotice', { params });
      if (res.data) {
        // res.data[0].read = false;
        yield put({
          type: 'saveNotices',
          payload: res.data,
        });
      }
    },
    *fetchSupplies(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchSupplies, param);
      if (response && response.data) {
        const supply_list = response.data;
        yield put({ type: 'save', payload: { supply_list } });
        localStorage.setItem('supply_list', JSON.stringify(supply_list));
      }
    },

    *fetchBrandList(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchBrandList, param);
      if (response && response.data && response.data.td) {
        const brand_list = response.data.td.map(e => ({
          sid: e[0],
          brand_name: e[1],
        }));
        yield put({ type: 'save', payload: { brand_list } });
        localStorage.setItem('brand_list', JSON.stringify(brand_list));
      }
    },
    *fetchSourceList(_, { call, put }) {
      const params = { company_sid: COMPANY_ID };
      const response = yield call(FetchSourceList, params);
      if (response && response.data && response.data.td) {
        const source_list = response.data.td.map(e => e[1]);
        yield put({ type: 'save', payload: { source_list } });
      }
    },
    // 获取品牌及对应的资源店铺
    *fetchBrandSource(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchBrandSource, param);
      if (response && response.data) {
        const brand_source = Object.entries(response.data).map(([key, value]) => ({
          sid: value,
          brand_name: key,
        }));
        yield put({ type: 'save', payload: { brand_source } });
      }
    },
    // 根据选择的供应商获取品牌
    *fetchBrands({ payload }, { call, put }) {
      const response = yield call(fetchBrands, payload);
      if (response && response.data) {
        const brands = response.data.map(e => ({
          sid: e.brand_token,
          brand_name: e.brand_name,
        }));
        yield put({ type: 'save', payload: { brands } });
      }
    },
    *fetchCategoryList(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchCategoryList, param);
      if (response && response.data && response.data.td) {
        const category_list = response.data.td.map(e => ({
          sid: e[0],
          category_name: e[1],
        }));
        yield put({ type: 'save', payload: { category_list } });
        localStorage.setItem('category_list', JSON.stringify(category_list));
      }
    },

    *fetchStandardCategory(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchStandardCategory, param);
      if (response && response.data && response.data.td) {
        const standard_category = response.data.td.map(e => ({
          sid: e[0],
          category_name: e[1],
        }));
        yield put({ type: 'save', payload: { standard_category } });
      }
    },

    *fetchShopList(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchShopList, param);
      if (response && response.data) {
        const shop_list = response.data.map(e => ({
          sid: e.sid,
          shop_name: e.shop_name,
          sh_conc: e.sh_conc,
        }));
        yield put({ type: 'save', payload: { shop_list } });
        localStorage.setItem('shop_list', JSON.stringify(shop_list));
      }
    },

    *fetchTemplateList(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchTemplateList, param);
      if (response && response.data) {
        const template_list = response.data.map(e => ({
          sid: e.template_id,
          template_name: e.name,
        }));
        yield put({ type: 'save', payload: { template_list } });
        localStorage.setItem('template_list', JSON.stringify(template_list));
      }
    },
    // *clearNotices({ payload }, { put, select }) {
    //   yield put({
    //     type: 'saveClearedNotices',
    //     payload,
    //   });
    //   const count = yield select(state => state.global.notices.length);
    //   const unreadCount = yield select(
    //     state => state.global.notices.filter(item => !item.read).length,
    //   );
    //   yield put({
    //     type: 'user/changeNotifyCount',
    //     payload: {
    //       totalCount: count,
    //       unreadCount,
    //     },
    //   });
    // },

    *changeNoticeReadState({ payload }, { put, call, select }) {
      // payload is id.
      const params = { message_sid: payload };
      const response = yield call(requestWithToken, '/ana-api/insertnotice', { params });
      if (response.err === 0) {
        const notices = yield select(state =>
          state.global.notices.map(item => {
            const notice = { ...item };

            if (notice.id === payload) {
              notice.read = true;
            }

            return notice;
          }),
        );
        yield put({
          type: 'saveNotices',
          payload: notices,
        });
      }
    },

    *fetchOpenReportRoutes(_, { put, call }) {
      const r = yield call(fetchMenu);
      yield put({ type: 'save', payload: { moreMenu: r.reports, auth: r.auth } });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    close(state) {
      return { ...state, collapsed: false };
    },
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },
  // subscriptions: {
  //   setup({ history }) {
  //     // Subscribe history(url) change, trigger `load` action if pathname is `/`
  //     return history.listen(({ pathname, search }) => {
  //       if (typeof window.ga !== 'undefined') {
  //         window.ga('send', 'pageview', pathname + search);
  //       }
  //     });
  //   },
  // },
};
export default GlobalModel;
