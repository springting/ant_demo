const companyConfig = {
  'ant.vongcloud.com': {
    COMPANY_ID: 471000,
    COMPANY_NAME: '洛阳新都汇',
    COMPANY_FULLNAME: '',
    TAX_INFO: [],
    BEIAN: '京ICP备15022048号-3',
  },
  'ant.lyxdh.cn': {
    COMPANY_ID: 471000,
    COMPANY_NAME: '洛阳新都汇',
    COMPANY_FULLNAME: '',
    TAX_INFO: [],
    BEIAN: '豫ICP备18043449号-1',
  },
  'www.lyxdh.cn': {
    COMPANY_ID: 471000,
    COMPANY_NAME: '洛阳新都汇',
    COMPANY_FULLNAME: '',
    TAX_INFO: [],
    BEIAN: '豫ICP备18043449号-1',
  },
  'ant-ltc.vongcloud.com': {
    COMPANY_ID: 310001,
    COMPANY_NAME: '乐天城',
    COMPANY_FULLNAME: '杭州乐尚商业管理有限公司',
    TAX_INFO: [
      '91330110MA2GNLH49W',
      '浙江省杭州市余杭区五常街道西溪乐天城6幢229室',
      '0571-88730990',
      '余杭农村商业银行五常支行',
      '201000226471130',
    ],
    BEIAN: '京ICP备15022048号-3',
  },
  'ant.path-analytics.com': {
    COMPANY_ID: 100001,
    COMPANY_NAME: 'B.P.MAXX',
    COMPANY_FULLNAME: '北京京洋奥特菲克商业发展有限公司',
    TAX_INFO: ['91330110MA2GNLH49W', '北京市丰台区大红门西路19号2层F271 ', '010-67274721', '', ''],
    BEIAN: '京ICP备15022048号-1',
  },
  'runshang.vongcloud.com': {
    COMPANY_ID: 310000,
    COMPANY_NAME: 'A.T.MAXX',
    COMPANY_FULLNAME: '杭州润上商业发展有限公司',
    TAX_INFO: [
      '913301010920380132',
      '杭州经济技术开发区4号大街505号二楼271室 ',
      '0571-86057560',
      '中国农业银行杭州下沙支行',
      '19033101040013960',
    ],
    BEIAN: '京ICP备15022048号-3',
  },
  'atm-ant.vongcloud.com': {
    COMPANY_ID: 100001,
    COMPANY_NAME: 'A.T.MALL',
    COMPANY_FULLNAME: '北京爱特茂商业发展有限公司',
    TAX_INFO: ['91110107MA01GJ8X8G', '北京市石景山区实兴东街11号2层2349室 '],
    BEIAN: '京ICP备15022048号-3',
  },
  localhost1: {
    COMPANY_ID: 999999,
    COMPANY_NAME: '内部测试',
    COMPANY_FULLNAME: '内部测试',
    TAX_INFO: ['11111', '222222 ', '0571-333333', '444444', '555555'],
    BEIAN: '我是备案号',
  },
  'test.path-analytics.com': {
    COMPANY_ID: 999999,
    COMPANY_NAME: '内部测试',
    COMPANY_FULLNAME: '内部测试',
    TAX_INFO: ['11111', '222222 ', '0571-333333', '444444', '555555'],
    BEIAN: '我是备案号',
  },
  'youzan-erp.vongcloud.com': {
    COMPANY_ID: 888888,
    COMPANY_NAME: '蜂眼',
    COMPANY_FULLNAME: '蜂眼',
    TAX_INFO: ['11111', '222222 ', '0571-333333', '444444', '555555'],
    BEIAN: '京ICP备15022048号-3',
  },
};
const defaultCompany = companyConfig['youzan-erp.vongcloud.com'];

const COMPANY = companyConfig[window.location.hostname] || defaultCompany;

export const settleMode = {
  LY: '联营',
  ZY: '自营',
  ZL: '租赁',
  DJJS: '底价寄售',
  FCJS: '分成寄售',
};

export const { COMPANY_ID, COMPANY_NAME, COMPANY_FULLNAME, TAX_INFO, BEIAN } = COMPANY;
