import baseURL from './baseURL.js';
import { getToken, clearStorage } from './auth';

/**
 * 基于Promise二次封装wx.request()请求
 * @param {*} options 
 */
const request = (options) => {
  const { url, method, data = {} } = options;
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + url,
      method,
      data,
      header: {
        'content-type': 'application/json;charset=UTF-8',
        'X-Request-Token': getToken()
      },
      success: res => {
        const { statusCode, data } = res;
        if(statusCode !== 200){
          return wx.showToast({title: '服务器出现异常，请稍后再试', icon: 'none'});
        }
        const { code, msg } = data;
        switch(parseInt(code)){
          case 4000:
            wx.showToast({title: msg || '参数错误', icon: 'none'});
            break;
          case 4500:
            wx.showToast({title: msg || '服务器出现异常，请稍后再试', icon: 'none'});
            break;
          case 4501:
            modalFunc('您的账号在其他地方登录或登录已过期，请您重新登录!', '重新登录');
            break;
          case 4502:
            modalFunc('为避免正常功能使用，请您先授权登录！', '授权登录');
            break;
          case 0:
            resolve(data);
            break;
          default:
            break;
        }
      },
      fail: err => {
        wx.showToast({icon: 'none', title: '数据接口请求异常或请求超时'});
        reject(err);
      }
    })
  })
}

function modalFunc(content, confirmText){
  wx.showModal({
    title: '系统提示',
    content,
    showCancel: false,
    confirmText,
    success: action => {
      if (action.confirm) {
        clearStorage();
        wx.reLaunch({url: '/pages/authorize/index'});
      }
    }
  });
}

export default request;