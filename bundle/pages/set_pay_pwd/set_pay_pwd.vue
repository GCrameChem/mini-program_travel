<template>
    <view class="set-pwd">
        <view class="input-container bg-white">
            <view class="input-item row" v-if="hasPayPwd">
                <view class="input-label md normal">原密码</view>
                <u-input
                    class="flex1"
                    type="password"
                    v-model="originPwd"
                    placeholder="请输入原来的转账密码"
                />
            </view>
            <view class="input-item row">
                <view class="input-label md normal">转账密码</view>
                <u-input
                    class="flex1"
                    type="password"
                    v-model="setPwd"
                    :placeholder="hasPayPwd ? '请输入新的转账密码' : '请输入转账密码'"
                />
            </view>
            <view class="input-item row">
                <view class="input-label md normal">确认密码</view>
                <u-input
                    class="flex1"
                    type="password"
                    v-model="confirmPwd"
                    placeholder="请再次确认密码"
                />
            </view>
            <navigator
                hover-class="none"
                url="/bundle/pages/forget_pay_pwd/forget_pay_pwd"
                class="row-end lighter xs mr20"
                v-if="hasPayPwd"
                >忘记原密码？</navigator
            >
            <button
                size="lg"
                type="primary"
                class="btn bg-primary white br60 row-center"
                @tap="setPasswordFun"
            >
                确认
            </button>
        </view>
    </view>
</template>

<script>
import { hasPayPassword, setPassword, changePayPassword } from '@/api/user'
export default {
    data() {
        return {
            hasPayPwd: false,
            setPwd: '',
            confirmPwd: '',
            originPwd: ''
        }
    },
    onLoad() {
        this.hasPayWord()
    },
    methods: {
        async setPasswordFun() {
            let { setPwd, confirmPwd, originPwd, hasPayPwd } = this
            if (hasPayPwd) {
                if (!originPwd) {
                    this.$toast({
                        title: '请输入原来的转账密码'
                    })
                    return
                }
            }
            if (!setPwd) {
                this.$toast({
                    title: '请输入新的转账密码'
                })
                return
            }
            if (!confirmPwd) {
                this.$toast({
                    title: '请填写确认密码'
                })
                return
            }
            if (setPwd != confirmPwd) {
                this.$toast({
                    title: '两次密码输入不一致'
                })
                return
            }
            if (setPwd.length < 4 || setPwd.length > 8) {
                this.$toast({
                    title: '请输入长度为4-8位的密码'
                })
                return
            }

            let data = {
                pay_password: setPwd
            }
            const { msg, code } = hasPayPwd
                ? await changePayPassword({
                      origin_pay_password: originPwd,
                      new_pay_password: setPwd
                  })
                : await setPassword(data)
            if (code == 0) {
                this.$toast(
                    {
                        title: msg
                    },
                    { tab: 3 }
                )
            }
        },
        hasPayWord() {
            hasPayPassword().then((res) => {
                if (res.code == 0) {
                    this.hasPayPwd = true
                }
            })
        }
    }
}
</script>

<style lang="scss">
.set-pwd {
    padding-top: 20rpx;

    .input-container {
        padding: 20rpx 0 100rpx;
        border-radius: 20rpx;

        .input-item {
            margin: 0 30rpx;
            height: 88rpx;
            margin-bottom: 30rpx;
            border-bottom: 1px solid #d7d7d7;

            .input-label {
                width: 180rpx;
                flex: none;
            }
        }

        .btn {
            margin: 80rpx 30rpx 0;
        }
    }
}
</style>
