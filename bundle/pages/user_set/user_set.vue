<template>
	<view class="page-container">
		<view class="user-profile-container mt10">
			<view class="user-profile">
				<view class="user-avatar-box column-center">
					<button
						class="column column-center"
						hover-class="none"
						open-type="chooseAvatar"
						@chooseavatar="onChooseAvatar"
						@click="onChooseAvatar"
					>
						<image
							class="user-avatar"
							:src="
								userInfo.avatar != ''
									? userInfo.avatar
									: '../../static/images/default_avatar.png'
							"
						>
						</image>
						<view class="muted xs">点击修改头像</view>
					</button>
				</view>
				<view class="row-info row bdb-line">
					<view class="label md">ID</view>
					<view class="md row" style="flex: 1">{{ userInfo.sn }}</view>
				</view>
				<view class="row-info row bdb-line" @click="changeName">
					<view class="label md">昵称</view>
					<view class="md row" style="flex: 1">{{ userInfo.nickname }}</view>
					<u-icon name="arrow-right" />
				</view>
				<view class="row-info row bdb-line" @click="changeSex()">
					<view class="label md">性别</view>
					<view class="md row" :class="userInfo.sex == 0 ? 'muted' : ''" style="flex: 1">
						{{ userInfo.sex == 0 ? '未设置' : userInfo.sex == 1 ? '男' : '女' }}
					</view>
					<u-icon name="arrow-right" />
				</view>
				<view class="row-info row bdb-line">
					<view class="label md">手机</view>
					<view class="md row" :class="{ muted: !userInfo.mobile }" style="flex: 1">
						{{ userInfo.mobile ? userInfo.mobile : '未绑定' }}
					</view>
					<!-- #ifdef H5 || APP-PLUS -->
					<view class="bd-btn br60 row-center" @click="showModifyMobile">
						{{ userInfo.mobile ? '更换手机号' : '绑定手机号' }}
					</view>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<button
						class="bd-btn br60 row-center"
						size="sm"
						open-type="getPhoneNumber"
						@getphonenumber="getPhoneNumber"
					>
						{{ userInfo.mobile ? '更换手机号' : '绑定手机号' }}
					</button>
					<!-- #endif -->
				</view>
				
				<!-- 生日设置 -->
				<view class="row-info row bdb-line" @click="showBirthdayPicker = true">
				  <view class="label md">生日</view>
				  <view class="md row" :class="{ muted: !selectedBirthday }" style="flex: 1">
					{{ selectedBirthday ? selectedBirthday : '未设置' }}
				  </view>
				  <u-icon name="arrow-right" />
				</view>
			
				<!-- 地区设置 -->
				<view class="row-info row bdb-line" @click="selectRegion">
					<view class="label md">地区</view>
					<view @click="showRegion = true">
						<view class="form-item row">
							<input
								class="ml10"
								name="region"
								v-model="region"
								disabled
								type="text"
								placeholder="请选择省、市、区"
							/>
						</view>
					</view>
				</view>
				
				<!-- 在此处调用收货地址设置 -->
				<view class="row-info row bdb-line">
					<view class="label md">注册时间 </view>
					<view class="md row" style="flex: 1">{{ userInfo.create_time }}</view>
				</view>
			</view>
			

		</view>
		<u-datetime-picker
			v-if="showBirthdayPicker"
			:show="showBirthdayPicker"
			v-model="tempBirthday"
			mode="date"
			:min-date="minDate"
			@confirm="confirmBirthday"
			@cancel="showBirthdayPicker = false"
			style="z-index: 1050;"
		  />
		<u-select
			v-model="showRegion"
			mode="mutil-column-auto"
			@confirm="regionChange"
			:list="lists"
			style="z-index: 1002;"
		></u-select>
		<u-popup type="center" closeable v-model="showMobile" mode="center" border-radius="14" style="z-index: 1003;">
			<view class="modify-container column-center bg-white" v-show="showMobile">
				<view class="title xl">{{ userInfo.mobile ? '更换手机号' : '绑定手机号' }}</view>
				<view class="modify-row row" v-if="userInfo.mobile">
					<view style="width: 56px; border-right: 1px solid #e5e5e5">+86</view>
					<view style="margin-left: 15px">{{ userInfo.mobile }}</view>
				</view>
				<view class="modify-row row" v-else>
					<view style="width: 71px">手机号</view>
					<input v-model="new_mobile" placeholder="请输入绑定手机号" />
				</view>
				<view class="modify-row row">
					<view style="width: 71px">验证码</view>
					<input
						v-model="smsCode"
						style="padding-left: 5px; width: 130px"
						placeholder="请输入验证码"
					/>
					<view class="send-code-btn nr row-center" @click="$sendSms">
						<u-verification-code
							:keep-running="true"
							ref="uCode"
							@change="codeChange"
							unique-key="page-b"
						>
						</u-verification-code>
						<view class="xs">{{ tips }}</view>
					</view>
				</view>
				<view class="modify-row row" v-if="userInfo.mobile">
					<view style="width: 71px">新手机号</view>
					<input v-model="new_mobile" placeholder="请输入新的手机号码" />
				</view>
				<view class="primary mt10"
					>{{
						userInfo.mobile ? '更改' : '绑定'
					}}手机号码成功后，您的账号将会变更为该设置号码</view
				>
				<view class="btn bg-primary white row-center" @click="$changeUserMobile">确定</view>
			</view>
		</u-popup>
		<!-- 昵称修改组件 -->
		<u-popup
		    v-model="showNickName"
		    :closeable="true"
		    :mask-close-able="false"
		    mode="center"
		    border-radius="14"
		    style="z-index: 1051;"
		    @close="showNickName = false"
			>
			<view class="modify-container column-center bg-white" style="width: 70vw; padding: 24rpx">
				<view class="title xl">修改用户名</view>
				<form @submit="confirmNickname">
				  <u-form-item label="新昵称" :labelWidth="120">
					<input
					  style="height: 60rpx"
					  class="nr"
					  v-model="tempNickname"
					  name="nickname"
					  type="text"
					  placeholder="请输入新的昵称"
					/>
				  </u-form-item>
				  <button class="btn bg-primary white row-center" form-type="submit">确定</button>
				</form>
			</view>
		</u-popup>
		<u-popup v-model="showPwd" closeable mode="center" border-radius="14" style="z-index: 1005;">
			<view class="modify-container column-center bg-white" v-show="showPwd">
				<view class="title xl">设置密码</view>
				<view class="modify-row row">
					<view style="width: 56px; border-right: 1px solid #e5e5e5">+86</view>
					<view style="margin-left: 15px">{{ userInfo.mobile }}</view>
				</view>
				<view class="modify-row row">
					<view style="width: 142rpx">验证码</view>
					<input
						v-model="smsCode"
						style="padding-left: 10rpx; width: 260rpx"
						placeholder="请输入验证码"
					/>
					<view class="send-code-btn nr row-center" @click="$sendSms">
						<u-verification-code
							:keep-running="true"
							ref="uCode"
							@change="codeChange"
							unique-key="page-a"
						>
						</u-verification-code>
						<view class="xs">{{ tips }}</view>
					</view>
				</view>
				<view class="modify-row row">
					<view style="width: 71px">设置密码</view>
					<input type="password" v-model="pwd" placeholder="请输入新密码" />
				</view>
				<view class="modify-row row">
					<view style="width: 71px">确认密码</view>
					<input type="password" v-model="confirmPwd" placeholder="再次输入新密码确认" />
				</view>
				<view class="btn bg-primary white row-center" @click="$forgetPwd">确定</view>
			</view>
		</u-popup>
		<u-picker
			mode="selector"
			v-model="showPicker"
			:default-selector="[0]"
			:range="sexList"
			@confirm="onConfirm"
			style="z-index: 1005;"
		/>
		
	</view>
