import request from "@/utils/request";
import { client } from "@/utils/tools";

// TODO下单
export function orderBuy(data) {
  return request.post("orders", data);
}

// 删除订单
export function delOrder(data) {
	const { orderId, ...restParams } = data;
  return request.delete(`orders/${orderId}`, {
    params: restParams
  });
}

// 获取订单列表
export function getOrderList(data) {
  return request.get("orders/list", {
    params: data,
  });
}

// TODO订单详情
export function getOrderDetail(id) {
  return request.get("order/detail", {
    params: {
      id,
    },
  });
}

// 取消订单
export function cancelOrder(data) {
    const { orderId, ...restParams } = data;
    return request.put(`orders/${orderId}`, restParams);  // 把数据放在请求体中
}


// 确认收货
export function confirmOrder(data) {
	const { orderId, ...restParams } = data;
	return request.put(`orders/${orderId}`, restParams);
}


// ？？获取配送方式
export function getDelivery() {
  return request.get("order/getDeliveryType");
}

// ？？物流
export function orderTraces(id) {
  return request.get("order/orderTraces", {
    params: {
      id,
    },
  });
}


// ?下单获取优惠券
export function getOrderCoupon(data) {
  return request.post("coupon/orderCoupon", data);
}

// ？？核销订单
export function getVerifyLists(data) {
  return request.get("order/verificationLists", {
    params: data,
  });
}
// ？？核销详情
export function verification(data) {
  return request.post("order/verification", data);
}

// ？？确认核销
export function verificationConfirm(data) {
  return request.post("order/verificationConfirm", data);
}
// TODO确认收货组件
export function getwxReceiveDetail(params) {
  return request.get("order/wxReceiveDetail", { params });
}
// TODO查询确认收货
export function getwechatSyncCheck(params) {
  return request.get("order/wechatSyncCheck", { params });
}
