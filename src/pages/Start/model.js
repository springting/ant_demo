/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';
import { loadLocalJson } from '@/utils/utils';

const fetchAds = async params => {
  return requestWithToken('/ana-api/advertisement/fetch', { params });
};

const updateAds = async args => {
  return requestWithToken('/ana-api/advertisement/update', { data: args, method: 'POST' });
};

export default {
  namespace: 'startSetting',

  state: {
    swiper_ads: loadLocalJson('swiper_ads') || [],
    brand_ads: loadLocalJson('brand_ads') || [],
    shop_ads: loadLocalJson('shop_ads') || [],
    shops: [],
    brands: [],
  },

  effects: {
    *fetch(_, { put, call }) {
      const payload = {};
      const response = yield call(fetchAds, payload);
      // console.log(response.data)
      if (response && response.data) {
        yield put({ type: 'save', payload: { swiper_ads: response.data.swiper_ads, brand_ads: response.data.brand_ads, shop_ads: response.data.shop_ads } });
        localStorage.setItem('swiper_ads', JSON.stringify(response.data.swiper_ads));
        localStorage.setItem('brand_ads', JSON.stringify(response.data.brand_ads));
        localStorage.setItem('shop_ads', JSON.stringify(response.data.shop_ads));
      }
    },
    *update({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(updateAds, payload);
      if (response.err === 0) {
        message.success('修改成功√', 5);
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
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname.startsWith('/start')) { 
          dispatch({ type: 'fetch'});        
          dispatch({ type: 'global/fetchBrandList' });
          dispatch({ type: 'global/fetchShopList' });         
        }
      });
    },
  },
};
