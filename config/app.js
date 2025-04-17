// 开发者环境：开|关	【注：方便微信小程序发行测试】
const SWITCH_DEVELOPMENT = true

/** S 是否H5端 **/
// #ifdef H5
const IS_H5 = true
// #endif

// #ifndef H5
const IS_H5 = false
// #endif
/** E 是否H5端 **/

/** S API BaseURL **/
const baseURLMap = {
    // 开发环境
	// 服务器
	// development: 'http://118.24.44.124',
	
	// 团队apifox接口环境
    development: 'http://127.0.0.1:4523/m1/6057514-5747647-default',
	
	// 临时apifox测试环境1
	//development: 'http://127.0.0.1:4523/m1/6191757-5884297-default',
	
	// 源码docker环境
	// development: 'http://127.0.0.1:20208',
    // 生产环境https://php-b2c.likeshop.cn
    production: IS_H5 ? location.origin : ''
}

const baseURL = SWITCH_DEVELOPMENT ? baseURLMap['development'] : baseURLMap[process.env.NODE_ENV]
/** E API BaseURL **/

//////// 仅测试使用，发布时需要注释 ////////
wx.addInterceptor('request', {
  invoke(args) {
    // 添加全局头
    args.headers = {
      'Content-Type': 'application/json',
      'X-Request-From': 'WeChat-MiniProgram',
      ...args.headers
    };
    console.log('拦截器 - 请求发出:', args);
    return args;
  },
  success(res) {
    console.log('拦截器 - 响应成功:', res);
    return res;
  },
  fail(err) {
    console.error('拦截器 - 请求失败:', err);
    return err;
  }
});

///////////////////////////////////////

module.exports = {
    version: '3.0.3', // 版本号
    baseURL, // API Base URL
    basePath: '/mobile'
}