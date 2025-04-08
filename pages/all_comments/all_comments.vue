<template>
    <view>
        <view class="all_comments">
            <view class="header bg-white" v-if="!isEmpty">
                <view class="title xs">
                    <text class="lighter mr10">商品好评率</text>
                    <text class="primary">{{ percent }}</text>
                </view>
				<view class="tab row">
					<block v-for="(item, index) in categoryList" :key="index">
						<view
							:class="
								'tab-item xs mr10  br60 mb20 ' +
								(type == item.reviewAttributes ? 'bg-primary white' : 'common-bg')
							"
							:data-id="item.reviewAttributes"
							@tap="onChangType"
							v-if="item.count"
							>
							{{ item.reviewAttributes }}({{ item.count }})
						</view>
					</block>
				</view>
				
            
			</view>
            <view class="main bg-white">
                <view class="evaluation-list">
                    <view v-for="(item, index) in commentList" :key="index" class="evaluation-item">
                        <!-- 这里需要通过用户id查询用户头像和昵称数据 -->
                        <view class="user-info row">
                            <image class="avatar mr20" :src="item.avatar"></image>
                            <view class="user-name md mr10">{{ item.userId }}</view>
                            <u-rate disabled size="26rpx" color="#FF2C3C" v-model="item.rating"></u-rate>
                        </view>
                        <view class="muted xs mt10">
                            <text class="mr20">{{ item.createTime }}</text>
                        </view>
                        <view v-if="item.commentContent" class="dec mt20">{{ item.commentContent }}</view>
                        <view class="img mt20 row" style="flex-wrap: wrap" v-if="item.imageUrlList.length">
                            <view v-for="(imgitem, imgindex) in item.imageUrlList" :key="imgindex" class="img-item mr10 mb20" :data-current="imgitem" :data-uri="item.imageUrlList" @tap="previewImage">
                                <custom-image width="160rpx" fit="cover" height="160rpx" radius="6rpx" lazy-load class="goods-img" :src="imgitem" />
                            </view>
                        </view>
                    
                        <!-- 点赞情况 -->
                        <view class="like-area row mt10">
                            <view class="like-button row" :class="{ liked: item.isLike }" @tap="onLikeComment(item.reviewId, index)">
                                <image class="like-icon" :src="item.isLike ? '/static/images/icons/full_like.png' : '/static/images/icons/empty_like.png'" />
                                <text class="like-count ml10">{{ item.likesCount }}</text> <!-- 显示总点赞数 -->
                            </view>
                        </view>
                    
                        <!-- 回复情况 -->
                        <view class="seller-recall-container common-bg mt10" v-if="item.reply">
                            <view class="lighter nr" style="word-wrap: break-word">
                                商家回复：<span class="normal two-txt-cut">{{ item.reply }}</span>
                            </view>
                        </view>
                    </view>

				</view>
            </view>
        </view>
        <loading-footer :status="status" slotEmpty>
            <view slot="empty" class="column-center" style="padding-top: 200rpx">
                <image class="img-null" src="/static/images/goods_null.png"></image>
                <text class="lighter">暂无评价</text>
            </view>
        </loading-footer>
    </view>
</template>

