/* eslint-disable camelcase */
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { fetchApidata, fetchFeeType, addTbData, querySid } from '@/services/global';
import { isEmpty } from '@/utils/utils';
import { COMPANY_ID } from '@/settings';

export default {
  namespace: 'contractMargin',

  state: {
    data: {
      list: [],
    },
    supplyData: [],

    printRecord: {}, // 要打印的费用
    fee_type_map: {},
    fee_title_map: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // eslint-disable-line
      history.listen(({ pathname }) => {
        const match = pathToRegexp('/contracts/margin/printMargin/:marginId').exec(pathname);
        if (match) {
          dispatch({ type: 'fetchFeeType' });
          dispatch({
            type: 'marginItem',
            payload: {
              reportname: 'id_margin',
              margin_sid: match[1],
            },
          });
        }
      });
    },
  },

  effects: {
    // 根据marginId获取费用
    *marginItem({ payload }, { call, put }) {
      // const { fee_type_list } = yield select(state => state.contractMargin);
      const res = yield call(fetchApidata, payload);
      if (res.err === 0) {
        yield put({ type: 'save', payload: { printRecord: res.data[0] } });
      }
    },
    // 费用列表
    *marginList({ payload }, { call, put }) {
      const res = yield call(fetchApidata, payload);
      if (res.err === 0) {
        yield put({ type: 'save', payload: { data: { list: res.data.reverse() } } });
      }
    },
    // 按单号查询费用列表
    *marginList2({ payload }, { call, put }) {
      const res = yield call(querySid, payload);
      if (res.err === 0) {
        yield put({ type: 'save', payload: { data: { list: res.data } } });
      }
    },
    // 下拉列表数据
    *supplyList({ payload }, { call, put }) {
      const res = yield call(fetchApidata, payload);
      if (res.err === 0) {
        yield put({ type: 'save', payload: { supplyData: res.data } });
      }
    },
    // 录入费用
    *recordMargin({ payload, callback }, { call, put }) {
      const params = { ...payload, tbl: 'standing_book' };
      Object.keys(payload).forEach(k => {
        params[k] = isEmpty(params[k]) ? '' : params[k];
      });
      const response = yield call(addTbData, params);
      if (response && response.err === 0) {
        message.success('保存成功');
        yield put({
          type: 'marginList',
          payload: {
            reportname: 'all_margin',
          },
        });
      } else {
        message.error('保存失败！');
      }
      if (callback) callback(response);
    },
    *fetchFeeType(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchFeeType, param);
      if (response && response.data && response.data.td) {
        const fee_type_map = {};
        const fee_title_map = {};
        response.data.td.forEach(e => {
          const [value, key, title] = e;
          fee_type_map[key] = value;
          fee_title_map[key] = title;
        });
        yield put({ type: 'save', payload: { fee_type_map, fee_title_map } });
      } else {
        message.error('无法获得费用类型');
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
};
