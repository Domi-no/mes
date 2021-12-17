import request from '../utils/request.js';
import { API_PREFIX } from '../config/index.js';

// 账号密码
export function accountLogin(data){
  return request({
    url: `${API_PREFIX}/account/loginPwd`,
    method: 'POST',
    data
  });
}
// 微信账号快捷登录
export function wechatLogin(code){
  return request({
    url: `${API_PREFIX}/account/loginWx/${code}`,
    method: 'GET'
  });
}
// 退出
export function logout(){
  return request({
    url: `${API_PREFIX}/account/exit`,
    method: 'POST'
  });
}
// 绑定手机号
export function bindMobile(data){
  return request({
    url: `${API_PREFIX}/account/bindMobile`,
    method: 'POST',
    data
  });
}
// 查询账号信息
export function queryUserInfo(){
  return request({
    url: `${API_PREFIX}/account/show`,
    method: 'POST'
  });
}