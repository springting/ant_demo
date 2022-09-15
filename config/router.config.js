export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/login',
        name: 'login',
        component: './User/Page',
      },
    ],
  }, // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/',
        // component: './Welcome',
        component: './Data/index.jsx',
      },
      {
        path: '/:default/openreport/:reportname',
        component: './OpenReport/DataRender',
      },
      {
        path: '/:default/dropbox/:reportname',
        component: './OpenReport/DropBox',
      },
      {
        path: '/start',
        name: '首页配置',
        authority: ['developer', 'admin'],
        routes: [
          {
            path: './swiper',
            name: '顶部轮播',
            component: './Start/swiper.jsx',
          },
          {
            path: './shop',
            name: ' 项目推荐',
            component: './Start/shop.jsx',
          },
          {
            path: './brand',
            name: ' 品牌推荐',
            component: './Start/brand.jsx',
          },
        ],
      },
      {
        path: '/company',
        name: '集团',
        authority: ['developer', 'admin'],
        routes: [
          {
            path: './list',
            name: '集团列表',
            component: './Company/index.jsx',
          },
        ],
      },
      {
        path: '/shop',
        name: '门店',
        authority: ['developer', 'shop', 'company','admin'],
        routes: [
          {
            path: './list',
            name: '门店列表',
            component: './Shops/list.jsx',
          },
          {
            path: './location',
            name: ' 店铺落位',
            component: './Shops/location.jsx',
          },
          {
            path: './check',
            component: './Shops/check.jsx',
          },
        ],
      },
      {
        path: '/brand',
        name: '品牌',
        authority: ['developer', 'brand','admin'],
        routes: [
          {
            path: './list',
            name: '品牌列表',
            component: './Brands/index.jsx',
          },
        ],
      },
      {
        path: '/setting',
        name: '设置',
        routes: [
          {
            path: './authority',
            name: '权限管理',
            component: './Settings/Authority/index.jsx',
          },
          {
            path: './category',
            name: '品类管理',
            authority: ['developer', 'admin'],
            component: './Settings/Category/index.jsx',
          },
          {
            path: './aboutus',
            name: '关于我们',
            authority: ['developer', 'admin'],
            component: './Settings/Regex/aboutUs.jsx',
          },
          {
            path: './service',
            name: '服务管家',
            authority: ['developer', 'admin'],
            component: './Settings/Regex/Service.jsx',
          },
          {
            path: './seats',
            name: '峰会座位',
            authority: ['developer', 'admin'],
            component: './Settings/Regex/Seats.jsx',
          },
        ],
      },
    ],
  },
];
