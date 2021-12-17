/**
 * 缓存token
 * @param {Object} token
 */
export function setToken(token){
	wx.setStorageSync('token', token);
}
/**
 * 获取token
 */
export function getToken(){
	return wx.getStorageSync('token') || '';
}
/**
 * 缓存user
 * @param {Object} token
 */
export function setUser(data){
	// v2接口更改
	data.depId === 'quality' ? data.roleName = '质检人员' : data.roleName = '生产人员'
	wx.setStorageSync('user', JSON.stringify(data));
}
/**
 * 获取user
 */
export function getUser(){
	const result = wx.getStorageSync('user');
	return result ? JSON.parse(result) : {};
}
/**
 * 清除所有缓存
 */
export function clearStorage(){
	wx.clearStorageSync();
}
/**
 * 判断是否登录
 */
export function isLogin(){
	if(!getToken()){
		return wx.reLaunch({url: '/pages/authorize/index'})
	}
}