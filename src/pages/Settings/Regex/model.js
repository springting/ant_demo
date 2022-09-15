/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';
import { loadLocalJson } from '@/utils/utils';

const fetchRegex = async params => {
  return requestWithToken('/ana-api/settings', { params });
};

const updateRegex = async args => {
  return requestWithToken('/ana-api/settings', { data: args, method: 'POST' });
};

export default {
  namespace: 'Regex',

  state: {
    data: [],
    service: [],
    seats: []
  },

  effects: {
    *fetch(payload, { put, call }) {
      const params = payload.payload;
      const response = yield call(fetchRegex, params);
      // console.log(response.data)
      if (response && response.data) {
        if (params.type ===  'aboutUs'){
          yield put({ type: 'save', payload: { data: response.data } });
        } else if (params.type ===  'service'){
          yield put({ type: 'save', payload: { service: response.data } });
        } else if (params.type ===  'seats'){
          yield put({ type: 'save', payload: { seats: response.data } });
        }
      }
    },
    *update({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(updateRegex, payload);
      if (response.err === 0) {
        message.success('修改成功√', 5);
        // yield put({ type: 'fetch', payload: { type: 'aboutUs'} });
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
        if (pathname ==='/setting/aboutus') { 
          dispatch({ type: 'fetch', payload: { type: 'aboutUs'}});               
        }
        if (pathname ==='/setting/service') { 
            dispatch({ type: 'fetch', payload: { type: 'service'}});               
          }
          if (pathname ==='/setting/seats') { 
            dispatch({ type: 'fetch', payload: { type: 'seats'}});               
          }
      });
    },
  },
};
