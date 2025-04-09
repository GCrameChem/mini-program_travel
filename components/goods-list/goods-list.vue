<template>
	<view class="goods-list">
		<view v-if="type === 'double'" class="goods-double row-between">
			<navigator v-for="(records, index) in list" :key="index" class="records bg-white mt20" hover-class="none" open-type="navigate"
			 :url="'/pages/goods_details/goods_details?id=' + (isBargain ? records.activityId : records.activityId)">
				<view class="goods-img" style="width: 100%"> <!-- 原347rpx -->
				      <custom-image
				        :lazy-load="true" 
				        radius="10rpx" 
				        :src="records.imageUrlList && records.imageUrlList.length > 0 ? records.imageUrlList[0] : ''"
				      />

				    </view>
					
				    <view class="goods-info">
				      <view class="goods-name line2">{{records.activityName}}</view>
				      <view class="price">
				        <price-format 
				          color="#FF2C3C"  
				          class="mr10" 
				          :first-size="34" 
				          :second-size="26" 
				          :subscript-size="26" 
				          :price="records.currentPrice" 
				          :weight="500"
				        ></price-format>
				        <price-format 
				          class="muted" 
				          :firstSize="24" 
				          :secondSize="24" 
				          :subscript-size="24" 
				          line-through 
				          :price="records.originalPrice || records.currentPrice"
				        ></price-format>
				      </view>
				    </view>
			</navigator>
		
		</view>
		
		<view v-if="type === 'triple'" class="goods-triple row-between">
			<navigator v-for="(records, index) in list" :key="index" class="records bg-white mt20" hover-class="none" open-type="navigate"
			 :url="'/pages/goods_details/goods_details?id=' + (isBargain ? records.goods_id : records.activityId)">
				<view class="goods-img" style="width: 100%">
				      <custom-image 
				        :lazy-load="true" 
				        radius="10rpx" 
				        :src="records.imageUrlList[0]"
				      ></custom-image>
				    </view>
					
				    <view class="goods-info">
				      <view class="goods-name line2">{{records.activityName}}</view>
				      <view class="price">
				        <price-format 
				          color="#FF2C3C"  
				          class="mr10" 
				          :first-size="34" 
				          :second-size="26" 
				          :subscript-size="26" 
				          :price="records.currentPrice" 
				          :weight="500"
				        ></price-format>
				        <price-format 
				          class="muted" 
				          :firstSize="24" 
				          :secondSize="24" 
				          :subscript-size="24" 
				          line-through 
				          :price="records.originalPrice || records.currentPrice"
				        ></price-format>
				      </view>
				    </view>
			</navigator>
		</view>
		<view v-if="type === 'hot'" class="goods-hot">
			<navigator v-for="(records, index) in list" :key="index" class="records bg-white mt20 row" hover-class="none" open-type="navigate"
			 :url="'/pages/goods_details/goods_details?id=' + records.activityId">
				<view class="goods-img" style="width: 180rpx;height:180rpx;">
					<custom-image :lazy-load="true" width="180rpx" height="180rpx" radius="6rpx" lazy-load :src="records.imageUrlList[0]"></custom-image>
				</view>
				<view class="goods-info ml20">
					<view class="goods-name line2 mb10">{{records.activityName}}</view>
					<text class="sale br60 xxs">已有{{records.sales_sum}}人购买</text>
					<view class="row-between  mt10">
						<view class="price mt10 row">
							<price-format color="#FF2C3C"  class="mr10" :first-size="34" :second-size="26" :subscript-size="26" :price="records.currentPrice" :weight="500"></price-format>
							<price-format class="muted" :firstSize="24" :secondSize="24" :subscript-size="24" line-through :price="records.originalPrice"></price-format>
						</view>
						<image class="icon-md" src="/static/images/icon_go_red.png"></image>
					</view>
				</view>
				<image class="paixu" :src="'/static/images/No.' + (index < 3 ? index : 3) + '.png'"></image>
				<view class="number xxs">{{ index + 1 }}</view>
			</navigator>
		</view>
		<view v-if="type === 'home-hot'" class="goods-home-hot goods-hot">
			<navigator v-for="(records, index) in list" :key="index" class="records bg-white mb20 row" hover-class="none" open-type="navigate"
			 :url="'/pages/goods_details/goods_details?id=' + records.activityId">
				<view class="goods-img">
					<custom-image :lazy-load="true" width="240rpx" height="240rpx" radius="6rpx" lazy-load :src="records.imageUrlList[0]"></custom-image>
				</view>
				<view class="goods-info ml20 mr20">
					<view class="goods-name line2 mb10">{{records.activityName}}</view>
					<text class="sale br60 xxs">已有{{records.sales_sum}}人购买</text>
					<view class="row-between  mt10">
						<view class="price mt10 row">
							<price-format color="#FF2C3C"  class="mr10" :first-size="34" :second-size="26" :subscript-size="26" :price="records.currentPrice" :weight="500"></price-format>
							<price-format class="muted" :firstSize="24" :secondSize="24" :subscript-size="24" line-through :price="records.originalPrice"></price-format>
						</view>
						<button type="primary" class="br60" size="xs">去购买</button>
					</view>
				</view>
				<image class="paixu" :src="'/static/images/No.' + (index < 3 ? index : 3) + '.png'"></image>
				<view class="number">{{ index + 1 }}</view>
			</navigator>
		</view>
		<view v-if="type === 'new'" class="goods-new">
			<navigator v-for="(records, index) in list" :key="index" class="records bg-white mt20 row" hover-class="none" open-type="navigate"
			 :url="'/pages/goods_details/goods_details?id=' + records.activityId">
				<view class="goods-img">
					<custom-image :lazy-load="true" width="240rpx" height="240rpx" radius="10rpx" lazy-load :src="records.imageUrlList[0]"></custom-image>
				</view>
				<view class="goods-info ml20 mr20 flex1">
					<view class="goods-name line2 mb20">{{records.activityName}}</view>
					<view class="row-between muted xxs ">
						<view class="line-through">
							<text>原价</text>
							<price-format :second-size="22" :first-size="22" :subscript-size="22" :price="records.originalPrice"></price-format>
						</view>
						<view>{{records.sales_sum}}人购买</view>
					</view>
					<view class="row-between  mt10">
						<price-format color="#FF2C3C" :first-size="38" :subscript-size="26"  :second-size="26" :price="records.currentPrice"
						 :weight="500"></price-format>
						<button type="primary" class="br60" size="xs">立即抢购</button>
					</view>
				</view>
			</navigator>
		</view>
		<view v-if="type === 'one'" class="goods-one mt20">
			<navigator v-for="(records, index) in list" :key="index" class="records bg-white row" hover-class="none" open-type="navigate"
			 :url="'/pages/goods_details/goods_details?id=' + records.activityId">
				<view class="goods-img" style="width: 200rpx;height:200rpx;">
					<custom-image :lazy-load="true" width="200rpx" height="200rpx" radius="6rpx" lazy-load :src="records.imageUrlList[0]"></custom-image>
				</view>
				<view class="goods-info ml20">
					<view class="goods-name line2 mb10">{{records.activityName}}</view>
					<view class="row-between mt10">
						<view class="price mt10 row">
							<price-format color="#FF2C3C"  class="mr10" :first-size="34" :second-size="26" :subscript-size="26" :price="records.currentPrice" :weight="500"></price-format>
							<price-format class="muted" :firstSize="24" :secondSize="24" :subscript-size="24" line-through :price="records.originalPrice"></price-format>
						</view>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: 'double'
			},
			list: {
				type: Array,
				default: () => []
			},
            isBargain: {
                type: Boolean,
                default: false
            }
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
.goods-list {
	.goods-double {
	  flex-wrap: wrap;
	  padding: 10rpx; /* 外部间距 */
	  display: flex;
	  justify-content: space-between;
	  
	  .records {
		width: calc(50% - 10rpx); /* 两个项目在一行显示，宽度为50% */
		box-sizing: border-box;
		border-radius: 20rpx;
		background: #fff;
		overflow: hidden;
		border: 1rpx solid #dddddd; /* 细灰色边框 */
		
		// 图片容器
		.goods-img {
		  height: 350rpx !important;  /* 正方形的高度 */
		  width: 350rpx !important;   /* 正方形的宽度 */
		  padding: 20rpx; /* 图片与边框间距 */
		  border-radius: 20rpx;
		  
		  .custom-image {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover; /* 确保图片自适应容器 */
		  }
		}
		
		// 商品信息区域
		.goods-info {
		  padding: 5rpx 10rpx; /* 上 左右 下 */
		  
		  .goods-name {
			font-size: 30rpx;
			line-height: 1.4;
			padding: 0 4rpx; /* 文字与边框间距 */
			min-height: 68rpx; /* 固定高度避免抖动 */
		  }
		  
		  .price {
			margin-top: 5rpx;
			padding: 0 4rpx; /* 价格与边框间距 */
		  }
		}
	  }
	}

	.goods-triple {
	  flex-wrap: wrap;
	  padding: 10 10rpx;
	  display: flex;
	  justify-content: space-between;
		.records {
			width: calc(33.33% - 8rpx);
			box-sizing: border-box;
			border-radius: 8rpx;
			background: #fff;
			overflow: hidden;
			border: 1rpx solid #dddddd; /* 细灰色边框 */
		
		// 图片容器
		.goods-img {
			height: 250rpx !important;  /* 正方形的高度 */
			width: 250rpx !important;   /* 正方形的宽度 */
			padding: 10rpx; /* 图片与边框间距 */
		  
			.custom-image {
			display: block;
			border-radius: 6rpx;
			width: 100%;
			height: 100%;
			object-fit: cover; /* 确保图片自适应容器 */
		  }
		}
		
		// 商品信息区域
		.goods-info {
		  padding: 5rpx 10rpx; /* 上 左右 下 */
		  
		  .goods-name {
			font-size: 24rpx;
			line-height: 1.4;
			padding: 0 4rpx; /* 文字与边框间距 */
			min-height: 68rpx; /* 固定高度避免抖动 */
		  }
		  
		  .price {
			margin-top: 5rpx;
			padding: 0 4rpx; /* 价格与边框间距 */
		  }
		}
	  }
	}
		
		
	.goods-hot {
		&.goods-home-hot {
			.records {
				padding: 0;
				.paixu,
				.number {
					left: 10rpx;
				}
			}
		}
		.records {
			position: relative;
			padding: 30rpx 20rpx;
			border-radius: 10rpx;
		
			.goods-info {
				width: 450rpx;
		
				.sale {
					padding: 4rpx 18rpx;
					color: #F79C0C;
					background-color: rgba(247, 156, 12, .1);
				}
			}
		
			.paixu,
			.number {
				position: absolute;
				top: 0;
				left: 27rpx;
				width: 50rpx;
				height: 54rpx;
				line-height: 60rpx;
				text-align: center;
				color: #621E09;
			}
		}
	} 
		
		
	.goods-one .records {
		padding: 20rpx;
		
		&:not(:last-of-type) {
			margin-bottom: 20rpx;
		}
	}
	.goods-new .records {
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
		border-radius: 10rpx;
	}
		
	}
</style>
