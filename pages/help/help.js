const icon = '/assets/image/arrow-right-.png';
Page({
  data: {
    navs: [
      { title: '小程序功能介绍'},
      { title: '使用说明'},
      { title: '关于我们'}
    ]
  },
  handleItem(e){
    const { index } = e.currentTarget.dataset;
    const item = this.data.navs[index];
    wx.navigateTo({
      url: `/pages/richText/index?item=${JSON.stringify(item)}`,
    })
  }
})