</template>

<script>
import { userLogout, getUserInfo, changeUserMobile, setUserInfo, setWechatInfo } from '@/api/user'
import { version } from '@/config/app'
import { sendSms, forgetPwd } from '@/api/app'
import { SMSType } from '@/utils/type'
import { mapState, mapGetters } from 'vuex'
import { uploadFile, isWeixinClient, trottle } from '@/utils/tools'
import { getWxCode, getUserProfile } from '@/utils/login'
import area from '@/utils/area'
import UDatetimePicker from "@/components/uview-ui/components/u-datetime-picker/u-datetime-picker.vue";

const FieldType = {
    NONE: '',
    SEX: 'sex',
    NICKNAME: 'nickname',
    AVATAR: 'avatar',
    MOBILE: 'mobile',
	BIRTHDAY: 'birthday',
	REGION:'region'
}
export default {
    name: 'userProfile',
	components: {
	    "u-datetime-picker": UDatetimePicker, // 注册组件
	  },
    data() {
        return {
            version: version,
            fileList: [],
            userInfo: {},
            new_mobile: '',
            smsCode: '',
            newNickname: '',
            sexList: ['男', '女'],
            fieldType: FieldType.NONE,
            showPicker: false,
            showMobile: false,
            showPwd: false,
			
			showBirthdayPicker: false, // 生日选择器状态
			showNickName: false, // 修改昵称弹窗状态
			selectedBirthday: '', // 存储最终选择的生日
			tempBirthday: '', // 生日选择器的临时值
			// tempBirthday: this.userInfo.birthday || '', // 初始化时从userInfo获取
			// selectedBirthday: this.userInfo.birthday || '',
			minDate: new Date(1900, 0, 1).getTime(), // 示例最小日期
			tempNickname: '', // 存储输入的新昵称
			
			region: '',
			addressObj: {
				province_id: null,
				city_id: null,
				district_id: null,
				is_default: 0
			},
			showRegion: false,
			lists: [],
            tips: '',
            canSendSms: true,
            pwd: '',
            confirmPwd: '',
            smsType: SMSType.FINDPWD,
            code: ''
        }
    },
	props: {},
    methods: {
        codeChange(text) {
            this.tips = text
        },
        onChooseAvatar(e) {
            this.fieldType = FieldType.AVATAR
            // #ifndef MP-WEIXIN
            // 此为uView的跳转方法，详见"文档-JS"部分，也可以用uni的uni.navigateTo
            uni.$u.route({
                // 关于此路径，请见下方"注意事项"
                url: '/components/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
                // 内部已设置以下默认参数值，可不传这些参数
                params: {
                    // 输出图片宽度，高等于宽，单位px
                    destWidth: 300,
                    // 裁剪框宽度，高等于宽，单位px
                    rectWidth: 200,
                    // 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
                    fileType: 'jpg'
                }
            })
            // #endif
            // #ifdef MP-WEIXIN
            if (e.detail.avatarUrl) {
                console.log(e.detail.avatarUrl)
                this.uploadImage(e.detail.avatarUrl)
            }
            // #endif
        },
        // 修改用户昵称
		
        async changeNameConfirm(e) {
            this.fieldType = FieldType.NICKNAME
            this.newNickname = e.detail.value.nickname
            if (!this.newNickname)
                return this.$toast({
                    title: '请输入新的昵称'
                })
            await this.$setUserInfo(this.newNickname)
            this.showNickName = false
        },

        // end
        logout() {
            //  退出登录
            userLogout({
                token: this.token
            }).then((res) => {
                if (res.code == 0) {
                    this.$store.commit('LOGOUT')
                    this.$toast({
                        title: '退出成功'
                    })
                    setTimeout(() => {
                        uni.redirectTo({
                            url: '/pages/login/login'
                        })
                    }, 500)
                }
            })
        },
        goToExplain(value) {
            uni.navigateTo({
                url: '/bundle/pages/server_explan/server_explan?type=' + value
            })
        },
        goLicense() {
            uni.navigateTo({
                url: '/bundle/pages/license/license'
            })
        },

        toSetPayPwd() {
            if (!this.userInfo.mobile)
                return this.$toast({
                    title: '请先设置手机号'
                })
            uni.navigateTo({
                url: '/bundle/pages/set_pay_pwd/set_pay_pwd'
            })
        },
        // 发送短信
        $sendSms(type) {
            if (!this.canSendSms) return
            sendSms({
                mobile: this.userInfo.mobile || this.new_mobile,
                key: this.smsType
            }).then((res) => {
                if (res.code == 0) {
                    this.$toast({
                        title: res.msg
                    })
                    this.$refs.uCode.start()
                }
            })
        },
        $getUserInfo() {
            getUserInfo().then((res) => {
                if (res.code == 0) {
                    this.userInfo = res.data
                }
            })
        },
        // 更换手机号
        showModifyMobile() {
            this.smsCode = ''
            this.new_mobile = ''
            this.showMobile = true
            this.smsType = this.userInfo.mobile ? SMSType.CHANGE_MOBILE : SMSType.BIND
        },
        $changeUserMobile() {
            if (!this.smsCode) {
                this.$toast({
                    title: '请输入验证码'
                })
                return
            }
            if (!this.new_mobile) {
                this.$toast({
                    title: '请输入新的手机号码'
                })
                return
            }
            changeUserMobile({
                mobile: this.userInfo.mobile,
                new_mobile: this.new_mobile,
                code: this.smsCode,
                action: this.userInfo.mobile ? 'change' : ''
            }).then((res) => {
                if (res.code == 0) {
                    this.showMobile = false
                    this.$toast({
                        title: res.msg
                    })
                    this.$getUserInfo()
                }
            })
        },
        // end
        // 修改用户信息
        async $setUserInfo(value) {
            const res = await setUserInfo({
                field: this.fieldType,
                value: value
            })
            if (res.code == 0) {
                this.$toast({
                    title: res.msg
                })
                this.$getUserInfo()
            }
        },
        // end
        timeChange(timestamp) {
            console.log(timestamp, 'timestamp')
        },
        onConfirm(value) {
            this.$setUserInfo(value[0] + 1)
            this.showPicker = false
        },
        changeSex(e) {
            this.showPicker = true
            this.fieldType = FieldType.SEX
        },
		// 确认选择的生日
		confirmBirthday(value) {
		    this.selectedBirthday = this.formatDate(value);
		    this.userInfo.birthday = this.selectedBirthday; // 更新到用户信息
		    this.showBirthdayPicker = false;
		    this.$setUserInfo({
		      field: FieldType.BIRTHDAY,
		      value: this.selectedBirthday
		    });
		},
		// 确认修改的昵称
		// 修复的昵称确认方法
		  confirmNickname(event) {
		    event.preventDefault();
		    const newNickname = this.tempNickname.trim();
		    if (!newNickname) return;
		    
		    this.$setUserInfo({
		      field: FieldType.NICKNAME,
		      value: newNickname
		    }).then(() => {
		      this.showNickName = false;
		      this.userInfo.nickname = newNickname;
		    });
		  },
		// selectRegion() {
		// 	console.log('选择地区');
		// 	this.lists = area;
		// 	value.province_id = parseInt(province_id)
		// 	value.city_id = parseInt(city_id)
		// 	value.district_id = parseInt(district_id)
		// 	value.is_default = is_default
		// 	value.id = addressId
		// 	delete value.region;
		// },
		// 修复地区选择
		selectRegion() {
			this.closeAllPopups();
			this.lists = area;
			this.showRegion = true;
		},
		regionChange(region) {
		    this.addressObj = {
		        ...this.addressObj,
		        province_id: region[0].value,
		        city_id: region[1].value,
		        district_id: region[2].value
		    };
		    this.region = `${region[0].label} ${region[1].label} ${region[2].label}`;
		    this.$forceUpdate(); // 强制刷新视图
		},
		ChangeIsDefault: function (e) {
		    if (this.addressObj.is_default == 0) {
		        this.addressObj.is_default = 1
		    } else {
		        this.addressObj.is_default = 0
		    }
		},
		manageAddress() {
			console.log('管理收货地址');
			// 跳转到收货地址管理页面
			uni.navigateTo({
				url: '/pages/address_list/address_list'
			});
		},
        // 定时器完成
        countDownFinish() {
            this.canSendSms = true
        },
        // 修改密码
        showPwdPop() {
            if (!this.userInfo.mobile) {
                this.$toast({
                    title: '请绑定手机后再设置密码'
                })
                return
            }
            this.smsCode = ''
            this.smsType = SMSType.FINDPWD
            this.showPwd = true
        },
        $forgetPwd() {
            let { smsCode, pwd, confirmPwd } = this
            if (!smsCode) {
                this.$toast({
                    title: '请填写短信验证码'
                })
                return
            }
            if (!pwd) {
                this.$toast({
                    title: '请输入新密码'
                })
                return
            }
            if (!confirmPwd) {
                this.$toast({
                    title: '再次输入新密码确认'
                })
                return
            }
            if (pwd != confirmPwd) {
                this.$toast({
                    title: '两次密码输入不一致'
                })
                return
            }
            let data = {
                mobile: this.userInfo.mobile,
                code: smsCode,
                password: pwd,
                repassword: confirmPwd
            }
            forgetPwd(data).then((res) => {
                if (res.code == 0) {
                    this.showPwd = false
                    this.$toast({
                        title: '设置密码成功'
                    })
                    this.$getUserInfo()
                }
            })
        },
        // end
        // 修改昵称
        changeName() {
            this.closeAllPopups(); // 先关闭所有其他弹窗
            this.tempNickname = this.userInfo.nickname;
            this.showNickName = true;
        },
		// 关闭所有弹窗
		  closeAllPopups() {
		    this.showBirthdayPicker = false;
		    this.showNickName = false;
		    this.showRegion = false;
		    this.showMobile = false;
		    this.showPicker = false;
		},

        async getPhoneNumber(e) {
            const { encryptedData, iv } = e.detail
            let data = {
                code: this.code,
                encrypted_data: encryptedData,
                iv
            }
            this.fieldType = FieldType.MOBILE
            if (encryptedData) {
                this.$changeUserMobileMP(data)
            }
        },
        $changeUserMobileMP(data) {
            changeUserMobile(data).then((res) => {
                if (res.code == 0) {
                    this.$toast({
                        title: res.msg
                    })
                    this.$getUserInfo()
                }
                // #ifdef MP-WEIXIN
                getWxCode().then((res) => {
                    this.code = res
                })
                // #endif
            })
        },
        uploadImage(path) {
            uni.showLoading({
                title: '正在上传中...',
                mask: true
            })
            uploadFile(path)
                .then((res) => {
                    uni.hideLoading()
                    this.$setUserInfo(res.url)
                })
                .catch(() => {
                    uni.hideLoading()
                    this.$toast({
                        title: '上传失败'
                    })
                })
        }
    },
    onLoad() {
        this.$getUserInfo()
        // #ifdef MP-WEIXIN
        getWxCode().then((res) => {
            this.code = res
        })
        // #endif
        // 监听从裁剪页发布的事件，获得裁剪结果
        uni.$on('uAvatarCropper', (path) => {
            console.log(path)
            this.uploadImage(path)
        })
        this.getUserProfile = trottle(this.getUserProfile, 500, this)
    },
    onUnload() {
        uni.$off('uAvatarCropper')
    },
    computed: {
        ...mapState(['token']),
        ...mapGetters(['appConfig'])
    }
}
</script>

