App({
  onLaunch() {
    this.autoUpdate();
  },
  globalData: {},
  autoUpdate: function (){
    if(wx.canIUse('getUpdateManager')){
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(res => {
        if(res.hasUpdate){
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好了，请您退出微信后台重启应用？',
              showCancel: false,
              confirmText: '退出重启',
              success: action => {
                if(action.confirm){
                  updateManager.applyUpdate();
                }
              }
            })
          });
          updateManager.onUpdateFailed(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本下载失败，请你删除当前小程序，重新搜索打开。'
            });
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新版本微信后重试。'
      });
    }
  }
})
