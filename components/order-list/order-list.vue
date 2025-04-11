<template>
  <view>
    <view class="order-list">
      <navigator
        v-for="(item, index) in orderList"
        :key="index"
        hover-class="none"
        class="order-item bg-white mt20"
        :url="'/pages/order_details/order_details?id=' + item.orderId"
      >
        <view class="order-header row-between">
          <view class="row">
            <!-- <view v-if="item.deliver_type == 2" class="mr10">
              <u-tag
                text="自提"
                size="mini"
                type="primary"
                mode="dark"
                bg-color="#0cc21e"
              />
            </view>
            <view v-if="item.order_type == 1" class="mr10">
              <u-tag text="秒杀" size="mini" type="primary" mode="plain" />
            </view>
            <view v-if="item.order_type == 2" class="mr10">
              <u-tag text="拼团" size="mini" type="primary" mode="plain" />
            </view>
            <view v-if="item.order_type == 3" class="mr10">
              <u-tag text="砍价" size="mini" type="primary" mode="plain" />
            </view> -->
            订单编号（暂为orderId）：{{ item.orderId }}
          </view>
          <!-- <view :class="item.order_status == 5 ? 'muted' : 'primary'">{{
            item.order_status_desc
          }}</view> -->
        </view>
        <view class="order-con">
		  <order-goods
		    :list="item.activityList"
		    :order_type="item.orderStatus"
		  ></order-goods>
          <view class="all-price row-end">
            <!-- <text class="muted xs"
              >共{{ goodCount(item.order_goods) }}件商品，总金额：</text
            > -->
			<text class="muted xs"
			  >共1件商品，总金额：</text
			>
            <price-format
              :subscript-size="30"
              :first-size="30"
              :second-size="30"
              :price="item.orderAmount"
            ></price-format>
          </view>
        </view>
        <view class="order-footer row">
			<view v-if="shouldShowCancelButton(item.orderStatus)">
				<button size="sm" class="plain br60 lighter" @tap.stop="cancelOrder(item.orderId)">
				  取消订单
				</button>
			</view>
			<view v-if="shouldShowPayButton(item.orderStatus)">
				<button size="sm" class="btn bg-primary br60 white" @tap.stop="payNow(item.orderId)">
				  立即付款
				</button>
			</view>
			<view v-if="shouldShowCommentButton(item.orderStatus)">
				<button size="sm" hover-class="none" class="btn plain btn br60 primary red">
				  去评价
				</button>
			</view>
			<view v-if="shouldShowDeliveryButton(item.orderStatus)">
				<button size="sm" class="btn plain br60 lighter" @tap.stop="goPage('/bundle/pages/goods_logistics/goods_logistics?id=' + item.orderId)">
				  查看物流
				</button>
			</view>
			<view v-if="shouldShowPickupButton(item.orderStatus)">
				<button size="sm" class="btn plain btn br60 primary red">
				  查看提货码
				</button>
			</view>
			<view v-if="shouldShowTakeButton(item.orderStatus)">
				<button size="sm" class="btn plain br60 primary red" @tap.stop="confirmOrder(item.orderId)">
				  确认收货
				</button>
			</view>
			<view v-if="shouldShowDelButton(item.orderStatus)">
				<button size="sm" class="btn plain br60 lighter" @tap.stop="delOrder(item.orderId)">
				  删除订单
				</button>
			</view>
		</view>
		</navigator>
        <loading-footer :status="status" :slot-empty="true" @refresh="reload">
			<view slot="empty" class="column-center" style="padding-top: 200rpx">
			  <image class="img-null" src="/static/images/goods_null.png"></image>
			  <text class="lighter">暂无订单</text>
			</view>
        </loading-footer>
    </view>
    <order-dialog
      ref="orderDialog"
      :order-id="orderId"
      :type="type"
      @refresh="reflesh"
    ></order-dialog>
    <loading-view
      v-if="showLoading"
      background-color="transparent"
      :size="50"
    ></loading-view>
  </view>
</template>

