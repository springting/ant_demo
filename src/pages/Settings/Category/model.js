/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';

const fetchCategoryList = async params => {
  return requestWithToken('/ana-api/category/list', { params });
};

const updateCategories = async args => {
    return requestWithToken('/ana-api/category/list', { data: args, method: 'POST' });
};

const deleteItems = async params => {
  return requestWithToken('/ana-api/outlets/delete', { params });
}

export default {
  namespace: 'categorytable',

  state: {
    category_list: [],
  },

  effects: {
    *fetch({payload}, { put, call }) {
      const response = yield call(fetchCategoryList, payload);
      // console.log(response.data)
      if (response && response.data) {
        yield put({ type: 'save', payload: { category_list: response.data } });
      }
    },
    *update({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(updateCategories, payload);
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
        if (pathname ==='/setting/category') {         
          dispatch({ type: 'fetch' });
        }
      });
    },
  },
};
