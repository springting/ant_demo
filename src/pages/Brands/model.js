/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';

const fetchBrandList = async params => {
  return requestWithToken('/ana-api/brand/list', { params });
};

const updateBrands = async args => {
    return requestWithToken('/ana-api/brand/list', { data: args, method: 'POST' });
};

const deleteItems = async params => {
  return requestWithToken('/ana-api/outlets/delete', { params });
}

export default {
  namespace: 'brandstable',

  state: {
    brand_list: [],
  },

  effects: {
    *fetch({payload}, { put, call }) {
      const response = yield call(fetchBrandList, payload);
      // console.log(response.data)
      if (response && response.data) {
        yield put({ type: 'save', payload: { brand_list: response.data } });
      }
    },
    *update({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(updateBrands, payload);
      if (response.err === 0) {
        message.success('修改成功√', 5);
        yield put({ type: 'fetch' });
      } else {
        message.error(`${response.msg}`, 10)
      }
    },
    *delete({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(deleteItems, payload);
      if (response.err === 0) {
        message.success('删除成功√', 5);
        yield put({ type: 'fetch' });
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
        if (pathname ==='/brand/list') {         
          dispatch({ type: 'fetch' });
          dispatch({ type: 'global/fetchCategoryList' });
          dispatch({ type: 'global/fetchBrands' });
        }
      });
    },
  },
};