<style lang="scss">
/* 最外层容器 - 仅作为布局容器 */
.page-container {
  position: relative;
  min-height: 100vh;
  background-color: #f7f7f7; /* 添加背景色避免透明穿透 */
}

/* 内容区域样式 */
.user-profile-container {
  .user-profile {
      border-top-left-radius: 28rpx;
      border-top-right-radius: 28rpx;
  	
      .user-avatar-box {
          padding: 30rpx;
          background-color: white;
          border-top-left-radius: 28rpx;
          border-top-right-radius: 28rpx;
  	
          .user-avatar {
              width: 120rpx;
              height: 120rpx;
              border-radius: 50%;
          }
      }
  	
      .row-info {
          padding: 30rpx 20rpx;
          background-color: white;
  	
          .label {
              width: 180rpx;
          }
  	
          .bd-btn {
              padding: 8rpx 24rpx;
              border: 1px solid $-color-primary;
              color: $-color-primary;
          }
      }
  	
      .license {
          margin-top: 80rpx;
          color: #a7a7a7;
          text-align: center;
      }
  	
      .bdb-line {
          border-bottom: 1rpx solid #e5e5e5;
      }
  	
      .save-btn {
          margin-top: 40rpx;
          height: 88rpx;
          margin-left: 54rpx;
          margin-right: 54rpx;
          border-radius: 10rpx;
          box-sizing: border-box;
      }
  	
      .updata-btn {
          margin: 0 30rpx;
          margin-top: 40rpx;
          background-color: #0cc267;
      }
  }
  
}

/* 弹窗全局样式 - 移到最外层 */
.u-popup__content {
  border-radius: 28rpx !important;
  overflow: hidden !important;
}

/* 生日选择器全局样式 */
.u-datetime-picker {
  z-index: 1050 !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
}

/* 昵称弹窗特殊样式 */
.modify-container {
  width: 580rpx;
  padding: 40rpx 30rpx;
  box-sizing: border-box;
  
  .title {
    padding: 26rpx 0;
    text-align: center;
    font-weight: bold;
  }
  
  input {
    height: 80rpx;
    padding: 0 20rpx;
    border: 1rpx solid #eee;
    border-radius: 8rpx;
  }
}

/* 禁用输入框样式修复 */
input[disabled] {
  background: transparent !important;
  -webkit-text-fill-color: inherit !important;
  color: inherit !important; /* 添加这行确保颜色继承 */
  opacity: 1 !important;
}

/* 弹窗蒙层增强 */
.u-popup__mask {
  background-color: rgba(0, 0, 0, 0.6) !important;
  backdrop-filter: blur(4rpx); /* 可选：添加模糊效果 */
}
	
</style>
