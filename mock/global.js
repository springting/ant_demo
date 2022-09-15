// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/fetchmenu': {
    reports: [
      {
        name: '第一组',
        children: [
          { name: 'aaa', desc: 'AAA页', type: 'openreport' },
          { name: 'bbb', desc: 'BBB页', type: 'dropbox' },
          { name: 'ccc', desc: 'CCC页', type: 'openreport' },
        ],
      },
      {
        name: '第二组',
        children: [
          { name: 'aaa2', desc: 'AAA2页', type: 'openreport' },
          { name: 'bbb2', desc: 'BBB2页', type: 'dropbox' },
          { name: 'ccc2', desc: 'CCC2页', type: 'openreport' },
        ],
      },
    ],
  },
};
