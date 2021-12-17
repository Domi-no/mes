const toString = Object.prototype.toString;
const is = (val, type) => toString.call(val) === `[object ${type}]`;

/**
 * 节流
 * @param {*} fn 
 * @param {*} wait 
 * @returns 
 */
export function throttle(fn, wait = 500) {
  let flag = true;
  return function () {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      flag = true;
    }, wait);
  }
}

/**
 * 防抖
 * @param {*} fn 
 * @param {*} wait 
 * @returns 
 */
export function debounce(fn, wait = 500) {
  let timeout = null;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  }
}

/**
 * 校验手机号是否合法
 * @param {*} val
 */
export function isMobile(val){
  const reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  return reg.test(val);
}

/**
 * 判断是否是字符串
 * @param {*} val 
 */
export function isString(val){
  return is(val, 'String');
}