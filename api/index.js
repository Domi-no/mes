import request from '../utils/request.js';
import { API_PREFIX } from '../config/index.js';

// 获取统计数据
export function queryAllNumbers(){
  return request({
    url: `${API_PREFIX}/order/getStatistics`,
    method: 'POST'
  });
}
// 获取待处理订单
export function queryWaitingOrders(current, size){
  return request({
    url: `${API_PREFIX}/order/pending/${current}/${size}`,
    method: 'GET'
  });
}
// 获取消息通知列表
export function queryNewsList(current, size){
  return request({
    url: `${API_PREFIX}/news/get/${current}/${size}`,
    method: 'GET'
  });
}