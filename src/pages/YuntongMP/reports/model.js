/* eslint-disable camelcase */
// import { message } from 'antd';
import { requestWithToken } from '@/utils/request';

const fetchOverviews = async params => {
  return requestWithToken('/xzs-api/good_report', { params });
};

export default {
  namespace: 'reporttable',

  state: {
    goods_overview: [],
    goods_update: [],
    items_manual: [],
  },

  effects: {
    *fetch({ payload }, { put, call }) {
      const response = yield call(fetchOverviews, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { goods_overview: response.data } });
      }
    },
    *fetchupdate({ payload }, { put, call }) {
      const response = yield call(fetchOverviews, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { goods_update: response.data } });
      }
    },
    *fetchmanual({ payload }, { put, call }) {
      const response = yield call(fetchOverviews, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { items_manual: response.data } });
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
      return { ...state, goods_overview: [] };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/MP/reports') {
          // dispatch({ type: 'fetch', payload: { type: 'goods_overview' } });
        }
      });
    },
  },
};
