/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';

const fetchSource = async params => {
  return requestWithToken('/xzs-api/sources', { params });
};
const updateSource = async args => {
  return requestWithToken('/xzs-api/sources', { data: args, method: 'POST' });
};

export default {
  namespace: 'sourcetable',

  state: {
    sources: [],
  },

  effects: {
    *fetch({ payload }, { put, call }) {
      const response = yield call(fetchSource, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { sources: response.data } });
      }
    },
    *update({ payload }, { put, call }) {
      const response = yield call(updateSource, payload);
      if (response.err === 0) {
        message.success('修改成功√', 5);
        yield put({ type: 'fetch', payload: { type: 'fetch_source' } });
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
      return { ...state, sources: [] };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/MP/source') {
          dispatch({ type: 'fetch', payload: { type: 'fetch_source' } });
          dispatch({ type: 'global/fetchSourceList' });
        }
      });
    },
  },
};
