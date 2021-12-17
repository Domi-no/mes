import {
  getToken,
  getUser,
  isLogin
} from '../../utils/auth';
import {
  queryScanCode,
} from '../../api/order';
import {
  queryAllNumbers,
  queryWaitingOrders
} from '../../api/index';
Page({
  data: {
    userinfo: {},
    headerHeight: 0,
    orders: [],
    productor: {
      monthAualified: 0, //本月成品数
      monthOrder: 0, //本月参与订单数
      monthUnqualified: 0, //本月废品数
      todayAualified: 0, //今日成品数
      todayUnqualified: 0, //今日废品数
      unreadNmber: 0 //未读消息数量
    },
    inspector: {
      todayQuality: 0, //今日质检数
      monthQuality: 0, //本月质检数
      monthOrder: 0, //本月参与订单数
      unreadNmber: 0 //未读消息数量
    },
    pageNum: 1,
    pageSize: 5
  },
  async onShow(){
    this.setData({userinfo: getUser()});
    if(getToken()){
      await this._queryAllNumbers();
      await this._queryWaitingOrders();
    }
  },
  async onLoad(){
    wx.getSystemInfo({
      success: (result) => {
        this.setData({
          headerHeight: result.statusBarHeight + 44
        })
      }
    });
  },
  // 获取统计数据
  async _queryAllNumbers(){
    const { roleId } = this.data.userinfo;
    const { data } = await queryAllNumbers();
    const key = roleId === 'production' ? 'productor' : 'inspector';
    this.setData({ [key]: data })
  },
  // 获取待处理订单
  async _queryWaitingOrders(){
    const { pageNum, pageSize } = this.data;
    const { data } = await queryWaitingOrders(pageNum, pageSize);
    this.setData({ orders: data });
  },
  // 获取扫码结果
  async handleScanner(){
    isLogin();
    const { result } = await wx.scanCode({ scanType: 'qrCode' });
    if(result){
      wx.showLoading({ title: '正在处理扫码结果'});
      const { data } = await queryScanCode(result);
      wx.hideLoading();
      wx.navigateTo({
        url: `/pages/orderInfo/index?oid=${result}&scanner=${JSON.stringify(data)}`
      });
    } else {
      wx.showToast({ title: '扫码失败', icon: 'none'});
    }
  },
  // 跳转订单详情
  gotoOrderInfo(e){
    const { oid } = e.currentTarget.dataset;
    isLogin();
    wx.navigateTo({url: `/pages/orderInfo/index?oid=${oid}`})
  },
  // 跳转订单列表
  gotoOrderList(){
    isLogin();
    wx.navigateTo({ url: `/pages/order/order?sStatus=${1}` });
  },
  // 跳转消息列表
  gotoMessage(){
    isLogin();
    wx.navigateTo({ url: '/pages/message/index' });
  }
})
