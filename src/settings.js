const companyConfig = {
  localhost: {
    COMPANY_ID: 111111,
    COMPANY_FULLNAME: '',
    TAX_INFO: [],
    COMPANY_NAME: '奥莱地图',
    BEIAN: '粤ICP备10227591号-5',
  },
  'youzan-erp.vongcloud.com': {
    COMPANY_ID: 888888,
    COMPANY_NAME: '有赞',
    COMPANY_FULLNAME: '有赞',
    TAX_INFO: ['11111', '222222 ', '0571-333333', '444444', '555555'],
    BEIAN: '京ICP备15022048号-3',
  },
  'outletsmap.vongcloud.com': {
    COMPANY_ID: 111111,
    COMPANY_FULLNAME: '',
    TAX_INFO: [],
    COMPANY_NAME: '奥莱地图',
    BEIAN: '粤ICP备10227591号-5',
  },
};
const defaultCompany = companyConfig['outletsmap.vongcloud.com'];

const COMPANY = companyConfig[window.location.hostname] || defaultCompany;

export const settleMode = {
  LY: '联营',
  ZY: '自营',
  ZL: '租赁',
  DJJS: '底价寄售',
  FCJS: '分成寄售',
};

export const { COMPANY_ID, COMPANY_NAME, COMPANY_FULLNAME, TAX_INFO, BEIAN } = COMPANY;
