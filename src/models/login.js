/* eslint-disable compat/compat */
import { routerRedux } from 'dva/router';
import { stringify, parse } from 'qs';
import { queryLoginQr, queryScanResult } from '../services/user';
import { reloadAuthorized } from '@/utils/Authorized';
import { setAuthority } from '@/utils/authority';

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(timestamp) {
  await timeout(timestamp);
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}
const Model = {
  namespace: 'login',
  state: {
    ticket: undefined,
    secret: undefined,
    token: undefined,
    ctoken: undefined,
  },
  effects: {
    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
        yield put({ type: 'fetchqr' });
      }
    },
    *fetchqr(_, { call, put }) {
      const r = yield call(queryLoginQr);
      if (r.err === 0) {
        yield put({ type: 'updateqr', payload: { uri: r.auth_uri, ticket: r.qrticket } });
        yield put({ type: 'polllogin' });
      }
    },
    *polllogin(_, { call, put, select }) {
      while (true) {
        const { token, ticket } = yield select(state => state.login);
        if (!ticket) {
          yield sleep(3000);
        } else if (!token) {
          const r = yield call(queryScanResult, { qrticket: ticket });
          if (r.err === 0) {
            // 登录成功，中断循环
            const authority = (r.authority || 'user').split(',');
            // Object.keys(r).forEach(key => {
            //   if (['supply_sid', 'finance', 'developer', 'maintainer', 'sales_market'].indexOf(key) >= 0) authority.push(key);
            // });
            localStorage.setItem('secret', r.secret);
            localStorage.setItem('token', r.token);
            localStorage.setItem('ctoken', r.ctoken);
            localStorage.setItem('username', r.username);
            yield put({
              type: 'loginSuccess',
              payload: { token: r.token, secret: r.secret, ctoken: r.ctoken, authority },
            });
            yield put({ type: 'user/saveCurrentUser', payload: { name: r.username } });
            yield put(routerRedux.replace('/'));
            break;
          } else {
            yield sleep(1000);
          }
        }
      }
    },
  },
  reducers: {
    // changeLoginStatus(state, { payload }) {
    //   return { ...state, status: payload.status, type: payload.type };
    // },
    loginSuccess(
      state,
      {
        payload: { secret, token, ctoken, authority },
      },
    ) {
      setAuthority(authority);
      reloadAuthorized();
      return { ...state, secret, token, ctoken };
    },
    updateqr(
      state,
      {
        payload: { uri, ticket },
      },
    ) {
      return { ...state, uri, ticket };
    },
  },
  subscriptions: {
    getqr({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/user/login') {
          dispatch({ type: 'fetchqr' });
        }
      });
    },
  },
};
export default Model;
