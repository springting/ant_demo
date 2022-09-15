/* eslint-disable camelcase */
import { message } from 'antd';
// import { COMPANY_ID } from '@/settings';
import { requestWithToken } from '@/utils/request';
import moment from 'moment';

const fetchOrders = async params => {
  return requestWithToken('/yz-api/open-delivery_order', { params });
};
const fetchRefunds = async params => {
  return requestWithToken('/yz-api/open-refundagree', { params });
};
const fetchExpress = async params => {
  return requestWithToken('/yz-api/open-expresslist', { params });
};

const confirmLogistics = async params => {
  return requestWithToken('/xzs-api/confirm_logistics', { params });
};

const confirmRefund = async params => {
  return requestWithToken('/xzs-api/confirm_refund_agree', { params });
};
const getExpressDetail = async params => {
  return requestWithToken('/xzs-api/get_goodexpress', { params });
};
export default {
  namespace: 'ordertable',

  state: {
    orders: [],
    express_list: [],
    express_detail: [],
  },

  effects: {
    *fetch({ payload }, { put, call }) {
      const date = new Date();
      const today = moment(date).format('YYYY-MM-DD');
      const params = payload || { _start: today, _end: today };
      const response = yield call(fetchOrders, params);
      if (response && response.data && response.data.td) {
        const orders = response.data.td.map(e => ({
          order_no: e[0],
          extra: e[1],
        }));
        yield put({ type: 'save', payload: { orders } });
      }
    },
    *fetchrefund({ payload }, { put, call }) {
      const response = yield call(fetchRefunds, payload);
      if (response && response.data && response.data.td) {
        const orders = response.data.td.map(e => ({
          order_no: e[0],
          extra: e[2],
        }));
        yield put({ type: 'save', payload: { orders } });
      }
    },
    *confirm({ payload }, { call, put }) {
      const response = yield call(confirmLogistics, payload);
      if (response.err === 0) {
        yield put({ type: 'fetch' });
        message.success('发货成功√', 5);
      } else {
        const { msg } = response;
        yield put({ type: 'fetch' });
        message.error(`${msg}`, 5);
      }
    },
    *confirmrefund({ payload }, { call, put }) {
      const response = yield call(confirmRefund, payload);
      if (response.err === 0) {
        yield put({ type: 'fetch' });
        message.success('退款成功√', 5);
      } else {
        const { msg } = response;
        yield put({ type: 'fetch' });
        message.error(`${msg}`, 5);
      }
    },
    *getexpressdetail({ payload, callback }, { call, put }) {
      const response = yield call(getExpressDetail, payload);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { express_detail: response.msg } });
      } else {
        const { msg } = response;
        message.error(`${msg}`, 5);
      }
      if (callback) callback();
    },
    *fetchExpress({ payload }, { call, put }) {
      const response = yield call(fetchExpress, payload);
      if (response && response.data && response.data.td) {
        const express_list = response.data.td.map(e => ({
          sid: e[0],
          name: e[1],
        }));
        yield put({ type: 'save', payload: { express_list } });
        // localStorage.setItem('express', JSON.stringify(express_list));
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
      return { ...state, orders: [payload, ...state.orders] };
    },
    remove(state, { payload }) {
      const key = payload;
      return { ...state, orders: state.orders.filter(n => n.key !== key) };
    },
    clear(state) {
      return { ...state, express_detail: [] };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/order/manage') {
          dispatch({ type: 'fetch' });
          dispatch({ type: 'fetchExpress' });
          dispatch({ type: 'global/fetchSupplies' });
        }
      });
    },
  },
};
