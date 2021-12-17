import {
  queryOrderList,
  queryProductType
} from '../../api/order.js';

Page({
  data: {
    pageNum: 1, // 当前页数
    pageSize: 10, //默认一页显示多少条
    hasMore: true, //默认上拉还有更多
    loadeMore: false, //默认不进行上拉加载
    orders: [], // 全部订单
    ostatus: [
      { text: '待处理', value: 1 },
      { text: '生产中', value: 2 },
      { text: '待质检', value: 3 },
      { text: '质检中', value: 4 },
      { text: '已结束', value: 5 }
    ],
    ptypes: [], // 产品分类
    sStatus: '', // 选中订单状态
    sType: '', // 选中产品分类
    search: '' // 搜索内容
  },
  async onLoad(options){
    let sStatus = options.sStatus;
    if(sStatus){
      this.setData({ sStatus: Number(sStatus)})
    }
    await this._queryProductType();
    await this._queryOrderList();
  },
  onReachBottom(){
    this.setData({ loadeMore: true});
    if(this.data.hasMore){
      this._queryOrderList();
    }else{
      wx.showToast({title: '暂无更多', icon: 'none'});
    }
  },
  // 获取订单列表
  async _queryOrderList(){
    wx.showLoading({title: '加载中…'});
    let {
      pageNum,
      pageSize: size,
      loadeMore,
      orders,
      search: content,
      sStatus: productionStatus,
      sType: proSort
    } = this.data;
    const doc = {
      productionStatus,
      content,
      proSort,
      current: loadeMore ? pageNum + 1 : pageNum,
      size
    }
    const { data } = await queryOrderList(doc);
    this.setData({
      hasMore: data.length !== 0,
      orders: [...orders, ...data],
      pageNum: doc.current
    })
    wx.hideLoading();
  },
  // 获取产品分类
  async _queryProductType(){
    const { data } = await queryProductType();
    const ptypes = data.map( item => {
      return {
        text: item.conName,
        value: item.conId
      }
    });
    this.setData({ ptypes })
  },
  // 输入生成订单id或产品名称进行检索
  handleSearch(e){
    this.setData({
      orders: [],
      sType: '',
      sStatus: '',
      search: e.detail
    });
    this._queryOrderList();
  },
  // 选择订单状态
  changeOStatus(e){
    this.setData({
      orders: [],
      sStatus: e.detail
    });
    this._queryOrderList();
  },
  // 选择产品分类
  changePType(e){
    this.setData({
      orders: [],
      sType: e.detail
    });
    this._queryOrderList();
  },
  // 跳转订单详情
  gotoOrderInfo(e){
    const { oid } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/orderInfo/index?oid=${oid}`
    });
  }
})