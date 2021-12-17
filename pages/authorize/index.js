import {
  wechatLogin,
  accountLogin,
  bindMobile
} from '../../api/user.js';
import {
  isMobile,
  isString
} from '../../utils/index.js';
import {
  setToken,
  setUser
} from '../../utils/auth.js'
Page({
  data: {
    loginMobile: '',
    loginPwd: '',
    isHiddenForm: true,
    isShowBindMobile: false,
    mobile: '',
    openId: ''
  },
  async handleWXLogin(){
    wx.showLoading({ title: '正在登录中……'});
    const { code } = await wx.login();
    const { data } = await wechatLogin(code);
    if(isString(data.info)){ // 如果data.info是一个字符串，则是openid，需要手动绑定手机号
      this.setData({openId: data.info});
      this.showBindMobile();
    }else{ //否则，已经手动绑定过了，可直接获取登录信息
      setToken(data.info.token);
      setUser(data.info);
      wx.reLaunch({ url: '/pages/index/index' });
    }
    wx.hideLoading();
  },
  // 绑定手机号
  async handleBindMobile(){
    const { mobile, openId } = this.data;
    if(!mobile){
      return wx.showToast({ title: '请输入绑定的手机号', icon: 'none' })
    }
    if(!isMobile(mobile)){
      return wx.showToast({ title: '请输入有效手机号码', icon: 'none' })
    }
    wx.showLoading({title: '正在绑定手机号……'});
    const doc = {
      loginWechatOpenId: openId,
      bindMobile: mobile
    }
    const { data } = await bindMobile(doc);
    wx.showToast({ title: '绑定成功', icon: 'success'});
    setToken(data.token);
    setUser(data);
    wx.hideLoading();
    wx.reLaunch({ url: '/pages/index/index' });
  },
  // 点击账号密码登录
  async handleAccountLogin(){
    const { loginMobile, loginPwd } = this.data;
    if(!loginMobile){
      return wx.showToast({ title: '请输入绑定的手机号', icon: 'none' })
    }
    if(!isMobile(loginMobile)){
      return wx.showToast({ title: '请输入有效手机号码', icon: 'none' })
    }
    wx.showLoading({title: '正在登录中……'});
    const { data }= await accountLogin({ loginMobile, loginPwd });
    setToken(data.token);
    setUser(data);
    wx.hideLoading();
    wx.reLaunch({ url: '/pages/index/index' });
  },
  // 切换登录方式
  switchForm(e){
    const { key } = e.currentTarget.dataset;
    this.setData({ 
      isHiddenForm: key !== '1',
      loginMobile: '',
      loginPwd: ''
    });
  },
  // 绑定手机号弹窗
  showBindMobile(){
    this.setData({
      isShowBindMobile: !this.data.isShowBindMobile,
      bindMobile: ''
    })
  },
  // 输入框双向绑定
  handleInputChange(e){
    const filed = e.currentTarget.dataset.filed;
    const value = e.detail.value;
    this.setData({ [filed]: value })
  }
})
