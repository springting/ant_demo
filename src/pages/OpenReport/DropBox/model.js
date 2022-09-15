import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';
import router from 'umi/router';

import request from '@/utils/request';

const paramsApi = async params => {
  return request('/ana-api/report', { params });
};
const convertXls = async params => {
  return request('/ana-api/convert_xls', { params });
};
const commitXls = async params => {
  return request('/ana-api/commit_xls', { params });
};

const initState = {
  reportname: undefined,
  desc: undefined,
  demos: [],
  upFileName: undefined,
  upData: undefined,
  remark: undefined, // 标志是否要显示备注输入框
};

const OpenReportModel = {
  namespace: 'dropbox',
  state: { ...initState },
  effects: {
    *pageInit({ payload }, { put, call }) {
      const { reportname } = payload;
      const r = yield call(paramsApi, { groupid: 'dropbox', reportname });
      if (r.err === 0) {
        yield put({
          type: 'save',
          payload: {
            reportname,
            desc: r.data.desc,
            demos: r.data.demos,
            remark: r.data.description,
          },
        });
      } else {
        message.error('接口错误，页面初始化失败！');
      }
    },
    *filePreview({ payload }, { put, call }) {
      const { f } = payload;
      const r = yield call(convertXls, payload);
      if (r.err === 0) {
        const { rows } = r;
        yield put({ type: 'save', payload: { upFileName: f, upData: rows } });
      }
    },
    *submit({ payload }, { put, call }) {
      const r = yield call(commitXls, payload);
      if (r.err === 0) {
        message.info('提交成功');
        yield put({ type: 'save', payload: initState });
        // 如果返回的result里有post_uri，那么就渲染uri对应数据
        if (r.results.post_uri) {
          const query = queryString.parse(r.results.post_uri.split('?')[1]);
          const { reportname } = query;
          delete query.reportname;
          yield router.push({ pathname: `/default/openreport/${reportname}`, query });
        }
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        const match = pathToRegexp('/:any/dropbox/:reportname').exec(pathname);
        if (match) {
          const reportname = match[2];
          dispatch({ type: 'pageInit', payload: { reportname } });
        }
      });
    },
  },
};
export default OpenReportModel;
