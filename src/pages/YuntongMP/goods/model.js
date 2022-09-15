/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';

const fetchStoreSource = async params => {
  return requestWithToken('/ana-api/source_store', { params });
};
const fetchGoods = async params => {
  return requestWithToken('/xzs-api/good_list', { params });
};

export default {
  namespace: 'goodtable',

  state: {
    standard_brands: [],
    store_list: [],
    goods: [],
    shop_list: [],
  },

  effects: {
    *fetchstoreSource({ payload }, { call, put }) {
      const response = yield call(fetchStoreSource, payload);
      if (response.err === 0) {
        const store_list = response.data;
        yield put({ type: 'save', payload: { store_list } });
      }
    },
    *fetchgoods({ payload }, { put, call }) {
      const response = yield call(fetchGoods, payload);
      if (payload.type === 'fetch_goods' && response && response.data) {
        yield put({ type: 'save', payload: { goods: response.data } });
      } else if (payload.type === 'lpush_shop' && response.err === 0) {
        message.success('插队成功√', 5);
        yield put({
          type: 'fetchgoods',
          payload: {
            store: payload.default_store,
            brand_sid: payload.default_brand_sid,
            type: 'fetch_goods',
          },
        });
      } else if (payload.type === 'shop_list' && response.err === 0) {
        yield put({ type: 'save', payload: { shop_list: response.data } });
      } else if (payload.type === 'deleteFromShopList' && response.err === 0) {
        yield put({
          type: 'fetchgoods',
          payload: { type: 'shop_list' },
        });
        message.success('删除成功√', 5);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state) {
      return { ...state, entries: [] };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/MP/good') {
          dispatch({ type: 'global/fetchBrandSource' });
          dispatch({ type: 'fetchgoods', payload: { type: 'fetch_goods' } });
        }
      });
    },
  },
};
