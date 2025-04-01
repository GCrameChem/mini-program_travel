<!-- components/ExpandableCard.vue -->
<template>
  <view class="expandable-card" :class="{ 'is-expanded': isExpanded }">
    <!-- 卡片头部 -->
    <view class="card-header" @click="toggleExpand">
      <image 
        class="card-bg" 
        :src="bgImage" 
        mode="aspectFill"
      ></image>
      
      <view class="card-content">
        <!-- 标题区插槽（提供默认内容） -->
        <slot name="header" :isExpanded="isExpanded">
          <view class="text-content">
            <text class="title">{{ title }}</text>
            <text class="desc">{{ desc }}</text>
          </view>
        </slot>
        
        <!-- 箭头图标 -->
        <view class="arrow-icon" :style="{ transform: arrowRotation }">
          <image src="/static/images/icons/arrow_right.png" mode="widthFix"></image>
        </view>
      </view>
    </view>
    
    <!-- 内容区插槽 -->
    <view class="card-detail" v-if="isExpanded">
      <slot name="content"></slot>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    bgImage: {
      type: String,
      default: '/static/default-bg.jpg'
    },
    title: {
      type: String,
      default: '默认标题'
    },
    desc: {
      type: String,
      default: '默认描述'
    },
    initiallyExpanded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isExpanded: this.initiallyExpanded
    }
  },
  computed: {
    arrowRotation() {
      return this.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)'
    }
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
      this.$emit('toggle', this.isExpanded)
    }
  }
}
</script>

<style lang="scss" scoped>
.expandable-card {
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	margin-bottom: 20rpx;
	transition: all 1s ease;

	.card-header {
		position: relative;
		height: 180rpx;
		padding: 30rpx;
		box-sizing: border-box;
    
    .card-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
    }
    
    .card-content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
    }
  }

  .text-content {
    flex: 1;
	
    .title {
      font-size: 32rpx;
      font-weight: bold;
      display: block;
      margin-bottom: 10rpx;
    }
    .desc {
      font-size: 24rpx;
      opacity: 0.9;
    }
  }

  .arrow-icon {
    width: 40rpx;
    height: 40rpx;
    transition: transform 0.3s ease;
    image {
      width: 100%;
      height: 100%;
    }
  }

  .card-detail {
    background: #fff;
    padding: 15rpx 0rpx 0rpx;
  }

  &.is-expanded {.card-header {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;}
  }
}
</style>