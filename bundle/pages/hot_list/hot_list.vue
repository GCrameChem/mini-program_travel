// +----------------------------------------------------------------------
// | likeshop开源商城系统
// +----------------------------------------------------------------------
// | 欢迎阅读学习系统程序代码，建议反馈是我们前进的动力
// | gitee下载：https://gitee.com/likeshop_gitee
// | github下载：https://github.com/likeshop-github
// | 访问官网：https://www.likeshop.cn
// | 访问社区：https://home.likeshop.cn
// | 访问手册：http://doc.likeshop.cn
// | 微信公众号：likeshop技术社区
// | likeshop系列产品在gitee、github等公开渠道开源版本可免费商用，未经许可不能去除前后端官方版权标识
// |  likeshop系列产品收费版本务必购买商业授权，购买去版权授权后，方可去除前后端官方版权标识
// | 禁止对系统程序代码以任何目的，任何形式的再发布
// | likeshop团队版权所有并拥有最终解释权
// +----------------------------------------------------------------------
// | author: likeshop.cn.team
// +----------------------------------------------------------------------

<template>
	<view class="hot-list">
		<view class="header">
			<view class="title row mb20">
				<image src="../../static/images/icon_paixu.png" class="icon mr20"></image>
				<text class="xs white">实时更新热销火爆商品</text>
			</view>
			<swipers :pid="15" height="284rpx" radius="10rpx"></swipers>
		</view>
		<view class="main">
			<view v-if="hasHot">
				<goods-list type="hot" :list="goodsList"></goods-list>
				<loading-footer :status="status">

				</loading-footer>
			</view>
			<view v-else class="column-center" style="padding-top: 400rpx">
				<image class="img-null" src="/static/images/goods_null.png"></image>
				<text class="lighter">暂无商品~</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		loadingType
	} from '@/utils/type';
	import {
		getHotGoods
	} from '@/api/store';

	import {page} from '@/utils/tools'
	export default {
		data() {
			return {
				goodsList: [],
				page: 1,
				status: loadingType.LOADING,
				hasHot: true
			};
		},

		components: {},
		props: {},


		onLoad(options) {
			this.getHotGoodsFun();
		},

		onReachBottom() {
			this.getHotGoodsFun();
		},


		methods: {
			async getHotGoodsFun() {
				let {
					page,
					status,
					goodsList
				} = this;
				const data =  await pageLoad(getHotGoods,page, goodsList,status)
				if (!data) return
				this.page = data.page
				this.goodsList = data.dataList
				this.status = data.status
			}

		}
	};
</script>
<style lang="scss">
	.hot-list {
		background: url(../../static/images/hot_list_bg.png) no-repeat;
		background-size: 100% 330rpx;
		padding: 62rpx 30rpx 0;
		min-height: 100vh;
		box-sizing: border-box;
		.main {
			padding: 0 0 20rpx;
		}
		.data-null {
			padding-top: 150rpx;
		}
		
	}

</style>
