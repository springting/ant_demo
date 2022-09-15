/* eslint-disable camelcase */
import { message } from 'antd';
import {
  queryAllContract,
  searchContract,
  addContract,
  fetchSupplies,
  fetchFeeType,
  fetchTransRate,
  fetchShopList,
  fetchExpired,
  fetchBrands,
} from './service';
import { querySid } from '@/services/global';
import { isEmpty, table2list, loadLocalJson } from '@/utils/utils';
import { COMPANY_ID } from '@/settings';

export default {
  namespace: 'contractContractList',

  state: {
    data: {
      list: [],
      // pagination: {},
    },
    editingDetail: {},
    supply_list: loadLocalJson('supply_list') || [],
    trans_rate_list: [],
    trans_rate_obj: {},
    fee_type_list: loadLocalJson('fee_type_list') || [],
    shop_list: loadLocalJson('shop_list') || [], // data like [{sid: 3001, shop_name: 'xxxx'},]
    expired: {}, // data like {th:[], td:[]}
    brandRange: {}, // use supply_sid as key, value like [{"brand_token": "8fbc9b04123d5bce", "brand_name": "耐克NIKE" }, ...]
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const fetchApi = payload.supply_sid ? searchContract : queryAllContract;
      const param = { ...payload };
      const response = yield call(fetchApi, param);
      if (response && response.data && response.data.td) {
        const contracts = response.data.td.map(e => ({
          sid: e[0],
          shop_sid: e[1],
          supply_sid: e[2],
          model: e[3],
          start_at: e[4],
          end_at: e[5],
        }));
        yield put({ type: 'save', payload: { data: { list: contracts.reverse() } } });
      } else {
        message.err('数据获取失败！');
      }
    },
    *fetchSupplies(_, { call, put }) {
      // const param = { supply_sid: 200001 };
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchSupplies, param);
      if (response && response.data && response.data.td) {
        const supply_list = response.data.td.map(e => ({
          sid: parseInt(e[0], 10),
          supply_name: e[1],
        }));
        yield put({ type: 'save', payload: { supply_list } });
        localStorage.setItem('supply_list', JSON.stringify(supply_list));
      } else {
        message.error('无法获得供应商数据');
      }
    },
    *fetchTransRate(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchTransRate, param);
      const default_v = { 1: 0.01, 2: 0.02, 0: 0 }; // 国内卡默认1%、国外卡默认2%、其它默认0%
      if (response && response.data && response.data.td) {
        const trans_rate_obj = {};
        // {name:e[0], trans_sid:e[1], title:e[2], fee_rate: e[3]}
        const trans_rate_list = [];
        response.data.td.forEach(e => {
          if (isEmpty(trans_rate_obj[e[2]])) {
            trans_rate_obj[e[2]] = [];
          }
          trans_rate_obj[e[2]].push({
            name: e[0],
            trans_sid: e[1],
            title: e[2],
            fee_rate: e[3],
            v: default_v[e[3]],
          });
          trans_rate_list.push({ name: e[0], code: e[1], value: 0 });
        });

        yield put({ type: 'save', payload: { trans_rate_obj, trans_rate_list } });
      } else {
        message.error('无法获得支付方式数据');
      }
    },
    *fetchFeeType(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchFeeType, param);
      if (response && response.data && response.data.td) {
        const fee_type_list = response.data.td.map(e => ({
          name: e[0],
          code: e[1].toString(),
          cycle_regex: e[3],
        }));
        yield put({ type: 'save', payload: { fee_type_list } });
        localStorage.setItem('fee_type_list', JSON.stringify(fee_type_list));
      } else {
        message.error('无法获得费用类型');
      }
    },
    *fetchShopList(_, { call, put }) {
      const param = { company_sid: COMPANY_ID };
      const response = yield call(fetchShopList, param);
      if (response && response.data && response.data.td) {
        yield put({ type: 'save', payload: { shop_list: table2list(response.data) } });
        localStorage.setItem('shop_list', JSON.stringify(table2list(response.data)));
      } else {
        message.error('获取门店信息出错');
      }
    },
    *fetchBrands({ payload }, { call, put }) {
      const { supply_sid } = payload;
      const response = yield call(fetchBrands, payload); // payload = {supply_sid: xxxxx}
      if (response.err === 0) {
        const { data } = response;
        yield put({ type: 'saveBrands', payload: { supply_sid, data } });
      }
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addContract, payload);
      if (response && response.err === 0) {
        yield put({ type: 'save', payload });
        message.success('保存成功√');
        const newItem = { ...payload, sid: response.sid };
        if (!payload.sid) {
          // 无sid，是新增
          yield put({ type: 'addToList', payload: newItem });
        } else {
          yield put({ type: 'updateToList', payload });
        }
      } else {
        message.error('保存失败！');
      }
      if (callback) callback();
    },
    *detail({ payload, callback }, { call, put }) {
      const response = yield call(querySid, payload);
      if (response && response.err === 0) {
        const editingDetail = response.data[0];
        yield put({ type: 'save', payload: { editingDetail } });
        yield put({ type: 'fetchBrands', payload: { supply_sid: editingDetail.supply_sid } });
      } else {
        message.error('获取详情失败！');
      }
      if (callback) callback();
    },
    *fetchExpired({ payload, callback }, { call, put }) {
      const response = yield call(fetchExpired, payload);
      if (response && response.data) {
        yield put({ type: 'save', payload: { expired: response.data } });
      }
      if (callback) callback();
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveBrands(
      state,
      {
        payload: { supply_sid, data },
      },
    ) {
      const { brandRange } = state;
      const brands = {};
      brands[supply_sid] = data;
      return { ...state, brandRange: { ...brandRange, ...brands } };
    },
    addToList(state, { payload }) {
      const {
        data: { list },
      } = state;
      return { ...state, data: { list: [payload, ...list] } };
    },
    updateToList(state, { payload }) {
      const {
        data: { list },
      } = state;
      for (let i = 0; i < list.length; i += 1) {
        if (list[i].sid === payload.sid) {
          list[i] = payload;
          break;
        }
      }
      // eslint-disable-next-line no-param-reassign
      state.editingDetail = payload;
      return state;
    },
    clear(state) {
      return { ...state, editingDetail: {} };
    },
  },
};
