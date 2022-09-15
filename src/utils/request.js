/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response = {} } = error;
  const errortext = codeMessage[response.status] || response.statusText;
  const { status, url } = response;
  if (response.status === 403) {
    notification.error({
      message: '登录身份失效',
      description: '出于安全考虑，请您重新扫码登录。',
    });
    window.g_app._store.dispatch(
      routerRedux.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      }),
    );
    return null;
  }
  return notification.error({
    message: `请求错误 ${status}: ${url}`,
    description: errortext,
  });
};
/**
 * 配置request请求时的默认参数
 */

const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

export const requestWithToken = (uri, options) => {
  const { params } = options;
  const ctoken = localStorage.getItem('ctoken');
  const token = localStorage.getItem('token');
  const secret = localStorage.getItem('secret');
  if (!ctoken || !token || !secret) {
    notification.error({
      message: '登录身份失效',
      description: '出于安全考虑，请您重新扫码登录。',
    });
    window.g_app._store.dispatch(
      routerRedux.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      }),
    );
    return null;
  }
  const auth = {
    ctoken,
    _user_token: token,
    _user_secret: secret,
  };
  options.params = { ...params, ...auth, json: 1 };
  console.log(111111, options);
  return request(uri, options);
};

export default request;

// response拦截器, 处理response
request.interceptors.response.use(async (response, options) => {
  try {
    // 判断返回结果中是否是登陆身份失败，如果身份过期，进行统一处理
    const data = await response.clone().json();
    if (data.err === -1 && data.msg === 'auth failed') {
      notification.error({
        message: '登录身份失效',
        description: '出于安全考虑，请您重新扫码登录。',
      });
      localStorage.clear();
      // 跳转到登陆页面
      window.g_app._store.dispatch(
        routerRedux.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        }),
      );
    }
  } catch (error) {
    const contentType = response.headers.get('Content-Type');
    if (contentType === 'application/octet-stream' || contentType === 'application/x-xls') {
      // eslint-disable-next-line no-param-reassign
      options.responseType = 'blob';
    }
  }

  return response;
});

function download(blobData, forDownLoadFileName) {
  const elink = document.createElement('a');
  const blob = new Blob([blobData]);
  elink.download = forDownLoadFileName;
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink);
}

export const downloadRequest = async (uri, options) => {
  options.getResponse = true;
  const { data, response } = await requestWithToken(uri, options);
  const filename = response.headers.get('Content-Disposition').slice(21);
  download(data, filename);
};
