<template>
    <!-- pages/user_address/user_address.wxml -->
    <view class="user-address">
        <view class="no-address column-center" v-if="!hasAddress">
            <image class="img-null mt20" src="/static/images/address_null.png"></image>
            <view class="sm muted">暂无添加地址，请添加~</view>
        </view>
        <view class="address-list" v-else>
            <radio-group class="radio-group" @change="radioChange">
                <view
                    v-for="(item, index) in addressList"
                    :key="index"
                    class="item bg-white mb20"
                    :data-id="item.id"
                    @tap="onSelect"
                >
                    <view class="address row-between">
                        <view class="column">
                            <view class="consignee md bold">
                                {{ item.province }} {{ item.city }} {{ item.district }} {{ item.address }}
                            </view>
                            <view class="lighter sm mt10">
                                {{ item.contact }}
                                <text class="phone ml10">{{ item.telephone }}</text>
                            </view>
                            <!-- 在此处显示标签 -->
                            <view class="tag mt10" v-if="item.tag">{{ item.tag }}</view>
                        </view>
                    
                        <!-- 让编辑和删除按钮紧靠右侧 -->
                        <view class="row">
                            <view class="row mr10" @click.stop="editAddress(item.id)">
                                <image class="icon-md" src="/static/images/icon_edit.png"></image>
                            </view>
                            <view class="row ml10" :data-id="item.id" @tap.stop="showSurePop">
                                <image class="icon-md" src="/static/images/icon_del_1.png"></image>
                            </view>
                        </view>
                    </view>


                    <view class="operation row-between">
                        <view>
                            <radio
                                class="radio row"
                                color="#FF2C3C"
                                :value="item.id + ''"
                                :checked="item.is_default == '1' ? true : false"
                            >
                                <text>设为默认</text>
                            </radio>
                        </view>
                    </view>
                </view>
            </radio-group>
        </view>
        <u-modal
            id="delete-dialog"
            v-model="deleteSure"
            :showCancelButton="true"
            confirm-text="删除"
            confirm-color="#FF2C3C"
            :show-title="false"
            @confirm="delAddressFun"
            @cancel="hidePop"
        >
            <view class="column-center tips-dialog">
                <image class="icon-lg" src="/static/images/icon_warning.png"></image>
                <view style="margin-top: 30rpx">确认删除？</view>
            </view>
        </u-modal>
        <view class="footer row-between fixed bg-white">
            <!-- #ifdef H5 || MP-WEIXIN -->
            <view class="btn row-center bg-gray br60 mr20" @click="getWxAddressFun" v-if="isWeixin">
                <image class="icon-lg mr10" src="/static/images/icon_wechat.png"></image>
                <text class="md">微信导入</text>
            </view>
            <!-- #endif -->
            <view class="btn bg-primary white md row-center br60" @click="addAddress"
                >新增收货地址</view
            >
        </view>
    </view>
</template>

<script>
import { getAddressLists, delAddress, setDefaultAddress } from '@/api/user'
import wechath5 from '@/utils/wechath5'
import { isWeixinClient } from '@/utils/tools'
export default {
    data() {
        return {
            addressList: [],
            hasAddress: true,
            deleteSure: false,
            currentId: 0,
            isWeixin: true
        }
    },

    props: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.type = options.type
        //#ifdef H5
        this.isWeixin = isWeixinClient()
        //#endif
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getAddressListsFun()
    },

    methods: {
        onSelect(e) {
            if (this.type) {
                let { id } = e.currentTarget.dataset
                uni.$emit('selectaddress', {
                    id
                })
                uni.navigateBack()
            }
        },

        addAddress() {
            uni.navigateTo({
                url: '/pages/address_edit/address_edit'
            })
        },

        editAddress(id) {
            uni.navigateTo({
                url: `/pages/address_edit/address_edit?id=${id}`
            })
        },

        getAddressListsFun() {
            getAddressLists().then((res) => {
                if (res.code == 0) {
                    if (res.data.length) {
                        this.addressList = res.data
                        this.hasAddress = true
                    } else {
                        this.hasAddress = false
                    }
                } else {
                    this.hasAddress = false
                }
            })
        },

        radioChange(e) {
            let id = e.detail.value
            console.log(e)
            setDefaultAddress(id).then((res) => {
                if (res.code == 0) this.getAddressListsFun()
            })
        },

        onLoadFun() {
            this.getAddressListsFun()
        },

        delAddressFun(e) {
            let id = this.currentId
            delAddress(id).then((res) => {
                if (res.code == 0) {
                    this.$toast({
                        title: res.msg
                    })
                    this.deleteSure = false
                    this.getAddressListsFun()
                }
            })
        },

        getWxAddressFun() {
            // #ifdef H5
            wechath5.getWxAddress().then((res) => {
                uni.setStorageSync('wxAddress', JSON.stringify(res))
                setTimeout(() => {
                    uni.navigateTo({
                        url: `/pages/address_edit/address_edit`
                    })
                }, 200)
            })
            // #endif
            // #ifdef MP-WEIXIN
            uni.authorize({
                scope: 'scope.address',
                success: function (res) {
                    uni.chooseAddress({
                        success: function (res) {
                            uni.setStorageSync('wxAddress', JSON.stringify(res))
                            setTimeout(() => {
                                uni.navigateTo({
                                    url: `/pages/address_edit/address_edit`
                                })
                            }, 200)
                        },
                        fail: function (res) {
                            if (res.errMsg == 'chooseAddress:cancel')
                                return this.$toast({
                                    title: '取消选择'
                                })
                        }
                    })
                },
                fail: function (res) {
                    uni.showModal({
                        title: '您已拒绝导入微信地址权限',
                        content: '是否进入权限管理，调整授权？',

                        success(res) {
                            if (res.confirm) {
                                uni.openSetting({
                                    success: function (res) {}
                                })
                            } else if (res.cancel) {
                                return this.$toast({
                                    title: '已取消！'
                                })
                            }
                        }
                    })
                }
            })
            // #endif
        },

        showSurePop: function (e) {
            this.deleteSure = true
            this.currentId = e.currentTarget.dataset.id
        },
        hidePop: function (e) {
            this.deleteSure = false
        }
    }
}
</script>
<style lang="scss">
/* pages/user_address/user_address.wxss */
.user-address {
    padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
    .no-address {
        padding-top: 300rpx;
        text-align: center;
    }
    .address-list {
        padding: 15rpx 5rpx;
        .item {
            padding: 10rpx 30rpx;
			border-radius: 30rpx;
            .address {
                padding: 20rpx 0;
                border-bottom: $-solid-border;
            }
            .operation {
                height: 80rpx;
            }
        }
    }
    .footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 118rpx;
        padding: 0 30rpx;
        box-sizing: content-box;
        padding-bottom: env(safe-area-inset-bottom);
        .btn {
            flex: 1;
            height: 80rpx;
        }
    }
}

.tips-dialog {
    height: 230rpx;
    width: 100%;
}
</style>
