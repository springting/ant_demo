/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = path => {
  return reg.test(path);
};

/**
 * @param {*} s 字符串
 */
export function paddingStr(s) {
  const sStr = s.toString();
  return sStr.length === 1 ? `0${sStr}` : sStr;
}
export const currentDate = () => {
  const time = new Date();
  const month = paddingStr(time.getMonth() + 1);
  const date = paddingStr(time.getDate());
  const year = paddingStr(time.getFullYear());
  const hour = paddingStr(time.getHours());
  const min = paddingStr(time.getMinutes());
  const second = paddingStr(time.getSeconds());
  return `${year}-${month}-${date} ${hour}:${min}:${second}`;
};

// 根据时间戳返回当前日期
export const formatDate = s => {
  const time = s ? new Date(s * 1000) : new Date();
  const month = paddingStr(time.getMonth() + 1);
  const date = paddingStr(time.getDate());
  const year = paddingStr(time.getFullYear());
  // const hour = paddingStr(time.getHours());
  // const min = paddingStr(time.getMinutes());
  // const second = paddingStr(time.getSeconds());
  return `${year}-${month}-${date}`;
};

const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

export function table2list(data) {
  // 传入table型data（必有td和th字段)，转换为json格式kv对象的列表
  const { th, td } = data;
  return td.map(row => {
    const d = {};
    th.forEach((k, i) => {
      d[k] = row[i];
    });
    return d;
  });
}

export function isEmpty(obj) {
  return obj === undefined || obj === null || obj === '' || obj === 'undefined' || obj === 'null';
}

export function loadLocalJson(key) {
  const s = localStorage.getItem(key);
  return s ? JSON.parse(s) : undefined;
}

export { isAntDesignProOrDev, isAntDesignPro, isUrl };
