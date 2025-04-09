import axios from "../js_sdk/xtshadow-axios/axios.min";
import store from "../store";
import { paramsToStr, currentPage, tabbarList, acountList } from "./tools";
import Cache from "./cache";
import { TOKEN, BACK_URL } from "../config/cachekey";
import { baseURL } from "../config/app";
import { getWxCode, toLogin, wxMnpLogin } from "./login";

let index = 0;

function checkParams(params) {
  if (typeof params != "object") return params;
  for (let key in params) {
    const value = params[key];
    if (value === null || value === undefined || value === "") {
      delete params[key];
    }
  }
  return params;
}

const service = axios.create({
  baseURL: `${baseURL}/`,
  timeout: 10000,
  header: {
    "content-type": "application/json",
  },
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    config.data = checkParams(config.data);
    config.params = checkParams(config.params);
    if (config.method == "GET") {
      config.url += paramsToStr(config.params);
    }
	const token = Cache.get(TOKEN);
	//console.log("拦截器获取 token：", token);

    config.header.token = config.header.token || Cache.get(TOKEN);
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  async (response) => {
    if (response.data) {
      // 1. 保护性拷贝数据（仅新增此行）
      const responseData = JSON.parse(JSON.stringify(response.data));
      //console.log("request.js",responseData);
      const { code, show, msg } = responseData;  // 改为使用拷贝后的数据
      const { route, options } = currentPage();
      
      if (code == 0 && show && msg) {
        uni.showToast({
          title: msg,
          icon: "none",
        });
      } else if (code == -1) {  // 2. 修正条件：code == -1时触发登出
		console.log("修正:");
        store.commit("LOGOUT");
        //#ifdef MP-WEIXIN
        wxMnpLogin();
        // #endif
        //#ifdef H5 || APP-PLUS
        if (route && !tabbarList.includes(route)) {
          toLogin();
        }
        // #endif
        //#ifdef H5
        if (!acountList.includes(route)) {
          Cache.set(BACK_URL, `/${route}${paramsToStr(options)}`);
        }
        // #endif
      }
    }
    // 3. 返回拷贝后的数据
	//console.log("response.data:",response.data);
    return Promise.resolve(JSON.parse(JSON.stringify(response.data || {})));
  },
  (error) => {
    //console.log(error);
    console.log("err" + error);
    return Promise.reject(error);
  }
);


export default service;