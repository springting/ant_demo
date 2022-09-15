import React from 'react';
import { BEIAN } from '@/settings';

export default () => {
  return (
    <footer className="ant-layout-footer" style={{ Padding: 0 }}>
      <footer className="ant-pro-global-footer">
        <div className="ant-pro-global-footer-links">奥莱领秀（广州）传媒科技有限公司</div>
        <div className="ant-pro-global-footer-links" style={{ fontSize: '80%' }}>
          <a href="http://www.beian.miit.gov.cn">{BEIAN}</a>
        </div>
      </footer>
    </footer>
  );
};
