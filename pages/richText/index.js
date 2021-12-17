Page({
  data: {
    current: {}
  },
  onLoad(options){
    const current = JSON.parse(options.item);
    this.setData({ current });
    wx.setNavigationBarTitle({ title: current.title });
  }
})