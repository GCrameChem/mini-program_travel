<template>
	<view class="sort">
		<navigator class="header" hover-class="none" url="/pages/goods_search/goods_search">
			<u-search bg-color="#F4F4F4" :disabled="true"></u-search>
		</navigator>
		<view class="content">
			<goods-list :list="cateList"></goods-list>
			<!-- <cate-one  v-if="appConfig.cate_style == 2" :list="cateList"></cate-one>
			<cate-two v-if="appConfig.cate_style == 3" :list="cateList"></cate-two>
			<cate-three v-if="appConfig.cate_style == 4" :list="cateList"></cate-three>
			<cate-four v-if="appConfig.cate_style == 1" :list="cateList"></cate-four> -->
		</view>
	</view>
</template>

<script>
	import {
		getCatrgory,
		getBestList
	} from '@/api/store';
	import {
		getRect,
		setTabbar
	} from '@/utils/tools';
	import {
		mapGetters,
		mapActions
	} from 'vuex'
	import Cache from '@/utils/cache'
	import goodsList from "@/components/goods-list/goods-list";
	export default {
		data() {
			return {
				cateList: []
			};
		},

		components: {},
		onLoad(options) {
			setTabbar()
			this.getCatrgoryFun();
		},
		onShow() {
			this.getCartNum()
		},
		onShareAppMessage() {	
			// const shareInfo = Cache.get('shareInfo')
			// return {
			// 	title: shareInfo.mnp_share_title,
			// 	path: "pages/index/index?invite_code=" + this.inviteCode,
			// 	imageUrl: shareInfo.mnp_share_image,
			// };
		},
		methods: {
			...mapActions(['getCartNum']),
			async getCatrgoryFun() {
				// TEMP: 现在还没有分类，先返回所有活动
				
				try {
					const res = await getBestList({
				      page: 1,
				      pageSize: 6
				    });
					
				    if (res.code === 0) {
				      //console.log(res.data);
				      let { records } = res.data;  // 解构出records字段
				      if (records && records.length > 0) {
				        this.cateList = records;  // 将 records 赋值给 goodsList
				      } else {
				        this.cateList = [];  // 如果 records 为空，则确保 goodsList 为空数组
				        console.error('没有获取到商品列表数据');
				      }
				    } else {
				      console.error('获取商品列表失败，code:', code);
				    }
				  } catch (error) {
				    console.error('请求错误:', error);
				  }
			},

		},
		computed: {
			...mapGetters(["cartNum", "inviteCode", "appConfig"])
		}
	};
</script>
<style lang="scss">
	$header-height: 94rpx;
	$nav-height: 80rpx;
	page {
		.sort {
			.header {
				box-sizing: border-box;
				height: $header-height;
				border-bottom: $-solid-border;

				.search {
					flex: 1;
					height: 60rpx;

					input {
						flex: 1;
						height: 100%;
					}
				}
			}
			.content {
				height: calc(100vh - #{$header-height} - var(--window-top) - var(--window-bottom));
			}
		}
		
	}
</style>
