import {
  getToken,
  getUser,
  isLogin
} from '../../utils/auth';
Page({
  data: {
    userInfo: {},
    icons: [{
        id: 1,
        icon: '/assets/image/information.png',
        msg: '基础信息',
        url: '/pages/userInfo/userInfo'
      },
      {
        id: 2,
        icon: '/assets/image/order.png',
        msg: '订单列表',
        url: '/pages/order/order'
      }
    ],
    icons2: [/* {
        id: 3,
        icon: '/assets/image/warn.png',
        msg: '帮助中心',
        url: '/pages/help/help'
      }, */
      {
        id: 4,
        icon: '/assets/image/setting.png',
        msg: '设置',
        url: '/pages/setting/setting'
      }
    ]
  },
  onLoad() {
    if (!getToken()) {
      isLogin();
    } else {
      this.setData({ userInfo: getUser() });
    }
  },
  //跳转
  goInfo(e) {
    let { url } = e.currentTarget.dataset.item;
    wx.navigateTo({ url });
  },
})
