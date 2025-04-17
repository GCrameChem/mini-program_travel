import request from "@/utils/request";
import wechath5 from "@/utils/wechath5";
import { client } from "@/utils/tools";

//TODO小程序授权登录
export function authLogin(data) {
  return request.post("account/authLogin", data);
}
//TODO小程序静默登录
export function silentLogin(data) {
  return request.post("account/silentLogin", data);
}

//TODO更新小程序头像昵称生日地区等信息
export function updateUser(data, token) {
  return request.post("account/updateUser", data, { header: { token } });
}
//TODOapp登录
export function opLogin(data) {
  return request.post("account/uinAppLogin", { ...data, client });
}

//TODO预支付接口
export function prepay(data) {
  return request.post("payment/prepay", { ...data, order_source: client });
}

//TODO小程序订阅
export function getMnpNotice(data) {
  return request.get("subscribe/lists", {
    params: data,
  });
}

// 账号(手机和密码)登录
// export function accountLogin(data) {
//   return request.post("user/api/auth/login", { ...data, client });
// }
export function accountLogin(data) {
  return request.post("user/api/auth/login", { ...data});
}

//TODO微信配置
export function getWechatConfig() {
  return request.get("wechat/config", {
    url: encodeURIComponent(wechat.signLink()),
  });
}

// TODO微信登录
export function wechatLogin(data) {
  return request.post("account/oalogin", data);
}

// TODO获取向微信请求code的链接
export function getCodeUrl() {
  return request.get("account/codeurl", {
    params: {
      url: encodeURIComponent(location.href),
    },
  });
}

// TODO微信sdk配置
export function getJsconfig() {
  return request.get("we_chat/jsconfig", {
    params: {
      url: encodeURIComponent(wechath5.signLink()),
    },
  });
}

// TODO忘记密码
export function forgetPwd(data) {
  return request.post("login_password/forget", { ...data, client });
}

// TODO发送短信
export function sendSms(data) {
  return request.post("sms/send", { ...data, client });
}

// H5/通过手机号码注册账号
export function register(data) {
  return request.post("user", { ...data});
}

// TODO获取服务协议
export function getServerProto() {
  return request.get("policy/service");
}

// TODO获取隐私政策
export function getPrivatePolicy() {
  return request.get("policy/privacy");
}

// TODO售后保障
export function getAfterSaleGuar() {
  return request.get("policy/afterSale");
}

// TODO客服
export function getService() {
  return request.get("service/lists");
}

// TODO足迹气泡
export function getBubbleLists() {
  return request.get("footprint/lists");
}

// TODO用户自定义分享
export function userShare(params) {
  return request.get("index/share", {
    params: {
      ...params,
      client,
    },
  });
}

// TODO验证码登录
export function smsCodeLogin(data) {
  return request.post("account/smsLogin", { ...data, client });
}
export function getConfig() {
  return request.get("index/config");
}

// TODO注册赠送优惠券
export function getRegisterCoupon() {
  return request.get("coupon/registerSendCoupon");
}

// TODO获取支付配置
export function getPayway(params) {
  return request.get("payment/payway", { params });
}

// TODO获取微信小程序码-生成海报需使用
export function getShareMnQrcode(params) {
  return request.get("share/getMnQrcode", { params });
}
