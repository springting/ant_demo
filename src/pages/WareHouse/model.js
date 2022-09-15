/* eslint-disable camelcase */
import { message } from 'antd';
// import { COMPANY_ID } from '@/settings';
import { requestWithToken } from '@/utils/request';
import { routerRedux } from 'dva/router';
import { loadLocalJson } from '@/utils/utils';
// import router from 'umi/router';

const cfgStockXls = async params => {
  return requestWithToken('/xzs-api/cfgStockXls', { params });
};
const fetchSupplyBrand = async params => {
  return requestWithToken('/yz-api/open-supplybrand', { params });
};
const makeStockXls = async args => {
  return requestWithToken('/xzs-api/mkStockXls', { data: args, method: 'POST' });
};
const insertStock = async params => {
  return requestWithToken('/xzs-api/insertStock', { params });
};
const FetchItems = async params => {
  return requestWithToken('/xzs-api/items', { params });
};
const FetchBills = async params => {
  return requestWithToken('/ana-api/fetchbills', { params });
};
const DeleteBills = async params => {
  return requestWithToken('/ana-api/fetchbills', { params, method: 'POST' });
};
const ResetInfo = async args => {
  return requestWithToken(`/xzs-api/edit/${args.pro_md5}`, { data: args, method: 'POST' });
};
const UpdateProMd5 = async args => {
  return requestWithToken(`/xzs-api/edit/${args.pro_md5}`, { data: args, method: 'POST' });
};
const DeleteItems = async args => {
  return requestWithToken(`/xzs-api/edit/${args.pro_md5}`, { data: args, method: 'POST' });
};
const refreshImage = async args => {
  return requestWithToken('/xzs-api/image_refresh', { params: args, data: args, method: 'POST' });
};
const youzanSync = async args => {
  return requestWithToken('/xzs-api/youzan_sync', { data: args, method: 'POST' });
};
const onRefresh = async params => {
  return requestWithToken(`/xzs-api/youzan_sync?action_id=${params}`, { params });
};
const editItems = async params => {
  return requestWithToken(`/xzs-api/edit/${params.pro_md5}`, { params });
};
const Stock = async params => {
  return requestWithToken('/xzs-api/stock', { params });
};
const fetchdataAPI = async params => {
  return requestWithToken('/xzs-api/dataAPI', { params });
};
const UpFile = async params => {
  return requestWithToken('/xzs-api/make_regex', { params });
};
const makeRegex = async args => {
  return requestWithToken('/xzs-api/make_regex', { params: args, data: args, method: 'POST' });
};
const addMainData = async args => {
  return requestWithToken('/xzs-api/addCommonMainData', { data: args, method: 'POST' });
};
const addMaindataSubmit = async args => {
  return requestWithToken('/xzs-api/addMaindataSubmit', {
    params: args,
    data: args,
    method: 'POST',
  });
};
const remakeStock = async params => {
  return requestWithToken('/xzs-api/remakeStock', { params });
};
const EditSubmit = async args => {
  return requestWithToken(`/xzs-api/edit/${args.pro_md5}?bill_sid=${args.bill_sid}`, {
    data: args,
    method: 'POST',
  });
};
const nextItems = async params => {
  return requestWithToken('/xzs-api/next', { params });
};