<script>
import { getCommentList, getCommentCategory, addCommentLike, getCommentLike } from '../../api/store'
import { loadingType } from '../../utils/type'
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            status: loadingType.LOADING,
            page: 1,
			pageSize:'',
            type: '0',
            commentList: [],
            categoryList: [],
            percent: '暂未开发',
            isEmpty: true,
			// userId: this.userId,
			userId: 1
        }
    },

    components: {},
    props: {},

    
    onLoad: async function (options) {
        this.id = options.id;
        await this.getCommentCategoryFun();
        this.getCommentListFun();
		// console.log("页面加载完成");
    },
    onReady: function () {},
    
    onShow: function () {},

    onHide: function () {},

    onUnload: function () {},

    onPullDownRefresh: function () {},

    onReachBottom: function () {
        this.getCommentListFun()
    },

    
    // 用户点击右上角分享
    // onShareAppMessage: function () {},
	
	// 需要用户登录状态
	computed: {
	    ...mapGetters(['userInfo']),
	},
	mounted() {
	    this.commentList.forEach((item, index) => {
	        this.checkIfLiked(item.reviewId, index);
	    });
	},
	
    methods: {
        onChangType(e) {
            let { id } = e.currentTarget.dataset
            let { type } = this
            if (id == type) return
            this.type = id
            this.page = 1
            this.commentList = []
            this.status = loadingType.LOADING
            this.$nextTick(() => this.getCommentListFun())
        },

        getCommentCategoryFun() {
           return new Promise((resolve) => {
               const data = { activityId: this.id };
               //console.log("//// data before request:", data); // 应该显示 { activityId: 1 }
               getCommentCategory(data).then((res) => {
                   const {
                       code,
                       data: { records }
                   } = res;
                   if (code == 0) {
                       this.categoryList = records;
                       this.$nextTick(() => resolve());
                   }
               });
           });
       },

        getCommentListFun() {
            let { page, status, commentList, type } = this
            if (status == loadingType.FINISHED) return
            getCommentList({
				page: page,
				pageSize: this.pageSize,
                activityId: this.id,
				reviewAttributes: this.type,
				//userId:,
				//reviewID:,
            }).then((res) => {
                if (res.code == 0) {
                    let { records, total } = res.data;
                    commentList.push(...records);
                    this.commentList = commentList;
                    this.page++;
					
					// 查询每个评论的点赞状态
					this.commentList.forEach((item, index) => {
						this.checkIfLiked(item.reviewId, index);  // 查询每条评论是否已点赞
					});
					
                    this.$nextTick(() => {
                        if (total--) {
                            this.status = loadingType.FINISHED
                        }

                        if (total == 0) {
                            this.status = loadingType.EMPTY
                        } else {
                            console.log('commentList false')
                            this.isEmpty = false
                        }
                    })
                }
            })
        },
		
		checkIfLiked(reviewId, index) {
			// 正式登录后使用
		    const userId = this.userId;
		    getCommentLike({ reviewId, userId }).then((res) => {
		        if (res.code === 0) {
		            //this.commentList[index].isLike = res.data.isLike;  // 更新点赞状态
					this.$set(this.commentList, index, { ...this.commentList[index], isLike: res.data.isLike });
					console.log("首次查询",this.commentList[index].reviewId,this.commentList[index].isLike);
		        }
		    });
		},
		// 点赞情况
		
		onLikeComment(reviewId, index) {
			// 正式登录后使用
		    const userId = this.userId;
		
		    // 查询用户是否已经点赞
		    getCommentLike({ reviewId, userId }).then((res) => {
		        if (res.code === 0) {
		            const hasLiked = res.data.isLike;
					console.log("查询点赞中");
		            if (hasLiked) {
						console.log("取消点赞！",reviewId);
		                // 取消点赞操作
		                addCommentLike({ reviewId, userId, likeAction: 'remove' }).then((likeRes) => {
		                    if (likeRes.code === 0) {
		                        // 取消点赞成功
		                        this.commentList[index].likesCount -= 1;  // 点赞数减1
		                        this.commentList[index].isLike = false;  // 更新点赞状态
		                    } else {
		                        uni.showToast({ title: '取消点赞失败，请稍后再试', icon: 'none' });
		                    }
		                });
		            } else {
		                // 点赞操作
						console.log("点赞！",reviewId);
		                addCommentLike({ reviewId, userId, likeAction: 'add' }).then((likeRes) => {
		                    if (likeRes.code === 0) {
		                        // 点赞成功
		                        this.commentList[index].likesCount += 1;  // 点赞数加1
		                        this.commentList[index].isLike = true;  // 更新点赞状态
		                    } else {
		                        uni.showToast({ title: '点赞失败，请稍后再试', icon: 'none' });
		                    }
		                });
		            }
		        } else {
		            uni.showToast({ title: '查询点赞状态失败，请稍后再试', icon: 'none' });
		        }
		    });
		},
		
		previewImage(e) {
		    const { current, uri } = e.currentTarget.dataset
		    let urls = uri
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
.all_comments {
    padding-top: 20rpx;
    .header {
        .title {
            padding: 24rpx 26rpx;
            border-bottom: var(--border);
        }
        .tab {
            padding: 30rpx 0 10rpx 20rpx;
            flex-wrap: wrap;
            .tab-item {
                padding: 9rpx 29rpx;
            }
        }
    }

    .common-bg {
        background-color: #f5f5f5;
    }

    .main {
        .evaluation-list {
            .evaluation-item {
                padding: 20rpx;
                &:not(:last-of-type) {
                    border-bottom: $-solid-border;
                }
                .avatar {
                    width: 60rpx;
                    height: 60rpx;
                    border-radius: 50%;
                }
                .seller-recall-container {
                    padding: 24rpx 20rpx;
                    border-radius: 12rpx;
                }
				.like-button {
				    align-items: center;
				}
				.like-button.liked image {
				    filter: brightness(1.2);
				}
				.like-icon {
				    width: 24rpx;
				    height: 24rpx;
				}
				.like-count {
				    font-size: 24rpx;
				    color: #666;
				}
				.like-button.liked .like-count {
				    color: #FF2C3C;
				}
            }
        }
    }
}
</style>
