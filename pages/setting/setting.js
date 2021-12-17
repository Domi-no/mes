import { clearStorage } from '../../utils/auth';
import { logout } from '../../api/user.js';
Page({
  data: {
    cache: '0KB'
  },
  onLoad(){
    const { currentSize } = wx.getStorageInfoSync('user');
    const cache = currentSize < 1024
      ?
        `${currentSize}KB`
      :
        `${(currentSize / 1024).toFixed(2)}M`;
    this.setData({ cache });
  },
  // 退出登录
  handleLogout(){
    wx.showModal({
      content: '确定退出当前登录账号吗？',
      success: async (action) => {
        if(action.confirm){
          await logout();
          clearStorage();
          wx.reLaunch({ url: '/pages/authorize/index'})
        }
      }
    })
  },
  handleClear(){
    wx.showLoading({title: '正在清除……'});
    setTimeout(() => {
      this.setData({ cache: '0KB'});
    }, 1500);
    wx.hideLoading();
    wx.showToast({
      title: '清除成功',
      icon: 'success'
    });
  }
})