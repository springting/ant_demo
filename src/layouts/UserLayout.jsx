import { connect } from 'dva';
import React from 'react';
import DocumentTitle from 'react-document-title';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import { getPageTitle, getMenuData } from '@ant-design/pro-layout';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import SelectLang from '@/components/SelectLang';
import Footer from './Footer.jsx';
import { COMPANY_NAME } from '@/settings';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes, props);
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>{COMPANY_NAME}-中台登录</span>
              </Link>
            </div>
            <div className={styles.desc}>欢迎使用{COMPANY_NAME}中台，请扫码登录。</div>
          </div>
          {children}
        </div>
        <Footer />
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
