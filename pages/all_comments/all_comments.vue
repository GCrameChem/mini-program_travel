<template>
	<view class="all_comments">
		<view class="header bg-white" v-if="!isEmpty">
		    <view class="title xs">
		        <text class="lighter mr10">商品好评率</text>
		        <text class="primary">{{ percent }}</text>
		    </view>
		    <view class="tab row">
		        <view
		            :class="'tab-item xs mr10 br60 mb20 ' + (type === 'all' ? 'bg-primary white' : 'common-bg')"
		            :data-id="'all'"
		            @tap="onChangType"
		        >
		            全部
		        </view>
		
		        <block v-for="(item, index) in categoryList" :key="index">
		            <view
		                :class="'tab-item xs mr10 br60 mb20 ' + (type === item.reviewAttributes ? 'bg-primary white' : 'common-bg')"
		                :data-id="item.reviewAttributes"
		                @tap="onChangType"
		                v-if="item.count"
		            >
		                {{ item.reviewAttributes }}({{ item.count }})
		            </view>
		        </block>
		    </view>
		</view>

		<!-- <view class="header bg-white" v-if="!isEmpty">
			<view class="title xs">
				<text class="lighter mr10">商品好评率</text>
				<text class="primary">{{ percent }}</text>
			</view>
			<view class="tab row">
				<block v-for="(item, index) in categoryList" :key="index">
					<view :class="'tab-item xs mr10  br60 mb20 ' + (type == item.reviewAttributes ? 'bg-primary white' : 'common-bg')"
						:data-id="item.reviewAttributes" @tap="onChangType" v-if="item.count">
						{{ item.reviewAttributes }}({{ item.count }})
					</view>
				</block>
			</view>
		</view> -->
		
		<view class="main bg-white">
			<view class="evaluation-list">
				<view v-for="(item, index) in commentList" :key="index" class="evaluation-item">
					<!-- 用户信息 -->
					<view class="user-info row">
						<image class="avatar mr20" :src="item.avatar"></image>
						<view class="user-name md mr10">{{ item.nickname }}</view>
						<u-rate disabled size="26rpx" color="#FF2C3C" v-model="item.rating"></u-rate>
					</view>
					
					<!-- 评论时间 -->
					<view class="muted xs mt10">
						<text class="mr20">{{ item.createTime }}</text>
					</view>
					
					<!-- 评论内容 -->
					<view v-if="item.commentContent" class="dec mt20">{{ item.commentContent }}</view>
					
					<!-- 评论图片 -->
					<view class="img mt20 row" style="flex-wrap: wrap" v-if="item.imageUrlList.length">
						<view v-for="(imgitem, imgindex) in item.imageUrlList" :key="imgindex" class="img-item mr10 mb20" :data-current="imgitem" :data-uri="item.imageUrlList" @tap="previewImage">
							<custom-image width="160rpx" fit="cover" height="160rpx" radius="6rpx" lazy-load class="goods-img" :src="imgitem" />
						</view>
					</view>
					
					<!-- 点赞区域 -->
					<view class="like-area row mt10">
						<view class="like-button row" :class="{ liked: item.isLike }" @tap="onLikeComment(item.reviewId, index)">
							<image class="like-icon" :src="item.isLike ? '/static/images/icons/full_like.png' : '/static/images/icons/empty_like.png'" />
							<text class="like-count ml10">{{ item.likesCount }}</text> <!-- 显示总点赞数 -->
						</view>
					</view>
		
					<!-- 回复情况：显示二级评论 -->
					<view v-if="item.replies && item.replies.length" class="replies-container">
						<view v-for="(reply, replyIndex) in item.replies" :key="replyIndex" class="reply-item">
							<!-- 回复者的信息 -->
							<view class="user-info row">
								<image class="avatar mr20" :src="reply.avatar"></image>
								<view class="user-name md mr10">{{ reply.nickname }}</view>
								<u-rate disabled size="20rpx" color="#FF2C3C" v-model="reply.rating"></u-rate>
							</view>
							<view class="muted xs mt10">
								<text class="mr20">{{ reply.createTime }}</text>
							</view>
							
							<!-- 回复内容 -->
							<view class="dec mt10">{{ reply.commentContent }}</view>
							
							<!-- 回复图片 -->
							<view class="img mt10 row" style="flex-wrap: wrap" v-if="reply.imageUrlList && reply.imageUrlList.length">
								<view v-for="(imgitem, imgindex) in reply.imageUrlList" :key="imgindex" class="img-item mr10 mb20" :data-current="imgitem" :data-uri="reply.imageUrlList" @tap="previewImage">
									<custom-image width="160rpx" fit="cover" height="160rpx" radius="6rpx" lazy-load class="goods-img" :src="imgitem" />
								</view>
							</view>
							
							<!-- 回复的点赞情况 -->
							<view class="like-area row mt10">
								<view class="like-button row" :class="{ liked: reply.isLike }" 
									  @tap="onLikeComment(reply.reviewId, index, true, replyIndex)">
									<image class="like-icon" :src="reply.isLike ? '/static/images/icons/full_like.png' : '/static/images/icons/empty_like.png'" />
									<text class="like-count ml10">{{ reply.likesCount }}</text> <!-- 显示总点赞数 -->
								</view>
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
            type: 'all',
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
    onShareAppMessage: function () {},
	
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
		    let { id } = e.currentTarget.dataset;
		
		    // 如果点击的是“全部”，则设置type为'全部'
		    if (id === 'all') {
		        this.type = 'all';  // 选择全部评论
		    } else {
		        // 否则选择特定的reviewAttributes
		        if (id === this.type) return;
		        this.type = id;
		    }
		
		    // 重置评论分页信息和状态
		    this.page = 1;
		    this.commentList = [];
		    this.status = loadingType.LOADING;
		
		    // 获取评论列表
		    this.$nextTick(() => this.getCommentListFun());
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
	       let { page, status, commentList, type } = this;
	       if (status == loadingType.FINISHED) return;
	   
	       // 获取评论列表
	       getCommentList({
	           page: page,
	           pageSize: this.pageSize,
	           activityId: this.id,
	           reviewAttributes: this.type,
	           //userId:, // 如果需要可以加上条件
	           //reviewID:, // 如果需要可以加上条件
	       }).then((res) => {
	           if (res.code == 0) {
	               let { records, total } = res.data;
	   
	               // 分别处理一级评论和二级评论
	               let primaryComments = [];
	               let secondaryComments = [];
	   
	               records.forEach((item) => {
	                   if (item.isSecondaryReview) {
	                       // 如果是二级评论，将其放入 secondaryComments
	                       secondaryComments.push(item);
	                   } else {
	                       // 如果是一级评论，将其放入 primaryComments
	                       primaryComments.push(item);
	                   }
	               });
	   
	               // 将一级评论赋值给 commentList
	               commentList.push(...primaryComments);
				   console.log("commentList", commentList);
	   
	               // 为每个一级评论查找并关联相应的二级评论
	               primaryComments.forEach((primary) => {
	                   // 查找并关联所有二级评论
	                   primary.replies = secondaryComments.filter(
	                       (secondary) => secondary.primaryReviewId === primary.reviewId
	                   );
	               });
	   
	               this.commentList = commentList;
				   console.log("commentList", commentList);
	               this.page++;
	   
	               // 查询每个评论的点赞状态
	               this.commentList.forEach((item, index) => {
	                   this.checkIfLiked(item.reviewId, index); // 查询每条评论是否已点赞
	               });
	   
	               this.$nextTick(() => {
	                   if (total--) {
	                       this.status = loadingType.FINISHED;
	                   }
	   
	                   if (total == 0) {
	                       this.status = loadingType.EMPTY;
	                   } else {
	                       console.log('commentList false');
	                       this.isEmpty = false;
	                   }
	               });
	           }
	       });
	   },
		
		checkIfLiked(reviewId, index) {
			// 正式登录后使用
		    const userId = this.userId;
		    getCommentLike({ reviewId, userId }).then((res) => {
		        if (res.code === 0) {
		            //this.commentList[index].isLike = res.data.isLike;  // 更新点赞状态
					this.$set(this.commentList, index, { ...this.commentList[index], isLike: res.data.isLike });
					//console.log("首次查询",this.commentList[index].reviewId,this.commentList[index].isLike);
		        }
		    });
		},
		// 点赞情况
		onLikeComment(reviewId, index, isReply = false, replyIndex = null) {
		    // 正式登录后使用
		    const userId = this.userId;
		
		    // 查询用户是否已经点赞
		    getCommentLike({ reviewId, userId }).then((res) => {
		        if (res.code === 0) {
		            const hasLiked = res.data.isLike;
		            console.log("查询点赞中");
		
		            if (hasLiked) {
		                console.log("取消点赞！", reviewId);
		                // 取消点赞操作
		                addCommentLike({ reviewId, userId, likeAction: 'remove' }).then((likeRes) => {
		                    if (likeRes.code === 0) {
		                        if (isReply) {
		                            // 取消点赞二级评论
		                            this.commentList[index].replies[replyIndex].likesCount -= 1;
		                            this.commentList[index].replies[replyIndex].isLike = false;
		                        } else {
		                            // 取消点赞一级评论
		                            this.commentList[index].likesCount -= 1;
		                            this.commentList[index].isLike = false;
		                        }
		                    } else {
		                        uni.showToast({ title: '取消点赞失败，请稍后再试', icon: 'none' });
		                    }
		                });
		            } else {
		                console.log("点赞！", reviewId);
		                // 点赞操作
		                addCommentLike({ reviewId, userId, likeAction: 'add' }).then((likeRes) => {
		                    if (likeRes.code === 0) {
		                        if (isReply) {
		                            // 点赞二级评论
		                            this.commentList[index].replies[replyIndex].likesCount += 1;
		                            this.commentList[index].replies[replyIndex].isLike = true;
		                        } else {
		                            // 点赞一级评论
		                            this.commentList[index].likesCount += 1;
		                            this.commentList[index].isLike = true;
		                        }
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
	            padding: 10rpx;
	            &:not(:last-of-type) {
	                border-bottom: $-solid-border;
	            }
	            .avatar {
	                width: 60rpx;
	                height: 60rpx;
	                border-radius: 50%;
	            }
	            .like-area {
	                display: flex;
	                justify-content: flex-end;
	                padding-right: 15rpx;
	            }
	            
	            .like-button {
	                display: flex;
	                align-items: center;
	                justify-content: flex-start;
	            }
	            
	            .like-icon {
	                width: 24rpx;
	                height: 24rpx;
	            }
	            
	            .like-count {
	                font-size: 14rpx;
	                margin-left: 10rpx;
	            }
	
	            .seller-recall-container {
	                padding: 24rpx 20rpx;
	                border-radius: 12rpx;
	            }
	            .like-button.liked .like-count {
	                color: #FF2C3C;
	            }
	        }
	        
	        /* 一级评论图片 */
	        .evaluation-item .img {
	            display: flex;
	            flex-wrap: wrap;
	            justify-content: flex-start;  // 左对齐，避免中间空隙过大
	            gap: 10rpx;  // 设置图片之间的间隔
	            padding-left: 20rpx;  // 增加左边的间距，确保图片离左边更远
	        }
	
	        /* 回复区域的样式 */
	        .replies-container {
	            margin-left: 15rpx; /* 为二级评论设置缩进 */
	            padding-left: 5rpx;
	            margin-top: 15rpx;
	            border-left: 2rpx solid #ddd; /* 增加左边的边框来表示层级 */
	            background-color: #f9f9f9;
	        }
	
	        .reply-item {
	            padding: 15rpx;
	            background-color: #fff;
	            border-radius: 10rpx;
	            margin-bottom: 15rpx;
	        }
	
	        .dec {
	            font-size: 14rpx;
	            color: #333;
	            margin-top: 10rpx;
	        }
	
	        .img {
	            display: flex;
	            flex-wrap: wrap;
	            justify-content: flex-start;  // 左对齐，避免中间空隙过大
	            gap: 10rpx;  // 设置图片之间的间隔
	        }
	        
	        .img-item {
	            margin-bottom: 20rpx;  // 图片下方的间隙
	        }
	    }
	}


    
}
</style>
