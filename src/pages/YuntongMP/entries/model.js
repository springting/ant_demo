/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';

const fetchStoreSource = async params => {
  return requestWithToken('/ana-api/source_store', { params });
};
const fetchEntries = async params => {
  return requestWithToken('/xzs-api/entry', { params });
};

export default {
  namespace: 'entrytable',

  state: {
    standard_brands: [],
    store_list: [],
    entries: [],
    entry_list: [],
  },

  effects: {
    *fetchstoreSource({ payload }, { call, put }) {
      const response = yield call(fetchStoreSource, payload);
      if (response.err === 0) {
        const store_list = response.data;
        yield put({ type: 'save', payload: { store_list } });
      }
    },
    *fetchentries({ payload }, { put, call }) {
      const response = yield call(fetchEntries, payload);
      if (payload.type === 'fetch_entries' && response && response.data) {
        yield put({ type: 'save', payload: { entries: response.data } });
      } else if (payload.type === 'delete_entries' && response.err === 0) {
        message.success('删除成功√', 5);
        yield put({
          type: 'fetchentries',
          payload: {
            store: payload.default_store,
            brand_sid: payload.default_brand_sid,
            type: 'fetch_entries',
          },
        });
      } else if (payload.type === 'lpush_entries' && response.err === 0) {
        message.success('插队成功√', 5);
        yield put({
          type: 'fetchentries',
          payload: {
            store: payload.default_store,
            brand_sid: payload.default_brand_sid,
            type: 'fetch_entries',
          },
        });
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
        if (pathname === '/MP/entry') {
          dispatch({ type: 'global/fetchBrandSource' });
          dispatch({ type: 'fetchentries', payload: { type: 'fetch_entries' } });
        }
      });
    },
  },
};
