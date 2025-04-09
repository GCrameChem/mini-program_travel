<template>
<view class="user-order">
	<navbar title="我的订单"></navbar>
    <tabs :active="active" @change="changeShow" :config="{itemWidth: 150}">
		<tab v-for="(item, index) in order" :key="index" :title="item.name" :name="item.type">
		    <order-list v-if="item.isShow" :order-type="item.type" :ref="'order' + item.type"></order-list>
		</tab>
    </tabs>
</view>
</template>

<script>

import { orderType } from '@/utils/type';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
	  // isLogin: this.isLogin || true,
      active: orderType.ALL,
      order: [{
        name: '全部',
        type: orderType.ALL,
        isShow: false
      }, {
        name: '待付款',
        type: orderType.PAY,
        isShow: false
      }, {
        name: '待收货',
        type: orderType.DELIVER,
        isShow: false
      }, {
        name: '待确认',
        type: orderType.COMFIRM,
        isShow: false
      }, {
        name: '待评价',
        type: orderType.REVIEW,
        isShow: false
      },{
        name: '退款/售后',
        type: orderType.REFUND,
        isShow: false
      }
	  ]
    };
  },
  computed: {
      ...mapGetters(['isLogin'])
  },
  components: {},
  props: {},
  onLoad: function (options) {
    const{order} = this;
    let type = options.type || orderType.ALL;
	let index = order.findIndex(item => item.type == type)
    this.changeShow(index);
  },

  onPullDownRefresh: function () {
   const {active, order} = this
   console.log(this.$refs['order' + order[active].type])
   this.$refs['order' + order[active].type][0].reflesh()
  },

  onReachBottom: function () {
	  const {active, order} = this
	console.log(this.$refs['order' + order[active].type])
	this.$refs['order' + order[active].type][0].getOrderListFun()
  },
  methods: {
    changeShow(index) {
		if(index != -1) {
			this.active = index
			this.order[index].isShow = true
		}
    },
  }
};
</script>
<style>

</style>