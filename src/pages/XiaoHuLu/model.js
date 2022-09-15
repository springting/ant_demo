/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';
import cookie from 'react-cookies';
import { routerRedux } from 'dva/router';

const editConfig = async args => {
  return requestWithToken('/xzs-api/information', { data: args, method: 'POST' });
};

export default {
  namespace: 'xiaohulu',

  state: {
    params: {
      v: '1.0.0',
      appkey: '602e4878fc679b17a834e82db8f66ea0',
      timestamp: '1657190700',
      sign: '2437bd338fda30a4e0226c6ae93ca689',
    },
    charts: [],
    pages: [],
    detail: {},
    repos: [],
  },

  effects: {
    *add({ payload }, { call, put, select }) {
      console.log(payload);
      const params = yield select(state => state.xiaohulu.params);
      const args = { ...params, ...payload };
      const response = yield call(editConfig, args);
      if (response.err === 0) {
        message.success('保存成功√', 5);
        if (payload.service === 'xiaohulu.chart_update') {
          yield put(
            routerRedux.push({
              pathname: `/xiaohulu/chart`,
            }),
          );
        } else if (payload.service === 'xiaohulu.page_update') {
          yield put(
            routerRedux.push({
              pathname: `/xiaohulu/page`,
            }),
          );
        } else {
          yield put({ type: 'fetch', payload: { service: 'xiaohulu.repo_fetch', data: {} } });
        }
      } else {
        message.error(`${response.msg}`, 5);
      }
    },
    *fetch({ payload }, { put, call, select }) {
      const params = yield select(state => state.xiaohulu.params);
      const args = { ...params, ...payload };
      const response = yield call(editConfig, args);
      if (response.err === 0) {
        // console.log(response.data)
        if (payload.service === 'xiaohulu.chart_fetch') {
          yield put({ type: 'save', payload: { charts: response.data } });
        } else if (payload.service === 'xiaohulu.page_fetch') {
          yield put({ type: 'save', payload: { pages: response.data } });
        } else if (payload.service === 'xiaohulu.repo_fetch') {
          yield put({ type: 'save', payload: { repos: response.data } });
        }
      }
    },
    *fetchDetail({ payload }, { put, call, select }) {
      const params = yield select(state => state.xiaohulu.params);
      const args = { ...params, ...payload };
      const response = yield call(editConfig, args);
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
      return { ...state, detail: {} };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/xiaohulu/chart') {
          dispatch({ type: 'fetch', payload: { service: 'xiaohulu.chart_fetch', data: {} } });
        }
        if (pathname === '/xiaohulu/chartDetail' && cookie.load('default_chartId')) {
          dispatch({
            type: 'fetchDetail',
            payload: {
              service: 'xiaohulu.chart_fetch',
              data: { id: cookie.load('default_chartId') },
            },
          });
        }
        if (pathname === '/xiaohulu/page') {
          dispatch({ type: 'fetch', payload: { service: 'xiaohulu.page_fetch', data: {} } });
        }
        if (pathname === '/xiaohulu/pageDetail' && cookie.load('default_pageId')) {
          dispatch({
            type: 'fetchDetail',
            payload: {
              service: 'xiaohulu.page_fetch',
              data: { id: cookie.load('default_pageId') },
            },
          });
          dispatch({ type: 'fetch', payload: { service: 'xiaohulu.chart_fetch', data: {} } });
        }
        if (pathname === '/xiaohulu/openreport') {
          dispatch({ type: 'fetch', payload: { service: 'xiaohulu.repo_fetch', data: {} } });
        }
      });
    },
  },
};
