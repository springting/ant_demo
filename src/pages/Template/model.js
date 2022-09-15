/* eslint-disable camelcase */
import { message } from 'antd';
// import { COMPANY_ID } from '@/settings';
import { requestWithToken } from '@/utils/request';
// import { loadLocalJson } from '@/utils/utils';
import { routerRedux } from 'dva/router';

const convertXls = async params => {
  return requestWithToken('/ana-api/convert_xls', { params });
};

const addTemplate = async args => {
  return requestWithToken('/ana-api/addtemplate', { data: args, method: 'POST' });
};

const fetchTemplate = async params => {
  return requestWithToken('/ana-api/model_rule', { params });
};

const fetchTempdetail = async params => {
  return requestWithToken('/ana-api/model_detail', { params });
};

const CopyTemplate = async params => {
  return requestWithToken('/ana-api/copy_check_regex', { params });
};

export default {
  namespace: 'templatetable',

  state: {
    templates: [],
    upFileName: undefined,
    upData: undefined,
    brand_list: [],
  },

  effects: {
    *filePreview({ payload }, { put, call }) {
      const { f } = payload;
      const r = yield call(convertXls, payload);
      if (r.err === 0) {
        const { rows } = r;
        yield put({ type: 'save', payload: { upFileName: f, upData: rows } });
      }
    },
    *addTemplate({ payload }, { call, put }) {
      const response = yield call(addTemplate, payload);
      if (response.err === 0) {
        yield put(
          routerRedux.push({
            pathname: `/setting/template/list`,
          }),
        );
        yield put({ type: 'save', payload: { upData: undefined } });
        message.success('保存成功√', 5);
      }
    },
    *fetchTemplate({ payload }, { put, call }) {
      const response = yield call(fetchTemplate, payload);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { templates: response.data } });
      }
    },
    *fetchTempdetail({ payload }, { put, call }) {
      const response = yield call(fetchTempdetail, payload);
      if (response.err === 0) {
        yield put(
          routerRedux.push({
            pathname: `/setting/template/form`,
            state: { detail: response.data.formItem },
          }),
        );
      } else {
        message.error(`${response.msg}`, 5);
      }
    },
    *copyTemplate({ payload }, { put, call }) {
      const response = yield call(CopyTemplate, payload);
      if (response.err === 0) {
        message.success('同步成功√', 5);
        yield put({
          type: 'fetchTemplate',
          payload: { supply_sid: payload.supply_sid, brand_token: payload.brand_token },
        });
      } else {
        message.error(`${response.msg}`, 5);
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
        if (pathname === '/setting/template/list') {
          dispatch({ type: 'fetchTemplate' });
          dispatch({ type: 'global/fetchSupplies' });
        }
      });
    },
  },
};
