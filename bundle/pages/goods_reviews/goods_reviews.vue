<template>
    <view class="goods-reviews">
        <order-goods :list="goods"></order-goods>
        <view class="goods-evaluate row">
            <view class="label">商品评价</view>
            <u-rate
                name="goodsRate"
                :count="5"
                :size="42"
                active-color="#FF2C3C"
                v-model="goodsRate"
                @change="goodsRateChange"
            />
            <view
                :class="'desc ' + (goodsRate <= 2 ? 'muted' : 'primary') + ' '"
                v-show="!(goodsRate == 0)"
            >
                {{ goodsRateDesc }}
            </view>
        </view>
        <view class="rate bg-white">
            <view class="item row mb20">
                <view class="label">描述相符</view>
                <u-rate name="descRate" :size="42" active-color="#FF2C3C" v-model="descRate" />
            </view>
            <view class="item row mb20">
                <view class="label">服务态度</view>
                <u-rate name="serverRate" :size="42" active-color="#FF2C3C" v-model="serverRate" />
            </view>
            <view class="item row">
                <view class="label">配送服务</view>
                <u-rate
                    name="deliveryRate"
                    :size="42"
                    active-color="#FF2C3C"
                    v-model="deliveryRate"
                />
            </view>
        </view>
        <view class="goods-dec bg-white mt20">
            <view class="title mb20 md bold">商品描述</view>
            <view class="textarea mb20" style="background-color: #f5f5f5">
                <u-input
                    v-model="comment"
                    placeholder="宝贝收到还满意吗，说说你的使用心得。分享给想买的他们吧！！"
                    type="textarea"
                    :clearable="false"
                    :height="240"
                >
                </u-input>
            </view>
            <uploader
                preview-size="180rpx"
                :mutiple="true"
                :maxUpload="5"
                :file-list="fileList"
                @after-read="afterRead"
                :deletable="true"
                @delete="onDelete"
            />
        </view>
        <button form-type="submit" class="btn br60" type="primary" size="lg" @tap="onSubmit">
            立即评价
        </button>
    </view>
</template>

<script>
import { baseURL } from '@/config/app.js'
import { goodsComment, getCommentInfo } from '@/api/user'
import { uploadFile } from '@/utils/tools.js'
export default {
    data() {
        return {
            goodsRate: 0,
            descRate: 0,
            serverRate: 0,
            deliveryRate: 0,
            goodsRateDesc: '',
            fileList: [],
            goods: [],
            comment: '',
            type: ''
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.id = options.id
        this.getCommentInfoFun()
    },

    methods: {
        onChange(e) {
            this.type = e.value
        },

        goodsRateChange: function (e) {
            let goodsRateDesc = ''

            if (e <= 2) {
                goodsRateDesc = '差评'
            } else if (e == 3) {
                goodsRateDesc = '中评'
            } else {
                goodsRateDesc = '好评'
            }
            this.goodsRateDesc = goodsRateDesc
        },

        onSubmit() {
            let { goodsRate, fileList, comment, deliveryRate, descRate, serverRate } = this
            let image = fileList.map((item) => item.base_url)
            if (!goodsRate)
                return this.$toast({
                    title: '请对商品进行评分'
                })
            // if (!descRate)
            //     return this.$toast({
            //         title: '请对描述相符进行评分'
            //     })
            // if (!serverRate)
            //     return this.$toast({
            //         title: '请对服务态度进行评分'
            //     })
            // if (!deliveryRate)
            //     return this.$toast({
            //         title: '请对配送服务进行评分'
            //     })
			
			//activityId:parseInt(this.id),
			
            goodsComment({
                //userId: this.userId,
				activityId:this.activity,
                rating: goodsRate,
				isSecondaryReview:true,
				primaryReviewId:0,
				location:"",
                //service_comment: serverRate,
                //express_comment: deliveryRate,
                //description_comment: descRate,
                commentContent:this.comment,
				reviewAttributes:"默认",
                imageUrlList:image
            }).then((res) => {
                if (res.code == 0) {
                    this.$toast(
                        {
                            title: '评价成功'
                        },
                        {
                            tab: 5,
                            url: '/bundle/pages/goods_comment_list/goods_comment_list?type=1'
                        }
                    )
                }
            })
        },

        onInput(e) {
            this.comment = e.detail.value
        },

        getCommentInfoFun() {
            getCommentInfo({
                id: this.id
            }).then((res) => {
                if (res.code == 0) {
                    this.goods.push(res.data)
                }
            })
        },

        afterRead(e) {
            const file = e
            uni.showLoading({
                title: '正在上传中...',
                mask: true
            })
            file.map((item) => {
                uploadFile(item.path)
                    .then((res) => {
                        uni.hideLoading()
                        this.fileList.push(res)
                    })
                    .catch(() => {
                        uni.hideLoading()
                        this.$toast({
                            title: '上传失败'
                        })
                    })
            })
        },

        onDelete(index) {
            this.fileList.splice(index, 1)
        }
    }
}

</script>
<style>
.goods-reviews {
    padding: 20rpx 0 40rpx;
}
.goods-reviews .rate {
    padding: 20rpx 30rpx;
}
.goods-reviews .rate .label {
    width: 170rpx;
}
.goods-reviews .goods-dec {
    padding: 30rpx;
}
.goods-reviews .goods-dec .textarea {
    height: 240rpx;
    border-radius: 10rpx;
}
.goods-reviews .goods-dec .textarea textarea {
    width: 100%;
    height: 100%;
    padding: 20rpx;
    box-sizing: border-box;
}
.goods-reviews .btn {
    width: 698rpx;
    margin: 30rpx 26rpx 0;
}

.rate .item .desc {
    margin-left: 30rpx;
}

.goods-reviews .goods-evaluate {
    padding: 20rpx 30rpx;
    background-color: white;
    border: 1rpx solid #f2f2f2;
}

.goods-reviews .goods-evaluate .desc {
    margin-left: 30rpx;
}

.goods-reviews .goods-evaluate .label {
    width: 170rpx;
}
</style>
