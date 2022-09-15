import React from 'react';
import { connect } from 'dva';
import { reloadAuthorized } from '@/utils/Authorized';
import { getAuthority, setAuthority } from '@/utils/authority';

function Login({ login: { uri, ticket } }) {
  const ctoken = localStorage.getItem('ctoken');
  const token = localStorage.getItem('token');
  const secret = localStorage.getItem('secret');
  if (ctoken && token && secret) {
    const auth = getAuthority();
    setAuthority(auth);
    reloadAuthorized();
    window.location.href = '/';
  }
  // const site =
  // 'https://wap.vongcloud.com/user/';
  // document.domain === 'localhost'
  //   ? 'https://youzan-erp.vongcloud.com/ana-api/'
  //   : // 'http://test.path-analytics.com/ana-api/'
  //     `${window.location.protocol}//${document.domain}/ana-api/`;

  return ticket ? (
    <img
      src={`https://wap.vongcloud.com/lserp/qrcode/encode?code=${uri}`}
      alt="登录二维码"
      style={{ display: 'block', margin: 'auto' }}
    />
  ) : (
    <p style={{ textAlign: 'center' }}>二维码获取中...</p>
  );
}

export default connect(({ login, loading }) => ({
  login,
  loading,
}))(Login);
