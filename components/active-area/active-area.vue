<template>
	<view :class="'active-area ' + type">
		<view class="a-header">
			<slot name="header"></slot>
		</view>
		<view class="public-class a-main">
			<slot name="main-header"></slot>
			<view v-if="type == 'hot'">
				<goods-list type="home-hot" :list="lists"></goods-list>
			</view>
			<scroll-view v-else style="white-space: nowrap;" scroll-x="true" scroll-with-animation="true">
				<navigator v-for="(item, index) in lists" :key="index"
					:style="{background: type == 'seckill' && '#f8f8f8'}" class="goods-item bg-white" hover-class="none"
					:url="'/pages/goods_details/goods_details?id=' + item.activityId">
					<custom-image width="240rpx" height="240rpx" radius="10rpx" lazy-load :src="item.imageUrlList[0]">
					</custom-image>
					<view style="padding: 8rpx">
						<view class="goods-name line1">{{item.activityName}}</view>
						<view class="row wrap">
							<price-format class="mr10" :weight="500" :price="item.currentPrice" :first-size="32"
								:second-size="22" :subscript-size="22" color="#FF2C3C"></price-format>
							<price-format :price="item.originalPrice" color="#999999" :second-size="22"
								:first-size="22" :subscript-size="22" :line-through="true"></price-format>
						</view>
					</view>
				</navigator>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		trottle,
		getRect
	} from "@/utils/tools";

	export default {
		data() {
			return {
				currentSwiper: 0,
			};
		},

		components: {},
		props: {
			type: {
				type: String,
				default: ''
			},
			lists: {
				type: Array,
				default: () => []
			}
		},
		watch: {
			"lists": function(value) {
				if (!value) {
					return;
				}
			}
		},

		beforeMount: function() {

		},
		destroyed: function() {},
		methods: {}
	};
</script>
<style lang="scss" scoped>
	.active-area {
		background-repeat: no-repeat;
		background-size: 100% auto;
		border-radius: 10rpx;
		padding-bottom: 20rpx;
		&.seckill {
			background-color: $-color-white;
			background-image: url(../../static/images/home_seckill_bg.png);
		}

		.a-main {
			position: relative;
			box-sizing: border-box;

			.goods-item {
				width: 240rpx;
				margin-left: 16rpx;
				display: inline-block;
				border-radius: 10rpx;
				overflow: hidden;
				
				box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);

				&:first-of-type {
					margin-left: 20rpx;
				}

				&:last-of-type {
					margin-right: 20rpx;
				}
			}
		}
	}
</style>
