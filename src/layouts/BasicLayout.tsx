/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import { ConnectState, ConnectProps } from '@/models/connect';
import RightContent from '@/components/GlobalHeader/RightContent';
import { connect } from 'dva';
import { router } from 'umi';
import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.svg';
import Authorized from '@/utils/Authorized';
import { formatMessage } from 'umi-plugin-react/locale';
import {
  BasicLayout as BasicLayoutComponents,
  BasicLayoutProps as BasicLayoutComponentsProps,
  MenuDataItem,
  Settings,
} from '@ant-design/pro-layout';
import Link from 'umi/link';

export interface BasicLayoutProps extends BasicLayoutComponentsProps, ConnectProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};
/**
 * use Authorized check all menu item
 */

interface ServerMenu {
  name: string;
  desc: string;
  type: string;
  children: ServerMenu[];
}

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  return menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, settings, route, moreMenu, auth } = props;
  const [components, setComponents] = useState<Map<string, any>>();

  function addMoreMenu(menuItem: ServerMenu) {
    if (menuItem.children && menuItem.children.length > 0) {
      // menuItem.children.forEach(t => addMoreMenu(t));
      // 第一级菜单
      const menu = {
        path: `/${menuItem.name}`,
        name: menuItem.desc,
        routes: menuItem.children.map(item => ({
          path: `/${menuItem.name}/${item.type === 'dropbox' ? 'dropbox' : 'openreport'}/${
            item.name
          }`,
          name: item.desc,
        })),
      };
      if (
        route &&
        route.routes &&
        route.routes.filter(r => r.name === menuItem.desc).length === 0
      ) {
        //route.routes.push(menu);
        route.routes.splice(-3, 0, menu); // 为了实现在中台将设置放在最后
      }
    }
  }

  useEffect(() => {
    if (route && route.routes && moreMenu) {
      moreMenu.forEach(addMoreMenu);
      router.push(window.location.pathname + window.location.search);
    }
  }, [moreMenu]);

  useState(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
      dispatch({ type: 'global/fetchOpenReportRoutes' });
    }
  });
  if (route && route.routes && components) {
  }

  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean) =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });
  return (
    <BasicLayoutComponents
      logo={logo}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => {
        return [
          {
            path: '/',
            breadcrumbName: formatMessage({
              id: 'menu.home',
              defaultMessage: 'Home',
            }),
          },
          ...routers,
        ];
      }}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </BasicLayoutComponents>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  moreMenu: global.moreMenu,
  auth: global.auth,
  settings,
}))(BasicLayout);
