<template>
    <!-- components/comment_list/comment_list.wxml -->
    <view height="calc(100vh - 80rpx)">
        <view class="comment-list">
            <view v-for="(item, index) in list" :key="index" class="comment-item bg-white mt20">
                <view class="xs muted ml20" style="padding-top: 20rpx" v-if="item.create_time"
                    >评价时间：{{ item.create_time }}</view
                >
                <navigator
                    class="comment-goods row"
                    :url="'/pages/goods_details/goods_details?id=' + item.goods_id"
                    hover-class="none"
                >
                    <custom-image
                        width="160rpx"
                        height="160rpx"
                        radius="6rpx"
                        lazy-load
                        :src="item.image"
                    />
                    <view class="goods-desc">
                        <view class="goods-name line2 nr">{{ item.goods_name }}</view>
                        <view class="row-between mt20" v-show="!(type == 2)">
                            <price-format
                                :price="item.goods_price"
                                :showSubscript="true"
                                :subscriptSize="26"
                                :firstSize="30"
                                :secondSize="30"
                            />
                            <view class="nr">x{{ item.goods_num }}</view>
                        </view>
                        <view v-show="!(type == 1)" class="row mt20">
                            <view class="sm mr10">评分</view>
                            <u-rate
                                :disabled="true"
                                v-model="item.goods_comment"
                                active-color="#FF2C3C"
                                :size="24"
                            />
                        </view>
                    </view>
                </navigator>
                <view
                    v-show="!(type == 2)"
                    class="evaluate-footer row-end"
                    @click="goCommentGoods(item)"
                >
                    <view class="btn row-center primary br60">评价商品</view>
                </view>
                <!-- 		<navigator v-show="!(type == 2)" class="evaluate-footer row-end" hover-class="none" :url="'/bundle/pages/goods_reviews/goods_reviews?id=' + item.id">
				<view class="btn row-center primary br60">评价商品</view>
			</navigator> -->
                <view v-show="!(type == 1 || !item.comment)" class="evaluate-footer">
                    <view class="preview-evaluate">{{ item.comment }}</view>
                </view>
                <view
                    v-show="item.comment_image && !(type == 1 || !item.comment_image.length)"
                    class="row wrap"
                    style="padding: 20rpx 10rpx"
                >
                    <view
                        v-for="(i, idx) in item.comment_image"
                        :key="idx"
                        class="comment-img"
                        :data-current="idx"
                        :data-uri="item"
                        @tap="previewImage"
                    >
                        <custom-image width="160rpx" height="160rpx" radius="6rpx" :src="i" />
                    </view>
                </view>
            </view>
        </view>
        <loading-footer :status="status" slotEmpty>
            <view class="data-null column-center" slot="empty">
                <image class="img-null" src="/static/images/news_null.png"></image>
                <text class="sm muted">暂无其他评价～</text>
            </view>
        </loading-footer>
    </view>
</template>

<script>
import { loadingType } from '../../utils/type'
import { getOrderCommentList } from '../../api/store'
import { pageLoad } from '@/utils/tools'

export default {
    data() {
        return {
            list: [],
            status: loadingType.LOADING,
            page: 1
        }
    },

    components: {},
    props: {
        type: {
            type: Number | String
        }
    },

    beforeMount() {
        console.log(this.type)
        this.getOrderCommentListFun()
    },

    methods: {
        getOrderCommentListFun() {
            let { page, type, status, list } = this

            pageLoad(getOrderCommentList, page, list, status, { type: type }).then((res) => {
                if (res) {
                    this.page = res.page
                    this.list = res.dataList
                    this.status = res.status
                }
            })
        },

        goCommentGoods({ id, del }) {
            if (+del) return
            uni.navigateTo({
                url: `/bundle/pages/goods_reviews/goods_reviews?id=${id}`
            })
        },

        goPage(e) {
            let { url } = e.currentTarget.dataset

            if (this.type == 1) {
                uni.navigateTo({
                    url: url
                })
            }
        },
        previewImage(e) {
            const { current, uri } = e.currentTarget.dataset
            let urls = [uri]
            uni.previewImage({
                current,
                // 当前显示图片的http链接
                urls // 需要预览的图片http链接列表
            })
        }
    }
}
</script>
<style lang="scss">
/* components/comment_list/comment_list.wxss */
.comment-list {
    .comment-goods {
        padding: 20rpx 24rpx;
        .goods-desc {
            margin-left: 24rpx;
            flex: 1;
        }
        .btn {
            padding: 6rpx 34rpx;
            border: 1px solid $-color-primary;
        }
    }
}

.comment-item {
    .comment-img {
        // &:not(:nth-last-of-type(4n + 1)) {
        //     margin-right: 20rpx;
        // }
        margin-right: 20rpx;
        margin-bottom: 20rpx;
    }
    .evaluate-footer {
        padding: 0 24rpx 28rpx;
        .btn {
            width: 178rpx;
            height: 52rpx;
            border: 1px solid $-color-primary;
        }
    }
}

.data-null {
    padding-top: 200rpx;
}

.evaluate-footer .preview-evaluate {
    background-color: #f6f6f6;
    padding: 20rpx;
    border-radius: 10rpx;
}
</style>
