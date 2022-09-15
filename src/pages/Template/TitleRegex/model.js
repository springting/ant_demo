/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';

const fetchSupplies = async params => {
  return requestWithToken('/ana-api/allsupplyinfo', { params });
};

const fetchShopList = async params => {
  return requestWithToken('/ana-api/shoplist', { params });
};

const addTemplate = async args => {
  return requestWithToken('/ana-api/addtemplate', { data: args, method: 'POST' });
};

const fetchRegexdetail = async params => {
  return requestWithToken('/ana-api/model_detail', { params });
};

export default {
  namespace: 'regextable',

  state: {
    titleRegexs: [],
    detail: {},
  },

  effects: {
    *fetch({ payload }, { put, call }) {
      if (payload.supply_sid) {
        const response = yield call(fetchSupplies, payload);
        if (response.err === 0) {
          const result = response.data.map(e => ({
            sid: e.sid,
            shop_sid: e.shop_sid,
            title: e.title,
            name: e.supply_name,
            sup_info: e.sup_info,
          }));
          yield put({ type: 'save', payload: { titleRegexs: result } });
        }
      } else if (payload.shop_sid) {
        const response = yield call(fetchShopList, payload);
        if (response.err === 0) {
          const result = response.data.map(e => ({
            shop_sid: e.sid,
            title: '--',
            name: e.shop_name,
            sh_conc: e.sh_conc,
          }));
          yield put({ type: 'save', payload: { titleRegexs: result } });
        }
      }
    },
    *addTemplate({ payload }, { call }) {
      const response = yield call(addTemplate, payload);
      if (response.err === 0) {
        message.success('保存成功√', 5);
      }
    },
    *fetchRegexDetail({ payload }, { put, call }) {
      const response = yield call(fetchRegexdetail, payload);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { detail: response.data } });
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
      return { ...state, upData: undefined };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/setting/template/titleRegex') {
          // dispatch({ type: 'fetch' });
          dispatch({ type: 'global/fetchSupplies' });
          dispatch({ type: 'global/fetchShopList' });
        }
      });
    },
  },
};
