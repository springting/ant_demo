// 商户查询
function supplyList(req, res) {
  const result = {
    err: 0,
    data: [
      {
        id: 1,
        name: '某某供应商1',
        performanceBond: 0, // 履约保证金录入情况，0是未录入，1是已录入
        rentMargin: 0, // 租赁商户保证金
        posMargin: 0, // pos押金
        cardMargin: 0, // 工牌押金
        renovationMargin: 0, // 装修押金
      },
      {
        id: 2,
        name: '某某供应商2',
        performanceBond: 0, // 履约保证金录入情况，0是未录入，1是已录入
        rentMargin: 0, // 租赁商户保证金
        posMargin: 0, // pos押金
        cardMargin: 0, // 工牌押金
        renovationMargin: 0, // 装修押金
      },
    ],
  };
  return res.json(result);
}

// 押金查询
function marginList(req, res) {
  const result = {
    err: 0,
    data: [
      {
        id: 1,
        type: 'performance', // 保证金类型， performance、
        amount: 200000, // 以分为单位
        supply_id: 1, // 商户id
        supply_name: '某某供应端1', // 商户名字
        area: 'D-13,B-1', // 柜组号
        create_at: '2019-08-15', // 日期
        code: 'W2349320534', // 编号
      },
      {
        id: 2,
        type: 'performance', // 保证金类型， performance、
        amount: 300000, // 以分为单位
        supply_id: 2, // 商户id
        supply_name: '某某供应端2', // 商户名字
        area: '1-D-3,2-B-5', // 柜组号
        create_at: '2019-08-15', // 日期
        code: 'W992372322', // 编号
      },
    ],
  };
  return res.json(result);
}

export default {
  'GET /api/supply_list': supplyList,
  'GET /api/margin_list': marginList,
};
