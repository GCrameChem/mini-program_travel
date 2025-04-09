export default {
  userInfo: state => state.app.userInfo || {},
  token: state => state.app.token,
  // SKIP:测试时不使用登录跳转逻辑，需要的参数在当页data中临时确定
  isLogin: state => !!state.app.token,
  cartNum: state => state.app.cartNum,
  inviteCode: state => state.app.userInfo.distribution_code || "",
  appConfig: state => state.app.config
};
