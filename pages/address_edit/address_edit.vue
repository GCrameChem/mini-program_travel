<template>
    <!-- pages/address_edit/address_edit.wxml -->
    <view class="address-edit">
        <form @submit="formSubmit" report-submit="true">
            <view class="form bg-white">
                <view class="form-item row">
                    <view class="label">收货人</view>
                    <input
                        class="ml10"
                        v-model="addressObj.contact"
                        name="contact"
                        type="text"
                        placeholder="收货人姓名"
                    />
                </view>
                <view class="form-item row">
                    <view class="label">手机号码</view>
                    <input
                        class="ml10"
                        name="telephone"
                        v-model="addressObj.telephone"
                        type="number"
                        placeholder="收货人手机号码"
                    />
                </view>
                <view @click="showRegion = true">
                    <view class="form-item row">
                        <view class="label">所在地区</view>
                        <input
                            class="ml10"
                            name="region"
                            v-model="region"
                            disabled
                            type="text"
                            placeholder="请选择省、市、区"
                        />
                        <image class="icon-sm ml10" src="/static/images/arrow_right.png" />
                    </view>
                </view>
                <view>
                    <u-field
                        v-model="addressObj.address"
                        type="textarea"
                        label="详细地址"
                        placeholder="请填写小区、街道、门牌号等信息"
                        :field-style="{ flex: 1, 'margin-left': '20rpx', height: '160rpx' }"
                    />
                </view>
            </view>
			<!-- 地址标签选择 -->
			<view class="mt10 mb10 bg-white form-item row">
				<view class="label">地址标签</view>
				<view class="tag-container">
					<view 
						v-for="tag in ['家', '学校', '公司', '其他']" 
						:key="tag" 
						@click="selectTag(tag)"
						:class="['tag-item', { 'selected': addressTag === tag }]"
					>
						{{ tag }}
					</view>
				</view>
			</view>
            <view class="mt10 mb10 bg-white check-wrap">
                <radio-group class="row" @click="ChangeIsDefault">
                    <radio
                        id="checkbox"
                        style="border-radius: 50%; transform: scale(0.7)"
                        :checked="addressObj.is_default ? true : false"
                        color="#FF2C3C"
                    />
                    <label for="checkbox">
                        <text>设为默认地址</text>
                    </label>
                </radio-group>
            </view>
			<view class="bottom-container">
				<button class="delete-btn" @click="deleteSure = true">删除地址</button>
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
				        <view style="margin-top: 30rpx">确认删除该地址</view>
				    </view>
				</u-modal>
			    <button class="save-btn" form-type="submit">保存地址</button>
			</view>
<!--            <button class="my-btn bg-primary white br60" form-type="submit">保存</button>
			<button class="my-btn bg-primary white br60" form-type="delete">删除</button> -->
        </form>
        <u-select
            v-model="showRegion"
            mode="mutil-column-auto"
            @confirm="regionChange"
            :list="lists"
        ></u-select>
    </view>
</template>

