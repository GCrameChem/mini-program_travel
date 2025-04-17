<template>
<!--components/recommend/recommend.wxml-->
<view class="recommend" v-if="goodsList.length">
    <!-- <view class="header row-center">
        <image class="title" src="/images/recommend_title.png" />
    </view> -->
    <view class="goods-title row-center">
        <text class="line"></text>
        <view class="row">
            <image class="mr10" src="/static/images/icon_like.png"></image>
            <text class="bold xxl">更多精选</text>
        </view>
        <text class="line"></text>
    </view>
    <goods-list :list="goodsList"></goods-list>
</view>
</template>

<script>
import { getBestList } from '../../api/store';
import goodsList from "../goods-list/goods-list";

export default {
  data() {
    return {
      goodsList: []
    };
  },

  components: {
    goodsList
  },
  props: {},
  beforeMount: function () {
    this.getBestListFun();
  },
  destroyed: function () {
  },
  methods: {
    async getBestListFun() {
      try {
		const res = await getBestList({
          page: 1,
          pageSize: 6
        });
		
        if (res.code === 0) {
          //console.log(res.data);
          let { records } = res.data;  // 解构出records字段
          if (records && records.length > 0) {
            this.goodsList = records;  // 将 records 赋值给 goodsList
          } else {
            this.goodsList = [];  // 如果 records 为空，则确保 goodsList 为空数组
            console.error('没有获取到商品列表数据');
          }
        } else {
          console.error('获取商品列表失败，code:', code);
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
    }
  
  }




};
</script>
<style>
/* components/recommend/recommend.wxss */
.recommend {
    padding-bottom: 50rpx;
}
.recommend .header .title {
    width: 468rpx;
    height: 45rpx;
    margin: 10rpx 0;
}

.recommend .goods-title {
	height: 100rpx;
}
.recommend .goods-title .line {
		width: 58rpx;
		height: 1px;
		background-color: #ccc;
		margin: 0 22rpx;
}
.recommend .goods-title image {
	width: 38rpx;
	height: 38rpx;
}
</style>