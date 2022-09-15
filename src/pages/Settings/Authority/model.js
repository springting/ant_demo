/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';
import Cookies from 'js-cookie'

const auth = localStorage.getItem('antd-pro-authority').slice(2,-2);

const fetchUserList = async params => {
  return requestWithToken('/ana-api/user/list', { params });
};

const fetchAuthList = async params => {
    return requestWithToken('/ana-api/auth/list', { params });
  };

const updateUsers = async args => {
    return requestWithToken('/ana-api/user/list', { data: args, method: 'POST' });
};

const deleteItems = async args => {
  return requestWithToken('/ana-api/user/list', { data: args, method: 'POST' });
}

const fetchSearchItems = async params => {
  if (auth === 'company'){
    return requestWithToken('/yz-api/open-search_items_company', { params: { sid: Cookies.get('company_sid'), company_sid: Cookies.get('company_sid')} });
  } else {
    return requestWithToken('/yz-api/open-search_items', { params });
  }
};

export default {
  namespace: 'usertable',

  state: {
    user_list: [],
    auth_list: [],
    search_items: [],
  },

  effects: {
    *fetch({payload}, { put, call }) {
      const response = yield call(fetchUserList, payload);
      // console.log(response.data)
      if (response && response.data) {
        yield put({ type: 'save', payload: { user_list: response.data } });
      }
    },
    *search({payload}, { put, call }) {
      const response = yield call(fetchSearchItems, payload);
      if (response && response.data && response.data.td) {
        const search_items = response.data.td.map(e => ({
          sid: e[0],
          name: e[1],
        }));
        yield put({ type: 'save', payload: { search_items } });
      }
    },
    *fetchAuthList({payload}, { put, call }) {
        const response = yield call(fetchAuthList, payload);
        if (response && response.data) {
          yield put({ type: 'save', payload: { auth_list: response.data } });
        }
      },
    *update({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(updateUsers, payload);
      if (response.err === 0) {
          if (payload.sid){
            message.success('修改成功√', 5);
          } else {
            message.success('新增成功√', 5);
          }
        
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
        if (pathname ==='/setting/authority') {         
          dispatch({ type: 'fetch' });
          dispatch({ type: 'search' });
          dispatch({ type: 'fetchAuthList' });
          dispatch({ type: 'global/fetchShops' });
          dispatch({ type: 'global/fetchBrands' });
          dispatch({ type: 'global/fetchCompanies' });
        }
      });
    },
  },
};