<script>
import { editAddress, getOneAddress, hasRegionCode, addAddress, getAddressLists, delAddress, setDefaultAddress, updateAddressTag } from '@/api/user'
import area from '@/utils/area'
export default {
    data() {
        return {
            addressObj: {
                contact: '',
                telephone: '',
                province: '',
                city: '',
                district: '',
                address: '',
				addressTag: '',  // 存储选中的标签
                is_default: 0
            },
            region: '',
            addressId: '',
            defaultRegion: ['广东省', '广州市', '番禺区'],
            defaultRegionCode: '440113',
            showRegion: false,
			deleteSure: false,
            lists: []
        }
    },
    props: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.addressId = parseInt(options.id)
        if (options.id) {
            uni.setNavigationBarTitle({
                title: '编辑地址'
            })
            this.getOneAddressFun()
        } else {
            uni.setNavigationBarTitle({
                title: '添加地址'
            })
            this.getWxAddressFun()
        }
        this.$nextTick(() => {
            this.lists = area
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        uni.removeStorageSync('wxAddress')
    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {},
    methods: {
        formSubmit(e) {
            let { value } = e.detail
            let {
                addressObj: { province_id, city_id, district_id, is_default, address },
                addressId
            } = this
            value.address = address
            if (!value.contact)
                return this.$toast({
                    title: '请填写收货人姓名'
                })
            if (!value.telephone)
                return this.$toast({
                    title: '请填写手机号码'
                })
            if (!value.region)
                return this.$toast({
                    title: '请选择省、市、区'
                })
            if (!value.address)
                return this.$toast({
                    title: '请填写小区、街道、门牌号等信息'
                })
            value.province_id = parseInt(province_id)
            value.city_id = parseInt(city_id)
            value.district_id = parseInt(district_id)
            value.is_default = is_default
            value.id = addressId
            delete value.region

            if (addressId) {
                editAddress(value)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$toast(
                                {
                                    title: res.msg
                                },
                                {
                                    tab: 3,
                                    url: 1
                                }
                            )
                        }
                    })
                    .catch((err) => {
                        return this.$toast({
                            title: err
                        })
                    })
            } else {
                addAddress(value)
                    .then((res) => {
                        if (res.code == 0) {
                            this.$toast(
                                {
                                    title: res.msg
                                },
                                {
                                    tab: 3,
                                    url: 1
                                }
                            )
                        }
                    })
                    .catch((err) => {
                        return this.$toast({
                            title: err
                        })
                    })
            }
        },
		selectTag(tag) {
			this.addressTag = this.addressTag === tag ? '' : tag;
			this.$forceUpdate(); // 解决界面不刷新的问题
	
			// 调用后端接口同步数据
			updateAddressTag({
				id: this.addressId, // 传当前地址的 ID
				tag: this.addressTag
			}).then((res) => {
				if (res.code == 0) {
					this.$toast({ title: '标签更新成功' });
				} else {
					this.$toast({ title: '标签更新失败，请重试' });
				}
			}).catch((err) => {
				console.error("标签更新失败:", err);
				this.$toast({ title: '网络异常，请稍后重试' });
			});
		},
        regionChange(region) {
            this.addressObj.province_id = region[0].value
            this.addressObj.city_id = region[1].value
            this.addressObj.district_id = region[2].value
            this.region = region[0].label + ' ' + region[1].label + ' ' + region[2].label
        },
        ChangeIsDefault: function (e) {
            if (this.addressObj.is_default == 0) {
                this.addressObj.is_default = 1
            } else {
                this.addressObj.is_default = 0
            }
        },

        textareaChange: function (e) {
            this.addressObj.address = e.detail.value
        },

        getOneAddressFun() {
            getOneAddress(this.addressId).then((res) => {
                if (res.code == 0) {
                    let { city, province, district } = res.data
                    this.addressObj = res.data
                    this.region = `${province} ${city} ${district}`
                }
            })
        },

        getWxAddressFun() {
            let wxAddress = uni.getStorageSync('wxAddress')
            if (!wxAddress) return
            wxAddress = JSON.parse(wxAddress)
            let {
                userName: contact,
                telNumber: telephone,
                provinceName: province,
                cityName: city,
                detailInfo: address
            } = wxAddress
            let district = wxAddress.countryName || wxAddress.countyName
            hasRegionCode({
                province,
                city,
                district
            }).then((res) => {
                if (res.code == 0) {
                    if (res.data.province && res.data.city && res.data.district) {
                        this.addressObj.province_id = res.data.province
                        this.addressObj.city_id = res.data.city
                        this.addressObj.district_id = res.data.district
                        this.region = `${province} ${city} ${district}`
                    }
                    this.addressObj.contact = contact
                    this.addressObj.telephone = telephone
                    this.addressObj.address = address
                }
            })
        },
        delAddressFun() {
        if (!this.addressId) {
            return this.$toast({ title: '没有可删除的地址' });
        }
        delAddress(this.addressId)
            .then((res) => {
                if (res.code == 0) {
                    this.$toast({
                        title: res.msg
                    });
                    this.deleteSure = false; // 关闭弹窗
                    setTimeout(() => {
                        uni.navigateBack(); // 确保跳转回上一页
                    }, 500);
                } else {
                    this.$toast({ title: '删除失败，请重试' });
                }
            })
            .catch(() => {
                this.$toast({ title: '删除请求失败，请检查网络' });
            });
    },
    hidePop() {
        this.deleteSure = false; // 取消删除时关闭弹窗
    }
    }
}
</script>
<style lang="scss">
/* pages/address_edit/address_edit.wxss */

.address-edit {
    padding-top: 10rpx;
    .form {
        flex: 1;
        .form-item {
            padding: 0 24rpx;
            height: 80rpx;
            &:not(:nth-of-type(3)) {
                border-bottom: $-solid-border;
            }
            .label {
                width: 150rpx;
            }
            input {
                height: 100%;
                flex: 1;
            }
        }
    }
    .check-wrap {
        padding: 20rpx;
    }
	.tag-container {
	    display: flex;
	    gap: 10px;
	    margin-left: 50rpx;
	}
	
	.tag-item {
	    padding: 10rpx 20rpx;
	    border: 1px solid #ccc;
	    border-radius: 10rpx;
		margin-block:10rpx;
	    color: #666;
	    cursor: pointer;
	}
	
	.tag-item.selected {
	    background-color: #007aff;
	    color: white;
	    border-color: #007aff;
	}

	.bottom-container {
	    position: fixed;
	    bottom: 0;
	    left: 0;
	    width: 100%;
	    background-color: white;
	    padding: 10rpx 15rpx;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    border-top: 1px solid #ddd;
	}
	
	.delete-btn, .save-btn {
	    flex: 1;
	    padding: 10rpx 0;
	    font-size: 28rpx;
	    border-radius: 30rpx;
	}
	
	.delete-btn {
	    border: 1px solid #ddd;
	    background-color: white;
	    color: #333;
	    margin-right: 20rpx;
	}
	
	.save-btn {
	    border: none;
	    background-color: #ff4d4f;
	    color: white;
	}


}

van-field view {
    height: 100%;
}

van-field textarea {
    height: 100% !important;
    padding-top: 10rpx !important;
}

.van-cell {
    padding: 20rpx !important;
}

.van-field__body--textarea,
.van-field__input {
    margin-left: 15rpx;
}
</style>
