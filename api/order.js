import request from '../utils/request.js';
import { API_PREFIX } from '../config/index.js';

// 获取订单列表
export function queryOrderList(data){
  return request({
    url: `${API_PREFIX}/order/get`,
    method: 'POST',
    data
  });
}
// 获取订单详情
export function queryOrderInfo(oid,pid = 'default'){
  return request({
    url: `${API_PREFIX}/order/show/${oid}/${pid}`,
    method: 'GET'
  });
}
// 获取产品分类
export function queryProductType(){
  return request({
    url: `${API_PREFIX}/order/getConfigure`,
    method: 'POST'
  });
}
// 领取/还回耗材
export function editExpend(data){
  return request({
    url: `${API_PREFIX}/order/receive`,
    method: 'POST',
    data
  });
}
// 交接班
export function changeShifts(oid){
  return request({
    url: `${API_PREFIX}/order/changeShifts/${oid}`,
    method: 'GET'
  });
}
// 确认生产订单
export function confirmProductOrder(data){
  return request({
    url: `${API_PREFIX}/order/productionConfirm`,
    method: 'POST',
    data
  });
}
// 确认质检订单
export function confirmQualityOrder(data){
  return request({
    url: `${API_PREFIX}/order/qualityConfirm`,
    method: 'POST',
    data
  });
}
// 获取质检信息
export function queryQualityOrder(oid){
  return request({
    url: `${API_PREFIX}/order/getQualityInfo/${oid}`,
    method: 'GET'
  });
}
// 质检处理
export function qualityHandler(data){
  return request({
    url: `${API_PREFIX}/order/quality`,
    method: 'POST',
    data
  });
}
// 扫码
export function queryScanCode(oid){
  return request({
    url: `${API_PREFIX}/order/scanCode/${oid}`,
    method: 'GET'
  });
}
// 质检订单最后工序，直接入库
export function putInStorage(oid,cid){
  return request({
    url: `${API_PREFIX}/order/warehousing/${oid}/${cid}`,
    method: 'GET'
  });
}

// 质检生产结束
export function productionEnd(oid,cid){
  return request({
    url: `${API_PREFIX}/order/productionEnd/${oid}`,
    method: 'GET'
  });
}
