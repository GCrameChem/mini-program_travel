import request from '@/utils/request'
import {client} from '@/utils/tools'
//获取首页数据接口
export function getHome() {
	return request.get('index/lists')
}

//获取菜单
export function getMenu(data) {
	return request.get('menu/lists', {
		params: data,
	});
}

//广告位
export function getAdList(data) {
	return request.get('ad_content/lists', {
		params: data
	});
}

// 购物车列表
export function getCartList() {
	return request.get('cart/lists')
}


//获取好物优选商品列表
// export function getBestList(data) {
// 	return request.get('goods/getBestList', {
// 		params: data
// 	});
// }
export function getBestList(data) {
	return request.get('activity/list', {
		params: data
	});
}


// 商品分类
export function getCatrgory() {
	return request.get('goods_category/lists');
}


//商品详情
// export function getGoodsDetail(data) {
// 	return request.get('goods/getGoodsDetail', {
// 		params: data
// 	});
// }
export function getGoodsDetail(data) {
    const { activityId, ...restParams } = data;
    return request.get(`activity/${activityId}`, {
        params: restParams
    });
}

// 商品搜索
// export function getGoodsSearch(data) {
// 	return request.get('goods/getGoodsList', {
// 		params: data
// 	});
// }
export function getGoodsSearch(data) {
	return request.get('activity/list', {
		params: data
	});
}


//搜索页,热门搜索列表,和历史搜索列表
export function getSearchpage(data) {
	return request.get('goods/getSearchPage', {
		params: data
	});
}

// 清空历史搜索
export function clearSearch() {
	return request.get('goods/clearSearch');
}

// 获取评价列表
// export function getCommentList(data) {
// 	return request.get("goods_comment/lists", {
// 		params: data
// 	})
// }
export function getCommentList(data) {
	return request.get("reviews/list", {
		params: data
	})
}

// 获取订单商品列表(一个订单可能多个商品)
export function getOrderCommentList(data) {
	return request.get("goods_comment/getOrderGoods", {
		params: data
	})
}

// 购物车数量更改
export function changeGoodsCount(data) {
	return request.post("cart/change", data)
}

// 单选/全选/店铺选择
export function selectedOpt(data) {
	return request.post("cart/selected", data)
}

// 删除商品
export function deleteGoods(data) {
	return request.post("cart/del", data);
}

//购物车选中状态
export function changeCartSelect(data) {
	return request.post('cart/selected', data)
}

//评价属性分类
// export function getCommentCategory(id) {
// 	return request.get("/goods_comment/category", {
// 		params: {
// 			goods_id: id
// 		}
// 	})
// }

export function getCommentCategory(data) {
    if (typeof data !== 'object' || data === null) {
        console.error("传入参数不是对象：", data);
        return;
    }
    const { activityId, ...restParams } = data;
    return request.get(`activity/reviewAttributes/${activityId}`, { params: restParams });
}


//加入购物车
export function addCart(data) {
  return request.post('cart/add', data);
} 

 //购物车数量
export function getCartNum(params) {
  return request.get("cart/num", {params});
}


//获取商品热搜榜单
export function getHotGoods(data) {
  return request.get("goods/getHostList", {params: data});
}

// 获取秒杀时间段
export function getSeckillTime() {
	return request.get("/seckill/seckillTime");
}

// 获取秒杀商品
export function getSeckillGoods(params) {
	return request.get("/seckill/seckillGoods", {params})
}

// 消息中心首页
export function getMessageLists() {
	return request.get("notice/index")
}

// 消息通知
export function getNoticeLists(params) {
	return request.get("notice/lists", {params})
}


//商品海报
export function getPoster(data) {
	return request.get("share/sharegoods", {
		params: data
	});
}

// 门店自提列表
export function getStoreList(data) {
	return request.get("selffetch_shop/lists", {
		params: data
	});
}

// 直播列表
export function getLiveRoom(data) {
	return request.get("live_room/lists", {
		params: data
	});
}