<script>
import {
  getOrderList,
  cancelOrder,
  delOrder,
  confirmOrder,
  getwxReceiveDetail,
  getwechatSyncCheck,
} from "@/api/order";
import { compareWeChatVersion } from "@/utils/tools";
import { prepay } from "@/api/app";
import { loadingType } from "@/utils/type";
import { mapGetters } from 'vuex';
import { wxpay, alipay } from "@/utils/pay";
import { pageLoad } from "@/utils/tools";
export default {
  data() {
    return {
	  page: 1,
	  pageSize: 10, // 每页条数
	  //userInfo:this.userInfo,
	  // IMPORTANT: 暂用测试数据
	  userId: 1,
      orderList: [],
	  order_goods:[],
      status: loadingType.LOADING,
      showCancel: false,
      type: 0,
      orderId: "",
      showLoading: false,
      pay_way: "",
    };
  },

  components: {},
  props: {
    orderType: {
      type: String,
    },
  },
  computed: {
        ...mapGetters(['userInfo']),
  },
  created: function () {
    uni.$on("refreshorder", () => {
      this.reflesh();
    });
    uni.$on("payment", (params) => {
      if (params.result) {
        this.reflesh();
        uni.navigateBack();
        setTimeout(() => this.$toast({ title: "支付成功" }), 0.5 * 1000);
      }
    });
  },
  beforeMount: function () {
	console.log("ready to run getOrderListFun()");
    this.getOrderListFun();
  },
  destroyed: function () {
    uni.$off(["payment", "refreshorder"]);
  },
  methods: {
    reflesh() {
      this.page = 1;
	  this.pageSize = 10;
      this.orderList = [];
      this.status = loadingType.LOADING;
      this.type = 0;
      this.getOrderListFun();
    },

    reload() {
      this.status = loadingType.LOADING;
      this.getOrderListFun();
    },

    orderDialog() {
      this.$refs.orderDialog.open();
    },
	// 根据订单状态确定是否显示取消按钮
	shouldShowCancelButton(orderStatus) {
	  return orderStatus === 'pay' || orderStatus === 'deliver';
	},

	// 根据订单状态确定是否显示付款按钮
	shouldShowPayButton(orderStatus) {
	  return orderStatus === 'pay';
	},

	// 根据订单状态确定是否显示去评论按钮
	shouldShowCommentButton(orderStatus) {
	  return orderStatus === 'review';
	},

	// 根据订单状态确定是否显示查看物流按钮
	shouldShowDeliveryButton(orderStatus) {
	  return orderStatus === 'confirm'||orderStatus == 'deliver';
	},

	// 根据订单状态确定是否显示提货码按钮
	shouldShowPickupButton(orderStatus) {
	  return orderStatus == 'confirm';
	},
	
	// 根据订单状态确定是否显示确认收货按钮
	shouldShowTakeButton(orderStatus) {
	  return orderStatus === 'confirm';
	},
	
	// 根据订单状态确定是否显示删除按钮
	shouldShowDelButton(orderStatus) {
	  return orderStatus == 'refund';
	},

    delOrder(id) {
      this.orderId = id;
      this.type = 1;
      this.$nextTick(() => {
        this.orderDialog();
      });
    },
    // 小程序确认收货
    confirmReceive(transaction_id) {
      return new Promise((resolve, reject) => {
        wx.openBusinessView({
          businessType: "weappOrderConfirm",
          extraData: {
            transaction_id,
          },
          success({ extraData }) {
            if (extraData.status == "success") {
              resolve("确认收货");
            } else {
              resolve("取消收货");
            }
          },
          fail(err) {
            reject(err);
          },
        });
      });
    },
    //查询是否收货成功
    queryconfirmReceive(id) {
      return new Promise((resolve, reject) => {
        getwechatSyncCheck({ id })
          .then(({ data }) => {
            if (data.order.order_state === 4) {
              resolve("已确认收货");
            } else {
              reject("未确认收货");
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    confirmOrder(id, pay_way) {
      this.orderId = id;
      this.pay_way = pay_way;
      this.type = 2;
      this.$nextTick(async () => {
        // #ifdef MP-WEIXIN
        let res = {};
        if (this.pay_way === 1) {
          res = await getwechatSyncCheck({ id: this.orderId });
          console.log(res);
        }
        if (
          compareWeChatVersion("2.6.0") === 1 &&
          wx.openBusinessView &&
          this.pay_way === 1 &&
          res.data.order.order_state !== 1
        ) {
          try {
            const { data } = await getwxReceiveDetail({
              order_id: this.orderId,
            });
            await this.confirmReceive(data.transaction_id);
            await this.queryconfirmReceive(this.orderId);
            await confirmOrder(this.orderId);
          } catch (error) {
            console.log(error);
          }
          this.reflesh();
        } else {
          this.orderDialog();
        }
        // #endif

        // #ifndef MP-WEIXIN
        this.orderDialog();
        // #endif
      });
    },

    cancelOrder(id) {
      this.orderId = id;
      this.type = 0;
      this.$nextTick(() => {
        this.orderDialog();
      });
    },

    payNow(id) {
      // this.showLoading = true

      uni.navigateTo({
        url: `/pages/payment/payment?from=${"order"}&order_id=${id}`,
      });

      // prepay({
      // 	from: 'order',
      // 	order_id: id
      // }).then(res => {
      // 	let args = res.data;
      // 	this.showLoading = false
      // 	if (res.code == 0) {
      // 		wxpay(args).then((resPay) => {
      // 			if(resPay == 'success') {
      // 				this.$toast({
      // 					title: "支付成功"
      // 				})
      // 				uni.$emit("refreshorder")
      // 			}
      // 		})
      // 	}else if(res.code == 20001){
      // 		alipay(args).then((resPay) => {
      // 			if(resPay == 'success') {
      // 				this.$toast({
      // 					title: "支付成功"
      // 				})
      // 				uni.$emit("refreshorder")
      // 			}
      // 		})
      // 	}
      // });
    },
	async getOrderListFun() {
	  let { page, orderType, orderList, status } = this;

	  //console.log("正在调用：getOrderListFun()");
	  // 调用分页函数
	  console.log("userId",this.userId);
	  const data =  await pageLoad(getOrderList, page, orderList, status, {
	    pageSize: this.pageSize,
	    userId: this.userId,
		orderStatus: this.orderType
	  });
	  if (!data) return;
	  
	  this.page = data.page; // 更新页码
	  this.orderList = data.dataList; // 更新订单列表
	  this.status = data.status; // 更新加载状态
	},

    goPage(url) {
      uni.navigateTo({
        url,
      });
    },
    goodCount(goodLists) {
      console.log(goodLists);
      let count = 0;
      goodLists.forEach((item) => {
        count += item.goods_num;
      });
      return count;
    },
  },
  computed: {
    getOrderStatus() {
      return (status) => {
        let text = "";
        switch (status) {
          case 0:
            text = "待付款";
            break;
          case 1:
            //text = "待发货";
			text = "待收获";
            break;
          case 2:
            //text = "待收货";
			text = "待确认";
            break;
          case 3:
            // text = "已完成";
			text = "待评价";
            break;
          case 4:
			// text = "订单已关闭";
            text = "退款/售后";
		  case 5: 
			text = "订单已关闭";
            break;
        }
        return text;
      };
    },
    getCancelTime() {
      return (time) => time - Date.now() / 1000;
    },
  },
};
</script>
<style lang="scss">
.order-list {
  // min-height: calc(100vh - 80rpx);
  padding: 0 20rpx;
  overflow: hidden;

  .order-item {
    border-radius: 30rpx;

    .order-header {
      height: 80rpx;
      padding: 0 24rpx;
      border-bottom: 1px dotted #e5e5e5;
    }

    .all-price {
      text-align: right;
      padding: 0 24rpx 20rpx;
    }

    .order-footer {
      height: 100rpx;
      border-top: $-solid-border;
      padding: 0 24rpx;
      display: flex;            /* 使用flex布局 */
      justify-content: flex-end; /* 将按钮靠右对齐 */
      gap: 10rpx;               /* 设置按钮之间的间距 */
    }
    
    .plain {
      border: 1px solid #bbbbbb;
    
      &.red {
        border-color: $-color-primary;
      }
    }
    .button {
      font-size: 28rpx;
      border-radius: 30rpx;
    }
    

  }
}
</style>
