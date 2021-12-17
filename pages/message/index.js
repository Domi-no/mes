import { queryNewsList } from '../../api/index';
Page({
  data: {
    pageNum: 1,
    pageSize: 10,
    hasMore: true, //默认上拉还有更多
    loadeMore: false, //默认不进行上拉加载
    messages: []
  },
  async onLoad(){
    await this._queryNewsList();
  },
  onReachBottom(){
    this.setData({ loadeMore: true});
    if(this.data.hasMore){
      this._queryNewsList();
    }else{
      wx.showToast({title: '暂无更多', icon: 'none'});
    }
  },
  // 获取消息列表
  async _queryNewsList(){
    wx.showLoading({title: '加载中…'});
    let { pageNum, pageSize: size, loadeMore, messages } = this.data;
    const current = loadeMore ? pageNum + 1 : pageNum;
    const { data } = await queryNewsList(current, size);
    this.setData({
      hasMore: data.length !== 0,
      messages: [...messages, ...data]
    })
    wx.hideLoading();
  },
  // 跳转订单详情
  gotoOrderInfo(e){
    const { productionOrderId: oid } = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/orderInfo/index?oid=${oid}`
    }) 
  }
})