export default {
  namespace: 'warehouse',

  state: {
    upData: undefined,
    sbc: {},
    mkparams: {},
    map_idx: {},
    result: {},
    msg: undefined,
    visible: undefined,
    bills: [],
    bill_sid: loadLocalJson('bill_sid') || undefined,
    items: [],
    percent: undefined,
    cateMap: {},
    template: {},
    results: {},
    ret: {},
    flag: undefined,
  },

  effects: {
    // 用于set_cookie('session_id')
    *stock({ payload }, { call }) {
      yield call(Stock, payload);
    },
    *cfgStock({ payload }, { put, call }) {
      const { bid, f } = payload;
      const response = yield call(cfgStockXls, payload);
      if (response.err === 0) {
        const { map_idx } = response;
        if (
          (map_idx.sku > -1 &&
            map_idx.stock > -1 &&
            map_idx.size > -1 &&
            map_idx.color > -1 &&
            map_idx.price_cur > -1) ||
          (map_idx.sku > -1 &&
            map_idx.num_size > -1 &&
            map_idx.size_head > -1 &&
            map_idx.size_tail > -1 &&
            map_idx.color > -1 &&
            map_idx.price_cur > -1)
        ) {
          yield put({ type: 'save', payload: { visible: true } });
        }
        yield put({ type: 'save', payload: { upData: response.rows } });
        yield put({ type: 'save', payload: { map_idx: response.map_idx } });
        yield put({ type: 'addmkparams', payload: { mkparams: { brand_sid: bid, f } } });
        yield put({ type: 'addmkparams', payload: { mkparams: response.map_idx } });
        yield put(
          routerRedux.push({
            pathname: `/good/cfgStockXls`,
            state: [payload],
          }),
        );
      }
    },
    *fetchsupplybrand({ payload }, { put, call, select }) {
      const { entry, f, brand_token } = payload;
      const response = yield call(fetchSupplyBrand, payload);
      if (response && response.data && response.data.td) {
        const info = response.data.td.map(e => ({
          su_conc: e[0],
          brand_name: e[2],
          category_sid: e[3],
          category_name: e[4],
          supply_sid: e[5],
          shop_sid: e[6],
          shop_name: e[7],
          supply_name: e[9],
        }));
        yield put({ type: 'save', payload: { sbc: info[0] } });
        yield put({ type: 'addmkparams', payload: { mkparams: info[0] } });
      }
      const sbc = yield select(state => state.warehouse.sbc);
      if (entry) {
        yield put({
          type: 'make_regex',
          payload: {
            f,
            entry,
            sid: sbc.supply_sid,
            bid: brand_token,
            cid: sbc.category_sid,
            brand: sbc.brand_name,
            cname: sbc.category_name,
          },
        });
      }
    },
    *mkStock(_, { put, call, select }) {
      yield put({
        type: 'addmkparams',
        payload: { mkparams: { event: 'insert', json: 1, auto: 1 } },
      });
      const payload = yield select(state => state.warehouse.mkparams);
      const response = yield call(makeStockXls, payload);
      if (response.err === 0) {
        // console.log(response.result);
        if (response.result.fileMiss) {
          yield put({ type: 'save', payload: { result: response.result } });
          yield put(
            routerRedux.push({
              pathname: `/good/addMainXls`,
            }),
          );
        } else {
          yield put({ type: 'save', payload: { result: response.result } });
          const param = {
            baseMsg: response.result.baseMsg,
            map_idx: response.result.baseMsg.map_idx,
            fileIn: response.result.fileIn.path,
          };
          const ret = yield call(remakeStock, param);
          if (ret) {
            yield put({ type: 'save', payload: { ret } });
            yield put(
              routerRedux.push({
                pathname: `/good/mkStockXls`,
              }),
            );
          }
        }
      }
    },
    *remkStock(_, { put, call, select }) {
      yield put({ type: 'addmkparams', payload: { mkparams: { event: 'check', json: 1 } } });
      const payload = yield select(state => state.warehouse.mkparams);
      const response = yield call(makeStockXls, payload);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { result: response.result } });
        const param = {
          baseMsg: response.result.baseMsg,
          map_idx: response.result.baseMsg.map_idx,
          fileIn: response.result.fileIn.path,
        };
        const ret = yield call(remakeStock, param);
        if (ret) {
          yield put({ type: 'save', payload: { ret } });
          yield put(
            routerRedux.push({
              pathname: `/good/mkStockXls`,
            }),
          );
        }
      }
    },
    *insert({ payload }, { put, call }) {
      const response = yield call(insertStock, payload);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { msg: response.msg } });
      }
    },
    *fetchBills({ payload }, { put, call }) {
      const response = yield call(FetchBills, payload);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { bills: response.data } });
      }
    },
    *deleteBills({ payload }, { put, call }) {
      const response = yield call(DeleteBills, payload);
      if (response.err === 0) {
        message.success('删除成功√');
        yield put({ type: 'fetchBills' });
      }
    },
    *fetchItems({ payload }, { put, call }) {
      localStorage.setItem('bill_sid', JSON.stringify(payload.bill_sid));
      const response = yield call(FetchItems, payload);
      yield put({ type: 'save', payload: { bill_sid: payload.bill_sid } });
      if (response) {
        // console.log(response)
        yield put({ type: 'save', payload: { items: response.docs } });
      }
      yield put(
        routerRedux.push({
          pathname: `/good/item`,
        }),
      );
    },
    *reset({ payload }, { put, call }) {
      const response = yield call(ResetInfo, payload);
      if (response.err === 0) {
        yield put({ type: 'fetch', payload: { bill_sid: loadLocalJson('bill_sid'), f: 'json' } });
        message.success('清除成功√', 5);
        yield put({ type: 'save', payload: { flag: true } });
      }
    },
    *updateProMd5({ payload }, { put, call }) {
      const response = yield call(UpdateProMd5, payload);
      if (response.err === 0) {
        yield put({ type: 'fetch', payload: { bill_sid: loadLocalJson('bill_sid'), f: 'json' } });
        message.success('更新成功√', 5);
      }
    },
    *delete({ payload }, { put, call }) {
      const response = yield call(DeleteItems, payload);
      if (response.err === 0) {
        yield put({ type: 'fetch', payload: { bill_sid: loadLocalJson('bill_sid'), f: 'json' } });
        message.success('删除成功√', 5);
      }
    },
    *fetch({ payload }, { put, call }) {
      const response = yield call(FetchItems, payload);
      if (response) {
        yield put({ type: 'save', payload: { items: response.docs } });
      }
    },
    *edit({ payload }, { put, call }) {
      const response = yield call(editItems, payload);
      // console.log(response);
      if (response.doc) {
        yield put({ type: 'save', payload: { result: response, flag: undefined } });
        yield put(
          routerRedux.push({
            pathname: `/good/editd`,
          }),
        );
      } else {
        message.error(`${response}`, 5);
      }
    },
    *refresh({ payload }, { put, call }) {
      const postApi = payload.disp === 2 ? refreshImage : youzanSync;
      const response = yield call(postApi, payload);
      if (response.err === 0) {
        message.success('提交成功√', 5);
        yield put({ type: 'check_state', payload: response.action_id });
      } else {
        message.error(`${response.msg}`, 5);
      }
    },
    *check_state({ payload }, { put, call }) {
      const ret = yield call(onRefresh, payload);
      if (ret.err === 0) {
        yield put({ type: 'save', payload: { percent: ret.percent } });
      }
      if (ret.done) {
        yield put({ type: 'fetch', payload: { bill_sid: loadLocalJson('bill_sid'), f: 'json' } });
        message.success('刷新完成', 5);
      } else {
        setTimeout(function() {
          window.g_app._store.dispatch({ type: 'warehouse/check_state', payload });
        }, 1000);
      }
    },
    *dataAPI({ payload }, { put, call, select }) {
      const sbc = yield select(state => state.warehouse.sbc);
      const params = { ...payload, supply: sbc.supply_sid };
      const response = yield call(fetchdataAPI, params);
      if (response) {
        // console.log(response);
        yield put({ type: 'save', payload: { cateMap: response } });
      }
    },
    *dataAPI2({ payload }, { put, call, select }) {
      const sbc = yield select(state => state.warehouse.sbc);
      const params = {
        ...payload,
        supply_sid: sbc.supply_sid,
        brandName: sbc.brand_name,
        class1: sbc.category_sid,
      };
      const response = yield call(fetchdataAPI, params);
      if (response) {
        yield put({ type: 'save', payload: { template: response } });
      }
    },
    *upFile({ payload }, { put, call }) {
      const response = yield call(UpFile, payload);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { upData: response.rows } });
      }
    },
    *make_regex({ payload }, { put, call }) {
      // console.log(payload);
      const response = yield call(makeRegex, payload);
      if (response.err === 0) {
        message.success('配置完成', 5);
        yield put({ type: 'clear' });
      }
    },
    *addMainData({ payload }, { put, call }) {
      const response = yield call(addMainData, payload);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { results: response.result } });
        yield put(
          routerRedux.push({
            pathname: `/good/checkMainXls`,
          }),
        );
      }
    },
    *addMaindataSubmit({ payload }, { put, call }) {
      const response = yield call(addMaindataSubmit, payload);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { result: response.result } });
        const param = {
          baseMsg: response.result.baseMsg,
          map_idx: response.result.baseMsg.map_idx,
          fileIn: response.result.fileIn.path,
        };
        const ret = yield call(remakeStock, param);
        if (ret) {
          yield put({ type: 'save', payload: { ret } });
          yield put(
            routerRedux.push({
              pathname: `/good/mkStockXls`,
            }),
          );
        }
      }
    },
    *editSubmit({ payload }, { put, call }) {
      const response = yield call(EditSubmit, payload);
      if (!payload.sku_image) {
        if (response.err === 0) {
          yield put({ type: 'save', payload: { flag: true } });
          message.success('保存成功√', 5);
        } else {
          message.error(`${response.msg}`, 5);
        }
      }
    },
    *next({ payload }, { put, call, select }) {
      const response = yield call(nextItems, payload);
      // console.log(response);
      if (response.err === 0) {
        yield put({ type: 'save', payload: { flag: undefined } });
        message.success(`${response.msg}`, 5);
        yield put(
          routerRedux.push({
            pathname: `/good/item`,
          }),
        );
      } else if (response.pro_md5) {
        yield put({ type: 'save', payload: { flag: undefined } });
        const bill_sid = yield select(state => state.warehouse.bill_sid);
        yield put({ type: 'edit', payload: { pro_md5: response.pro_md5, bill_sid, f: 'json' } });
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
    addmkparams(state, { payload }) {
      const { mkparams } = payload;
      return { ...state, mkparams: { ...state.mkparams, ...mkparams } };
    },
    clear(state) {
      return { ...state, upData: undefined };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/good/stock') {
          dispatch({ type: 'global/fetchSupplies' });
          dispatch({ type: 'stock', payload: { json: 1 } });
        }
        if (pathname === '/good/bill') {
          dispatch({ type: 'fetchBills' });
          dispatch({ type: 'global/fetchBrandList' });
        }
        if (pathname === '/good/item') {
          dispatch({ type: 'fetch', payload: { bill_sid: loadLocalJson('bill_sid'), f: 'json' } });
        }
        if (pathname === '/good/cfgStockXls') {
          dispatch({
            type: 'dataAPI',
            payload: { APIName: 'categoryMap' },
          });
          dispatch({
            type: 'dataAPI2',
            payload: { APIName: 'maindataTemplate' },
          });
        }
        if (pathname === '/setting/template/category') {
          dispatch({ type: 'stock', payload: { json: 1 } });
          dispatch({ type: 'global/fetchSupplies' });
          dispatch({ type: 'clear' });
        }
      });
    },
  },
};
