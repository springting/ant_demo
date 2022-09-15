/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';
import cookie from 'react-cookies'
import { routerRedux } from 'dva/router';

const fetchShopList = async params => {
  return requestWithToken('/ana-api/shop/list', { params });
};

const updateShop = async args => {
  return requestWithToken('/ana-api/shop/list', { data: args, method: 'POST' });
};

const deleteItems = async params => {
  return requestWithToken('/ana-api/outlets/delete', { params });
}

const fetchShopBrands = async params => {
  return requestWithToken('/ana-api/location/list', { params });
}

const fetchFloors = async params => {
  return requestWithToken('/yz-api/open-shop_floors', { params });
}

const updateLocation = async args => {
  return requestWithToken('/ana-api/location/list', { data: args, method: 'POST' });
}

const checkShops = async args => {
  return requestWithToken('/ana-api/outlets/check', { data: args, method: 'POST' });
}

const fetchShopLogs = async params => {
  return requestWithToken('/ana-api/outlets/check', { params });
}

export default {
  namespace: 'shopstable',

  state: {
    shop_list: [],
    pics: [],
    changed: false,
    shop_brands: [],
    floors: [],
    logs: {}
  },

  effects: {
    *fetch({payload}, { put, call }) {
      // const payload = {};
      const response = yield call(fetchShopList, payload);
      // console.log(response.data)
      if (response && response.data) {
        yield put({ type: 'save', payload: { shop_list: response.data } });
      }
    },

    *fetchFloor({ payload }, { put, call }) {
      const response = yield call(fetchFloors, payload);
      if (response && response.data && response.data.td) {
        const floors = response.data.td.map(e => (e[0]));
        // console.log(floors)
        yield put({ type: 'save', payload: { floors } });
      }
    },
    *fetchShopBrands({payload}, { put, call }) {
      const response = yield call(fetchShopBrands, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { shop_brands: response.data } });
      }
    },
    *update({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(updateShop, payload);
      if (response.err === 0) {
        message.success('修改成功√', 5);
        yield put({ type: 'fetch' });
      } else {
        message.error(`${response.msg}`, 10)
      }
    },
    *check({ payload }, { put, call }) {
      const response = yield call(checkShops, payload);
      if (response.err === 0) {
        message.success('提交成功√');
        yield put(
          routerRedux.push({
            pathname: `/shop/list`,
          }),
        );
      }
    },
    *savePics({payload}, { put, call }) {
      yield put({ type: 'save', payload: { pics: payload.pics, changed: true } });
    },
    *saveChangeLogs({payload}, { put, call }) {
      // console.log(payload.logs)
      yield put({ type: 'save', payload: { logs: payload.logs } });
    },
    *delete({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(deleteItems, payload);
      if (response.err === 0) {
        message.success('删除成功√', 5);
        yield put({ type: 'fetch' });
      }
    },
    *updateLocation({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(updateLocation, payload);
      if (response.err === 0) {
        message.success('修改成功√', 5);
        yield put({ type: 'fetchShopBrands' });
      } else {
        message.error(`${response.msg}`, 10)
      }
    },
    *deleteLocation({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(deleteItems, payload);
      if (response.err === 0) {
        message.success('删除成功√', 5);
        yield put({ type: 'fetchShopBrands' });
      }
    },
    *fetchShopLogs(_, { put, call }) {
      const change_sid = cookie.load('change_sid');
      yield put({ type: 'save', payload: { change_sid } });
      const response = yield call(fetchShopLogs, {shop_sid: change_sid});
      if (response && response.data) {
        yield put({ type: 'save', payload: { details: response.data } });
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
      return { ...state, floors: [] };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname ==='/shop/list') {         
          dispatch({ type: 'fetch' });
          dispatch({ type: 'global/fetchShops' });
          dispatch({ type: 'global/fetchCompanies' });
        }
        if (pathname ==='/shop/location') {         
          dispatch({ type: 'fetchShopBrands' });
          dispatch({ type: 'global/fetchShops' });
          dispatch({ type: 'global/fetchBrands' });
        }
        if (pathname ==='/shop/check') {         
          dispatch({ type: 'fetchShopLogs' });

        }
      });
    },
  },
};
