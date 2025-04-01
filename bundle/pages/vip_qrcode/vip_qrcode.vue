<template>
    <view class="qrcode-page">
        <view class="qrcode-container">
            <view class="user-info">
                <image 
                    class="avatar" 
                    :src="userInfo.avatar || '/static/images/default_avatar.png'"
                ></image>
                <view class="name lg bold">{{ userInfo.nickname || '未登录' }}</view>
            </view>
            <view class="qrcode-wrapper">
                <image class="qrcode-img" src="/static/images/sample_qrcode.png"></image>
                <view class="qrcode-text sm">编号：{{ userInfo.qrCode || '暂无' }}</view>
            </view>
            <view class="info-text sm lighter">
                请向商家出示此二维码，以便获取会员权益。
            </view>
			<!-- 资产信息 -->
			<view class="my-assets bg-white">
			    <view class="divider"></view>
				<view class="nav row">
				    <view
				        class="column-center assets-item"
				        @tap="goPage('/bundle/pages/user_wallet/user_wallet')"
				    >
				        <view class="xl primary">{{ userInfo.user_money || '0.00' }}</view>
				        <view class="sm">余额</view>
				    </view>
				    <view
				        class="column-center assets-item"
				        @tap="goPage('/bundle/pages/user_sign/user_sign')"
				    >
				        <view class="xl primary">{{ userInfo.user_integral || '0' }}</view>
				        <view class="sm">积分</view>
				    </view>
				    <view
				        class="column-center assets-item"
				        @tap="goPage('/pages/user_coupon/user_coupon')"
				    >
				        <view class="xl primary">{{ userInfo.coupon || '0' }}</view>
				        <view class="sm">优惠券</view>
				    </view>
				</view>
			</view>
        </view>
    </view>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import Cache from '@/utils/cache'
export default {
	components: {},
	props: {},
    computed: {
        ...mapGetters(['userInfo']),
        isLogin() {
            return !!this.userInfo && !!this.userInfo.nickname;
        }
    },
    methods: {
        ...mapActions(['getUser']),
        goPage(url) {
            if (!this.isLogin) {
                uni.showToast({ title: '请先登录', icon: 'none' });
                return;
            }
            uni.navigateTo({ url });
        }
    },
    onShow() {
        this.getUser();
    }
};

</script>
<style lang="scss">
.qrcode-page {
    background-color: #FFA726;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx 0;
}
.qrcode-container {
	margin-top: 40rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 40rpx 30rpx;
    width: 90%;
    text-align: center;
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 30rpx;
}

.avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-bottom: 10rpx;
}

.qrcode-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20rpx;
}

.qrcode-img {
    width: 300rpx;
    height: 300rpx;
}

.qrcode-text {
    margin-top: 10rpx;
}

.info-text {
    color: #999;
    margin-bottom: 20rpx;
}

.my-assets {
        margin: 10rpx;
        border-radius: 8rpx;
		.sm {
			font-size: 24rpx;
			color: #666;
		}
    }
.assets-item {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10rpx;
    padding: 20rpx;
    flex: 1;
    text-align: center;
    color: #fff;
}
.divider {
	padding: 20rpx 30rpx;
	border-bottom: $-dashed-border;
}

.nav {
	padding: 10rpx 20rpx 0rpx;
	display: flex;
	width: 100%;
	justify-content: space-between;
	.assets-item {
		flex: 1;
	}
}

.primary {
    font-weight: bold;
}
</style>
