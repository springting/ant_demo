/* eslint-disable camelcase */
import { message } from 'antd';
import { requestWithToken } from '@/utils/request';

const updateCompany = async args => {
    return requestWithToken('/ana-api/outlets/companies', { data: args, method: 'POST' });
};

const deleteItems = async params => {
  return requestWithToken('/ana-api/outlets/delete', { params });
}

export default {
  namespace: 'companytable',

  state: {
    
  },

  effects: {
    *update({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(updateCompany, payload);
      if (response.err === 0) {
        message.success('修改成功√', 5);
        yield put({ type: 'global/fetchCompanies' });
      } else {
        message.error(`${response.msg}`, 10)
      }
    },
    *delete({ payload }, { put, call }) {
      // console.log(payload)
      const response = yield call(deleteItems, payload);
      if (response.err === 0) {
        message.success('删除成功√', 5);
        yield put({ type: 'global/fetchCompanies' });
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
        if (pathname ==='/company/list') {         
            dispatch({ type: 'global/fetchCompanies' });
        }
      });
    },
  },
};
