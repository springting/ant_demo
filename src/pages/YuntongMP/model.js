/* eslint-disable camelcase */
import { message } from 'antd';
// import { COMPANY_ID } from '@/settings';
import { requestWithToken } from '@/utils/request';

const fetchDetails = async params => {
  return requestWithToken('/ana-api/allsupply', { params });
};
const fetchStoreSource = async params => {
  return requestWithToken('/ana-api/source_store', { params });
};
const fetchQueue = async params => {
  return requestWithToken('/xzs-api/ipush_store', { params });
};
const insertQueue = async args => {
  return requestWithToken('/xzs-api/ipush_store', { data: args, method: 'POST' });
};
const confirmStoreSourse = async args => {
  return requestWithToken('/ana-api/add_source_store', { data: args, method: 'POST' });
};
const insertStoreSourse = async args => {
  return requestWithToken('/ana-api/add_source_store', { data: args, method: 'POST' });
};

const FetchItemMatch = async params => {
  return requestWithToken('/yz-api/open-itemsMatch', { params });
};

const fetchEntries = async params => {
  return requestWithToken('/xzs-api/entry', { params });
};

const fetchGoods = async params => {
  return requestWithToken('/xzs-api/good_list', { params });
};

const editSourceStore = async params => {
  return requestWithToken('/xzs-api/source_store', { params });
};

export default {
  namespace: 'configtable',

  state: {
    store_config: [],
    store_list: [],
    goods: [],
    shop_list: [],
    entries: [],
    entry_list: [],
    texts: [],
    product: {},
    matches: [],
  },

  effects: {
    *fetch({ payload }, { put, call }) {
      const response = yield call(fetchDetails, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { store_config: response.data } });
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
    *fetchstoreSource({ payload }, { call, put }) {
      const response = yield call(fetchStoreSource, payload);
      if (response.err === 0) {
        const store_list = response.data;
        yield put({ type: 'save', payload: { store_list } });
      }
    },
    *insert({ payload }, { call, put }) {
      const response = yield call(insertStoreSourse, payload);
      if (response.err === 0) {
        yield put({ type: 'fetch', payload: { type: 'brand' } });
        message.success('配置成功√', 5);
      } else if (response.err === -1) {
        message.error(`不存在店铺${response.msg}，请仔细核对`, 5);
        yield put({ type: 'fetch', payload: { type: 'brand' } });
      }
    },
    *confirm({ payload }, { call, put }) {
      const response = yield call(confirmStoreSourse, payload);
      if (response.err === 0) {
        yield put({ type: 'fetch', payload: { type: 'brand' } });
        message.success('配置成功√', 5);
      } else if (response.err === -1) {
        message.error(`不存在店铺${response.msg}，请仔细核对`, 5);
        yield put({ type: 'fetch', payload: { type: 'brand' } });
      }
    },
    *fetchentries({ payload }, { put, call }) {
      const response = yield call(fetchEntries, payload);
      if (payload.type === 'fetch_entries' && response && response.data) {
        yield put({ type: 'save', payload: { entries: response.data } });
      } else if (payload.type === 'delete_entries' && response.err === 0) {
        yield put({
          type: 'fetchentries',
          payload: { store: payload.store, type: 'fetch_entries' },
        });
        message.success('删除成功√', 5);
      } else if (payload.type === 'lpush_entries' && response.err === 0) {
        message.success('插队成功√', 5);
      } else if (payload.type === 'entry_list' && response.err === 0) {
        yield put({ type: 'save', payload: { entry_list: response.data } });
      } else if (payload.type === 'deleteFromEntryList' && response.err === 0) {
        yield put({
          type: 'fetchentries',
          payload: { type: 'entry_list' },
        });
        message.success('删除成功√', 5);
      }
    },
    // 人工标记
    *fetchtext({ payload }, { put, call }) {
      const response = yield call(fetchQueue, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { texts: response.data, product: response.product } });
      }
    },
    *confirmText({ payload }, { put, call }) {
      const response = yield call(insertQueue, payload);
      if (response.err === 0) {
        yield put({ type: 'fetchtext', payload: { type: 'fetch_text' } });
      }
    },
    *fetchItemMatch({ payload }, { put, call }) {
      yield put({ type: 'clear' });
      const response = yield call(FetchItemMatch, payload);
      if (response && response.data && response.data.td) {
        const matches = response.data.td.map(e => ({
          shopname: e[1],
          source: e[2],
          count: e[3],
          num: e[4],
          percent: e[5],
        }));
        yield put({ type: 'save', payload: { matches } });
      }
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(editSourceStore, payload);
      if (response.err === 0) {
        yield put({ type: 'fetch', payload: { type: 'brand' } });
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
      return { ...state, matches: [] };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/MP/rpa_config') {
          dispatch({ type: 'fetch', payload: { type: 'brand' } });
        }
        if (pathname === '/MP/bss') {
          dispatch({ type: 'fetch', payload: { type: 'brand' } });
          dispatch({ type: 'global/fetchBrandSource' });
          dispatch({ type: 'global/fetchStandardCategory' });
        }
        if (pathname === '/MP/test') {
          dispatch({ type: 'fetch', payload: { type: 'brand' } });
          dispatch({ type: 'global/fetchBrandSource' });
        }
        if (pathname === '/MP/train') {
          dispatch({ type: 'fetchtext', payload: { type: 'fetch_text' } });
        }
      });
    },
  },
};
