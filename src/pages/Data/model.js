/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';

const fetchDatas = async params => {
    return requestWithToken('/ana-api/outlets/data', { params });
};


export default {
  namespace: 'datatable',

  state: {
    shops_hot: [],
    brands_hot: [],
    current_user: [],
    users: [],
    total_num: 0,
  },

  effects: {
    *fetch({payload}, { put, call }) {
        const response = yield call(fetchDatas, payload);
        if (response && response.err === 0) {
          yield put({ type: 'save', payload: { shops_hot: response.shops_hot, brands_hot: response.brands_hot, current_user: response.current_user, users: response.users, total_num: response.total_num } });
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
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/') {         
            dispatch({ type: 'fetch' });
        }
      });
    },
  },
};
