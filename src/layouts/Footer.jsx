import React from 'react';
import { BEIAN } from '@/settings';

export default () => {
  return (
    <footer className="ant-layout-footer" style={{ Padding: 0 }}>
      <footer className="ant-pro-global-footer">
        <div className="ant-pro-global-footer-links">北京云通时代提供技术支持</div>
        <div className="ant-pro-global-footer-links" style={{ fontSize: '80%' }}>
          <a href="http://www.beian.miit.gov.cn">{BEIAN}</a>
        </div>
      </footer>
    </footer>
  );
};
