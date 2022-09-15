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
    path: '/contracts/margin/printMargin/:maginId',
    component: './contract/Margin/PrintMargin',
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/',
        component: './Welcome',
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
        path: '/notices',
        //name: '通知管理',
        component: './Notice/Page.jsx',
        //authority: ['developer', 'maintainer'],
      },
      {
        path: '/good',
        name: '商品',
        authority: ['developer'],
        routes: [
          {
            path: './stock',
            // name: '批量上传',
            component: './WareHouse/StockUp.jsx',
          },
          {
            path: './cfgStockXls',
            component: './WareHouse/cfgStock.jsx',
          },
          {
            path: './mkStockXls',
            component: './WareHouse/mkStock.jsx',
          },
          {
            path: './addMainXls',
            component: './WareHouse/addMainXls.jsx',
          },
          {
            path: './checkMainXls',
            component: './WareHouse/checkMainXls.jsx',
          },
          {
            path: './one',
            //name: '单个上传',
            component: './Welcome',
          },
          {
            path: './bill',
            name: '订单列表',
            component: './WareHouse/billTable.jsx',
          },
          {
            path: './item',
            component: './WareHouse/itemTable.jsx',
          },
          {
            path: './editd',
            component: './WareHouse/editTable.jsx',
          },
          {
            path: '../test/openreport/PP_rate',
            name: '导入效果',
            component: './OpenReport/DataRender',
          },
          {
            path: '../test/openreport/digitization',
            name: '数字化看板',
            component: './OpenReport/DataRender',
          },
        ],
      },
      {
        path: '/stock',
        // name: '库存',
        authority: ['developer', 'mall'],
        routes: [
          {
            path: './transfer',
            name: '调拨',
            component: './Welcome',
          },
          {
            path: './inventory',
            name: '盘点',
            component: './Welcome',
          },
          {
            path: './other',
            name: '其他',
            component: './Welcome',
          },
        ],
      },
      {
        path: '/order',
        // name: '订单',
        authority: ['developer', 'mall', 'supply'],
        routes: [
          {
            path: './manage',
            name: '订单管理',
            component: './orderManagement/Page.jsx',
          },
        ],
      },
      {
        path: '/marketing',
        // name: '营销',
        routes: [
          {
            path: './promotion',
            name: '活动',
            authority: ['developer', 'mall'],
            routes: [
              {
                path: '../../test/dropbox/add_promotion',
                name: '添加促销活动',
                component: './OpenReport/DropBox',
              },
              {
                path: '../../test/dropbox/add_prom_condition',
                name: '添加活动条件',
                component: './OpenReport/DropBox',
              },
            ],
          },
          {
            path: './coupon',
            name: '优惠券',
            authority: ['developer', 'mall'],
            routes: [
              {
                path: '../../test/dropbox/insert_Coupons',
                name: '添加优惠券',
                component: './OpenReport/DropBox',
              },
            ],
          },
          {
            path: './submit',
            name: '活动提报',
            authority: ['developer', 'supply'],
            component: './Welcome',
          },
        ],
      },
      {
        path: '/setting',
        name: '设置',
        authority: ['developer', 'mall'],
        routes: [
          {
            path: './supplies',
            name: '供应商管理',
            component: './Supply/Page.jsx',
          },
          {
            path: './template',
            name: '规则引擎',
            routes: [
              {
                path: './list',
                name: '模板规则',
                component: './Template/TemplateList.jsx',
              }, // 上传示例数据
              {
                path: './edit',
                component: './Template/Page.jsx',
              }, //上传内容展示
              {
                path: './upData',
                component: './Template/UpData.jsx',
              }, //模板表单
              {
                path: './form',
                component: './Template/TemplateForm.jsx',
              },
              {
                path: './titleRegex',
                name: '标题规则',
                component: './Template/TitleRegex',
              },
              {
                path: './category',
                name: '品类和标签模板',
                component: './WareHouse/CategoryOrTags.jsx',
              },
            ],
          },
          {
            path: './authority',
            // name: '权限管理',
            authority: ['developer', 'mall', 'supply'],
            component: './Welcome',
          },
          {
            path: './contracts',
            // name: '合同管理',
            routes: [
              {
                path: './list',
                name: '合同列表',
                component: './contract/ContractList',
              },
              {
                path: './list_expired',
                name: '过期合同',
                component: './contract/ContractList/expired.js',
              },
              {
                path: './margin',
                name: '费用管理',
                component: './contract/Margin',
              },
            ],
          },
          {
            path: './pos',
            // name: 'POS设置',
            component: './Welcome',
          },
          {
            path: './cooperate',
            // name: '协同',
            component: './Welcome',
          },
        ],
      },
      {
        path: '/MP',
        name: '云通MP',
        authority: ['developer'],
        routes: [
          {
            path: './bss',
            name: '品牌资源库',
            component: './YuntongMP/brandSourceStore.jsx',
          },
          {
            path: './source',
            name: '矿机配置',
            component: './YuntongMP/sources/index.jsx',
          },
          {
            path: './entry',
            name: '种子列表',
            component: './YuntongMP/entries/index.jsx',
          },
          {
            path: './good',
            name: '抓图列表',
            component: './YuntongMP/goods/index.jsx',
          },
          {
            path: './reports',
            name: '图片池报表',
            component: './YuntongMP/reports/index.jsx',
          },
          {
            path: './rpa_config',
            // name: '抓图队列配置',
            component: './YuntongMP/rpaConfig.jsx',
          },
          {
            path: './train',
            name: '人工标注',
            component: './YuntongMP/textMark.jsx',
          },
        ],
      },
      {
        path: '/xiaohulu',
        name: '小葫芦',
        authority: ['developer'],
        routes: [
          {
            path: './chart',
            name: '图表配置',
            component: './XiaoHuLu/chart.jsx',
          },
          {
            path: './chartDetail',
            component: './XiaoHuLu/chart/index.jsx',
          },
          {
            path: './page',
            name: '页面配置',
            component: './XiaoHuLu/page.jsx',
          },
          {
            path: './pageDetail',
            component: './XiaoHuLu/page/index.jsx',
          },
          {
            path: './openreport',
            name: 'repo',
            component: './XiaoHuLu/openreport/index.jsx',
          },
        ],
      },
    ],
  },
];
