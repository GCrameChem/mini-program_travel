<!-- FIXME:修改逻辑，通过状态直接控制显示哪种按钮（做个动态样式模板） -->

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
			<!-- 暂时没有开发一个订单多个商品的功能 -->
          <!-- <order-goods
            :list="item.order_goods"
            :order_type="item.orderStatus"
          ></order-goods> -->
		  <order-goods
		    :list="item.activityId"
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
        <view
          class="order-footer row"
          v-if="
            item.pickup_btn ||
            item.cancel_btn ||
            item.delivery_btn ||
            item.take_btn ||
            item.del_btn ||
            item.pay_btn ||
            item.comment_btn
          "
        >
		  <!-- 取消订单相关 -->
          <view style="flex: 1">
            <view
              class="primary sm row"
              style="line-height: 26rpx"
              v-if="getCancelTime(item.order_cancel_time) > 0"
              ><u-count-down
                separator="zh"
                :timestamp="getCancelTime(item.order_cancel_time)"
                separator-color="#FF2C3C"
                color="#FF2C3C"
                :separator-size="26"
                :font-size="26"
                bg-color="transparent"
                @end="reflesh"
              ></u-count-down
            ></view>      
		  </view>
          <view v-if="item.cancel_btn">
            <button
              size="sm"
              class="plain br60 lighter"
              hover-class="none"
              @tap.stop="cancelOrder(item.id)"
            >
              取消订单
            </button>
          </view>
          <view
            v-if="item.delivery_btn"
            @tap.stop="
              goPage(
                '/bundle/pages/goods_logistics/goods_logistics?id=' + item.id
              )
            "
          >
            <button size="sm" class="btn plain br60 lighter" hover-class="none">
              查看物流
            </button>
          </view>
          <view v-if="item.del_btn">
            <button
              size="sm"
              class="btn plain br60 lighter"
              hover-class="none"
              @tap.stop="delOrder(item.id)"
            >
              删除订单
            </button>
          </view>
          <view v-if="item.pay_btn" class="ml20">
            <button
              size="sm"
              class="btn bg-primary br60 white"
              @tap.stop="payNow(item.id)"
            >
              立即付款
            </button>
          </view>
          <view v-if="item.comment_btn" class="ml20">
            <button
              size="sm"
              hover-class="none"
              class="btn plain btn br60 primary red"
            >
              去评价
            </button>
          </view>
          <view v-if="item.pickup_btn" class="ml20">
            <button
              size="sm"
              hover-class="none"
              class="btn plain btn br60 primary red"
            >
              查看提货码
            </button>
          </view>
          <view v-if="item.take_btn" class="ml20">
            <button
              size="sm"
              class="btn plain br60 primary red"
              hover-class="none"
              @tap.stop="comfirmOrder(item.id, item.pay_way)"
            >
              确认收货
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
import { page } from "@/utils/tools";
export default {
  data() {
    return {
      page: 1,
	  pageSize:6,
	  userInfo:this.userInfo,
	  // 测试时使用
	  //userId: userInfo.userId,
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

    delOrder(id) {
      this.orderId = id;
      this.type = 1;
      this.$nextTick(() => {
        this.orderDialog();
      });
    },
    // 小程序确认收货
    comfirmReceive(transaction_id) {
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
    querycomfirmReceive(id) {
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
    comfirmOrder(id, pay_way) {
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
            await this.comfirmReceive(data.transaction_id);
            await this.querycomfirmReceive(this.orderId);
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
		console.log("正在调用：getOrderListFun()");
		// BUG: 分页调用函数无法正常加载
		// const data = await page(getOrderList, page, orderList, status, {
		// 	page: this.page,
		// 	pageSize:this.pageSize,
		// 	userId: this.userId,
		// 	//orderStatus: all,
		// });
		// if (!data) return;
		// this.page = data.page;
		// this.orderList = data.dataList;
		// this.status = data.status;
		// HACK:直接请求
		const data = await getOrderList({
			page: this.page,
			pageSize: this.pageSize,
			userId: this.userId,
		});
		if (!data) return;
		  this.orderList = data.data.records;
		  // 此处直接定义为返回完全
		  this.status = loadingType.FINISHED;
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
    border-radius: 10rpx;

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

      .plain {
        border: 1px solid #bbbbbb;

        &.red {
          border-color: $-color-primary;
        }
      }
    }
  }
}
</style>
