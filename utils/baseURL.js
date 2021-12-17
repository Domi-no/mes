// 接口请求基础地址
let baseURL = '';

switch(__wxConfig.envVersion){
  case 'develop': // 开发版
    baseURL = 'http://106.14.219.40';
    // baseURL = 'http://47.98.120.134:80';
    break;
  case 'trial': // 体验版
    baseURL = '';
    break;
  case 'release': // 正式版
    baseURL = '';
    break;
  default:
}

export default baseURL;