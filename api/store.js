import request from '@/utils/request'
import {client} from '@/utils/tools'

// TODO（根据需求修改）获取首页数据接口
export function getHome() {
	return request.get('index/lists')
}

// TODO(根据需求自定义)获取菜单
export function getMenu(data) {
	return request.get('menu/lists', {
		params: data,
	});
}

// ？？广告位
export function getAdList(data) {
	// return request.get('ad_content/lists', {
	// 	params: data
	// });
}

// TODO购物车列表
export function getCartList() {
	return request.get('cart/lists')
}


// 获取默认活动清单(原好物优选)商品列表
export function getBestList(data) {
	return request.get('activity/list', {
		params: data
	});
}

// TODO 商品分类，目前用默认活动清单代替
export function getCatrgory() {
	return request.get('activity/list');
}

// 商品详情
export function getGoodsDetail(data) {
    const { activityId, ...restParams } = data;
    return request.get(`activity/${activityId}`, {
        params: restParams
    });
}

// 商品搜索
export function getGoodsSearch(data) {
	return request.get('activity/list', {
		params: data
	});
}


// ？？搜索页,热门搜索列表,和历史搜索列表
export function getSearchpage(data) {
	return request.get('goods/getSearchPage', {
		params: data
	});
}

// ？？清空历史搜索
export function clearSearch() {
	return request.get('goods/clearSearch');
}

// 评价属性分类
export function getCommentCategory(data) {
	const{activityId,...restParams} = data;
	return request.get(`review/reviewAttributes/${activityId}`, {params: restParams});
}

// 获取评价列表
export function getCommentList(data) {
	return request.get("review/list", {
		params: data
	})
}

// 查询用户是否点赞
export function getCommentLike(data) {
	return request.get("review/isLike", {
		params: data
	})
}

// 用户点赞或取消点赞
export function addCommentLike(data) {
    const { reviewId, likeAction, ...restParams } = data;
    let url = likeAction === 'add' ? `review/like/${reviewId}` : `review/unlike/${reviewId}`;  // 如果是取消点赞，使用unlike接口
    return request.post(url, {
        params: restParams
    });
}

// TODO获取订单商品列表(一个订单可能多个商品)
export function getOrderCommentList(data) {
	return request.get("goods_comment/getOrderGoods", {
		params: data
	})
}

// TODO购物车数量更改
export function changeGoodsCount(data) {
	return request.post("cart/change", data)
}

// TODO单选/全选/店铺选择
export function selectedOpt(data) {
	return request.post("cart/selected", data)
}

// TODO删除商品
export function deleteGoods(data) {
	return request.post("cart/del", data);
}

// TODO购物车选中状态
export function changeCartSelect(data) {
	return request.post('cart/selected', data)
}


// TODO加入购物车
export function addCart(data) {
  return request.post('cart/add', data);
} 

// TODO购物车数量
export function getCartNum(params) {
  return request.get("cart/num", {params});
}


// ？？获取商品热搜榜单
export function getHotGoods(data) {
  return request.get("goods/getHostList", {params: data});
}

// ？？获取秒杀时间段
export function getSeckillTime() {
	return request.get("/seckill/seckillTime");
}

// ？？获取秒杀商品
export function getSeckillGoods(params) {
	return request.get("/seckill/seckillGoods", {params})
}

// ？？消息中心首页
export function getMessageLists() {
	return request.get("notice/index")
}

// ？？消息通知
export function getNoticeLists(params) {
	return request.get("notice/lists", {params})
}


// TODO商品海报
export function getPoster(data) {
	return request.get("share/sharegoods", {
		params: data
	});
}

// ？？门店自提列表
export function getStoreList(data) {
	return request.get("selffetch_shop/lists", {
		params: data
	});
}

// ？？直播列表
export function getLiveRoom(data) {
	return request.get("live_room/lists", {
		params: data
	});
}
