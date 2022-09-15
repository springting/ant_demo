/* eslint-disable camelcase */
// import { message } from 'antd';
// import { isEmpty, table2list } from '@/utils/utils';
import { COMPANY_ID } from '@/settings';
import { requestWithToken } from '@/utils/request';

const fetchNotices = async () => {
  const params = { company_sid: COMPANY_ID };
  return requestWithToken('/ana-api/allnotice', { params });
};

const addNotices = async args => {
  const params = { company_sid: COMPANY_ID };
  return requestWithToken('/ana-api/pushnotice', { params, data: args, method: 'POST' });
};

const deleteNotice = async message_sid => {
  const params = { message_sid, company_sid: COMPANY_ID };
  return requestWithToken('/ana-api/deletenotice', { params });
};

export default {
  namespace: 'noticetable',

  state: {
    notices: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fetchNotices);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { notices: response.data } });
      }
    },
    *delete({ payload }, { call, put }) {
      console.log('sfsd111111');
      const response = yield call(deleteNotice, payload); // payload is message_sid
      if (response.err === 0) {
        yield put({ type: 'remove', payload });
      }
    },
    *add({ payload }, { call, put }) {
      // todo: something
      const response = yield call(addNotices, payload);
      if (response.err === 0) {
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
    insert(state, { payload }) {
      return { ...state, notices: [payload, ...state.notices] };
    },
    remove(state, { payload }) {
      const key = payload;
      return { ...state, notices: state.notices.filter(n => n.key !== key) };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/notices') {
          dispatch({ type: 'fetch' });
          dispatch({ type: 'global/fetchSupplies' });
        }
      });
    },
  },
};
