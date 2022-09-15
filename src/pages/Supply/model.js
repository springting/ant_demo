/* eslint-disable camelcase */
import { message } from 'antd';
// import { COMPANY_ID } from '@/settings';
import { requestWithToken } from '@/utils/request';

const fetchSupplies = async params => {
  return requestWithToken('/ana-api/allsupply', { params });
};

const addSupplies = async args => {
  return requestWithToken('/ana-api/addsupply', { data: args, method: 'POST' });
};

const updateSupplies = async args => {
  return requestWithToken('/ana-api/updatesupply', { data: args, method: 'POST' });
};

const fetchQueue = async params => {
  return requestWithToken('/xzs-api/ipush_store', { params });
};

const refreshCategory = async args => {
  return requestWithToken('/ssxzs-api/change', { data: args, method: 'POST' });
};

export default {
  namespace: 'supplytable',

  state: {
    supplies: [],
  },

  effects: {
    *fetch({ payload }, { put, call }) {
      const response = yield call(fetchSupplies, payload);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { supplies: response.data } });
      }
    },
    *update({ payload }, { call, put }) {
      const { supply_sid } = payload;
      const response = yield call(updateSupplies, payload);
      if (response.err === 0) {
        yield put({ type: 'fetch', payload: { supply_sid } });
        yield put({ type: 'global/fetchSupplies' });
        message.success('更新成功√', 5);
      }
    },
    *add({ payload }, { call, put }) {
      const response = yield call(addSupplies, payload);
      if (response.err === 0) {
        yield put({ type: 'fetch' });
        yield put({ type: 'global/fetchSupplies' });
        message.success('保存成功√', 5);
      } else {
        message.error(`${response.msg}`, 5);
      }
    },
    *refresh({ payload }, { call, put }) {
      if (payload.type === 'refresh_freight') {
        const response = yield call(fetchQueue, payload);
        if (response.err === 0) {
          yield put({ type: 'global/fetchTemplateList' });
          message.success('同步成功√', 5);
        }
      } else if (payload.type === 'refresh_category') {
        const response = yield call(refreshCategory, payload);
        if (response.err === 0) {
          message.success('同步成功√', 5);
        }
      }
    },
    *delete({ payload }, { put, call }) {
      const response = yield call(fetchSupplies, payload);
      // console.log(response);
      if (response.err === 0) {
        yield put({ type: 'fetch' });
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
    insert(state, { payload }) {
      return { ...state, supplies: [payload, ...state.supplies] };
    },
    remove(state, { payload }) {
      const key = payload;
      return { ...state, supplies: state.supplies.filter(n => n.key !== key) };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/setting/supplies') {
          dispatch({ type: 'fetch' });
          dispatch({ type: 'global/fetchBrandList' });
          dispatch({ type: 'global/fetchCategoryList' });
          dispatch({ type: 'global/fetchShopList' });
          dispatch({ type: 'global/fetchTemplateList' });
          dispatch({ type: 'global/fetchSupplies' });
          dispatch({ type: 'global/fetchBrandSource' });
        }
      });
    },
  },
};
