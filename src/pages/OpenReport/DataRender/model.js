import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import queryString from 'query-string';

import request, { requestWithToken } from '@/utils/request';
import { COMPANY_ID } from '@/settings';

const paramsApi = async params => {
  return request('/ana-api/report', { params });
};

const reportApi = async params => {
  return requestWithToken('/ana-api/report', { params });
};

const updateRow = async (sid, tablename, args) => {
  const params = { ...args, sid, rpn: tablename, company_sid: COMPANY_ID };
  return requestWithToken('/ana-api/commu', {
    // method: 'POST',
    params,
  });
};

const insertRow = async (tablename, args) => {
  const params = { ...args, rpn: tablename, company_sid: COMPANY_ID };
  return requestWithToken('/ana-api/commi', { params });
};

const deleteRow = async (args, tablename) => {
  const params = { ...args, rpn: tablename, company_sid: COMPANY_ID };
  return requestWithToken('/ana-api/commd', { params });
};

const callInterface = async (url, tablename, args) => {
  const params = { ...args, rpn: tablename, company_sid: COMPANY_ID };
  return requestWithToken(url, { params });
};

const initState = {
  params: [], // 查询参数配置
  data: undefined, // 数据(table list显示用)，最大截断1000条，字段中rownum标明一共有多少数据
  dm: [],
  action: [],
  downfile: undefined,
  reportname: undefined,
};
/*
action字段文档：
action描述了该openreport中有哪些按钮，按钮为一个字典结构，字典的key表示类型，value描述按钮。默认有以下几个类型
{insert: {label: "添加"}}
{update: {label: "修改"}}
{delete: {label: "删除"}}
{interface: {label: "其他", url: "", param: ""}}
其中，insert类按钮默认配置在整个页面上方。其他按钮配置在每一行的操作column

按钮描述更新：
所有类型按钮增加success字段，值类型是object，一定有的字段是to字段，代表去往哪个页面。另一个字段是param，代表跳转时要携带哪些参数
{
  success: {
    to: "openreport/reportname",   // 这个字段目前支持跳往openreport或dropbox，后面跟对应的名称
    param: [],    // 这个字段表示跳转时会带上给页面的参数。如果是openreport，会将此参数作为查询参数进行查询。
                     参数的使用规则是，优先使用从接口返回的参数中的字段，其次使用当前页面当前操作数据的字段。
  }
}

增加batch类型按钮： {batch: {label: "批量选择", url: "", success: {to: "openreport/someresultpage", param: ["sid"]}}}
batch按钮显示方式和insert一致，在整个页面上方。默认显示label的文案，点击后激活下方表格多选，按钮文案变为“提交”，选择数据后点提交会请求接口。
提交时参数是sid的列表。

*/
const OpenReportModel = {
  namespace: 'openreport',
  state: { ...initState },
  effects: {
    *fetchParams({ payload }, { put, call }) {
      // 获取查询参数
      const { reportname, query } = payload;
      const r = yield call(paramsApi, { groupid: 'params', reportname });
      if (r.err !== 0) {
        message.error(`参数配置获取失败！请尝试刷新页面或联系管理员。reportname=${reportname}`);
      }
      const { data, dm, action, config } = r; //  data =  [{NAME, TYPE, DESCRIPTION},...]
      // for test start
      // action.push({batch: {label: "批量提交", type: "global", url: "/test", success: {to: "openreport/promotiondml", param: ["sid"]}}})
      // for test end
      yield put({ type: 'save', payload: { params: data, dm, action, config } });
      if (!data || data.length === 0) {
        // 没有查询参数，不会渲染查询按钮，直接出报表
        yield put({ type: 'fetchData', payload: {} });
      } else if (query && Object.keys(query).length > 0) {
        // 有query参数，直接拿query参数去请求数据
        yield put({ type: 'fetchData', payload: query });
      }
    },
    *fetchData({ payload }, { put, select, call }) {
      const { reportname } = yield select(state => state.openreport);
      const r = yield call(reportApi, { ...payload, groupid: 'data', reportname });
      if (r.err !== 0) {
        message.error(`报表数据获取失败！请尝试刷新页面或联系管理员。reportname=${reportname}`);
      }
      yield put({ type: 'save', payload: r });
    },
    *pageInit({ payload }, { put, select }) {
      const reportname = yield select(state => state.reportname);
      if (reportname !== payload.reportname || !reportname) {
        // 路由变化，以当前路由参数中reportname为准去获取数据
        // 先清除原有数据
        yield put({ type: 'save', payload: { ...initState, reportname: payload.reportname } });
        yield put({ type: 'fetchParams', payload });
      } else {
        yield put({ type: 'save', payload: { reportname: payload.reportname } });
      }
    },
    *updateData(
      {
        payload: { sid, args },
        callback,
      },
      { select, call },
    ) {
      const { reportname } = yield select(state => state.openreport);
      const r = yield call(updateRow, sid, reportname, args);
      if (callback) {
        callback(r);
      }
    },
    *insertData(
      {
        payload: { args },
        callback,
      },
      { select, call },
    ) {
      const { reportname } = yield select(state => state.openreport);
      const r = yield call(insertRow, reportname, args);
      if (callback) {
        callback(r);
      }
    },
    *deleteData({ payload, callback }, { select, call }) {
      const { reportname } = yield select(state => state.openreport);
      const r = yield call(deleteRow, payload, reportname);
      if (callback) {
        callback(r);
      }
    },
    *callApi(
      {
        payload: { url, args },
        callback,
      },
      { select, call },
    ) {
      const { reportname } = yield select(state => state.openreport);
      const r = yield call(callInterface, url, reportname, args);
      if (callback) {
        callback(r);
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    update(
      state,
      {
        payload: { sid, args },
      },
    ) {
      const { th, td } = state.data;
      const sidIdx = th.indexOf('sid');
      if (sidIdx < 0) return state;
      const row = td.filter(r => r[sidIdx] === sid)[0];
      th.forEach((k, idx) => {
        if (k in args) row[idx] = args[k];
      });
      return state;
    },
    delete(
      state,
      {
        payload: { sid },
      },
    ) {
      const { data } = state;
      const { th, td } = data;
      const sidIdx = th.indexOf('sid');
      if (sidIdx < 0) return state;
      data.td = td.filter(r => r[sidIdx] !== sid);
      return state;
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname, search }) => {
        const match = pathToRegexp('/:any/openreport/:reportname').exec(pathname);
        const query = queryString.parse(search);
        if (match) {
          const reportname = match[2];
          dispatch({ type: 'pageInit', payload: { reportname, query } });
        }
      });
    },
  },
};
export default OpenReportModel;
