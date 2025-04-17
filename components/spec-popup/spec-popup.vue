<template>
  <u-popup
    v-model="showPop"
    mode="bottom"
    border-radius="14"
    :closeable="true"
    @close="onClose"
    :safe-area-inset-bottom="true"
  >
    <view class="bg-white spec-contain">
      <view class="spec-header row">
        <custom-image
          class="goods-img mr20"
          radius="10rpx"
          @tap="previewImage(checkedGoods.imageUrlList[0])"
          :src="checkedGoods.imageUrlList[0]"
        ></custom-image>
        <view class="goods-info">
          <view class="row">
            <!-- 活动名称 -->
            <view class="activity-name bold">{{ checkedGoods.activityName }}</view>
          
            <!-- 当前价格 -->
            <price-format
			  class="custom-price"
              :first-size="46"
              :second-size="32"
              :subscript-size="32"
              :price="checkedGoods.currentPrice"
              :weight="500"
            ></price-format>
          
            <!-- 原价部分-->
            <view class="original-price-wrapper">
              <price-format
                :price="checkedGoods.originalPrice"
                class="original-price"
              ></price-format>
            </view>
          </view>

          <view class="sm" v-show="showStock">
            库存：{{ checkedGoods.remainingQuota }}件
          </view>
          <view class="sm">
            <text>{{ specValueText }}</text>
          </view>
		  
        </view>
      </view>
      <view class="spec-main">
        <scroll-view style="max-height: 600rpx" scroll-y="true">
			<view class="spec-list">
			    <view class="name mb20">
					<text>时间和上车地点</text>
				</view>
			    <view class="row wrap">
					  <view v-for="(specitem, index2) in specList" :key="index2" :class="['spec-item sm', specitem.checked ? 'checked' : '']" @tap="choseSpecItem(index2)">
					    {{ specitem.name }}
					  </view>

			    </view>
			</view>
		
          <!-- <view class="spec-list">
            <view v-for="(item, index) in specList" :key="index" class="spec">
              <view class="name mb20">
                {{ item }}
                <text class="primary xs ml20">
                  {{ checkedGoods.spec_value_ids_arr[index] == ""
                    ? "请选择" + item
                    : "" }}
                </text>
              </view>
              <view class="row wrap">
				  <view v-for="(specitem, index2) in specList" :key="index2" :class="['spec-item sm', specitem.checked ? 'checked' : '']" @tap="choseSpecItem(index, index2)">
				    {{ specitem.name }}
				  </view>
              </view>
            </view>
          </view> -->
		  
        </scroll-view>
        <view class="good-num row-between ml20 mr20">
          <view class="label">数量</view>
          <u-number-box
            v-model="goodsNum"
            :min="1"
            :max="checkedGoods.remainingQuota"
            :disabled="disabledNumberBox"
          ></u-number-box>
        </view>
      </view>
      <view
        class="btns row-between bg-white"
        :class="specValueText.indexOf('请选择') != -1 || checkedGoods.remainingQuota == 0
            ? 'disabled'
            : ''"
      >
        <button
          v-if="showAdd"
          class="add-cart br60 white btn"
          size="lg"
          @tap="onClick('addcart')"
        >
          {{ yellowBtnText }}
        </button>
        <button
          v-if="showBuy"
          class="bg-primary br60 white btn"
          size="lg"
          @tap="onClick('buynow')"
        >
          {{ redBtnText }}
        </button>
        <button
          v-if="showConfirm"
          class="bg-primary br60 white btn"
          size="lg"
          @tap="onClick('confirm')"
        >
          确定
        </button>
      </view>
    </view>
  </u-popup>
</template>

<script>
export default {
  data() {
    return {
      checkedGoods: {
        stock: 0,
		imageUrlList: [] // 确保有一个空数组来避免 undefined 错误
      }, // 选中的
      specList: [], // 规格
      disable: [], // 不可选择的
      goodsNum: 1,
      showPop: false,
    };
  },
  props: {
    show: {
      type: Boolean,
    },
    goods: {
      type: Object,
    },
    showAdd: {
      type: Boolean,
      default: true,
    },
    showBuy: {
      type: Boolean,
      default: true,
    },
    showConfirm: {
      type: Boolean,
      default: false,
    },
    redBtnText: {
      type: String,
      default: "立即购买",
    },
    yellowBtnText: {
      type: String,
      default: "加入购物车",
    },
    group: {
      type: Boolean,
      default: false,
    },
    isSeckill: {
      type: Boolean,
      default: false,
    },
    showStock: {
      type: Boolean,
      default: true,
    },
    disabledNumberBox: {
      type: Boolean,
      default: false,
    },
    isBargain: {
      type: Boolean,
      default: false,
    },
    goodsType: {
      type: Number,
    },
  },
  computed: {
    // 选择的规格参数等
    specValueText() {
      let arr = this.checkedGoods.spec_value_ids?.split(",");
	  let spec_str = "";
	  
	  // 判断规格选择情况，生成提示文本
	  if (arr) {
		arr.forEach((item, index) => {
		  if (item === "") {
			spec_str += this.specList[index] + "，"; // 拼接未选项的文本
		  }
		});
	  }
	  
	  // 如果所有项都没有选择，则显示“请选择”提示
	  if (!this.checkedGoods.spec_value_str || this.checkedGoods.spec_value_str.trim() === "") {
		return `请选择上车时间和地点`;
	  } else {
		// 如果有选项已选择，则显示已选择的内容
		return `已选择 ${this.checkedGoods.spec_value_str}`;
	  }
	}
  },

  watch: {
	
    goods(value) {
    // 通过检查数据结构和初始化specList
    if (value && value.optionalActivityInformationList) {
      this.specList = (value.optionalActivityInformationList || []).map(item => ({
        name: item,
        checked: false,
      }));
    }
	
    if (value.remainingQuota > 0) {
      this.checkedGoods = {
        activityId: value.activityId,
        activityName: value.activityName,
        currentPrice: value.currentPrice,
        originalPrice: value.originalPrice,
        totalQuota: value.totalQuota,
        remainingQuota: value.remainingQuota,
        imageUrlList: value.imageUrlList || [], // 确保 imageUrlList 存在
        spec_value_ids_arr: [],
        spec_value_ids: "",
        spec_value_str: "",
      };
    } else {
      this.checkedGoods = {
        activityId: value.activityId,
        activityName: value.activityName,
        currentPrice: value.currentPrice,
        originalPrice: value.originalPrice,
        totalQuota: value.totalQuota,
        remainingQuota: value.remainingQuota,
        imageUrlList: value.imageUrlList || [],
        spec_value_ids_arr: [],
        spec_value_ids: "",
        spec_value_str: "",
      };
      this.disable = [];
    }

    this.$emit("change", {
      detail: this.checkedGoods,
    });
  },
    specList(value) {
      if (this.checkedGoods.remainingQuota == 0) return;

      // 处理库存逻辑，所有规格共享一个库存
      if (this.goodsNum > this.checkedGoods.remainingQuota) {
        this.goodsNum = this.checkedGoods.remainingQuota;
      }
	  this.$emit("change", {
	    detail: this.checkedGoods,
	  });
    },

    show(val) {
      this.showPop = val;
    },
  },

  methods: {
    onClose() {
      this.$emit("close");
    },

    onClick(type) {
      let { checkedGoods, goodsNum } = this;
      if (this.specValueText.indexOf("请选择") != -1)
        return this.$toast({
          title: this.specValueText,
        });
      if (checkedGoods.remainingQuota == 0)
        return this.$toast({
          title: "当前选择库存不足",
        });
      // 处理确认逻辑
      if (type == "confirm") {
        this.$emit("confirm", { checkedGoods, goodsNum });
      } else if (type == "addcart") {
        this.$emit("addcart", { checkedGoods, goodsNum });
      } else if (type == "buynow") {
		this.$emit("buynow", {
		  detail: {
		    checkedGoods: this.checkedGoods,
		    goodsNum: this.goodsNum
		  }
		});
        // this.$emit("buynow", { checkedGoods, goodsNum });
      }
    },

    choseSpecItem(index2) {
        this.specList.forEach((specItem, i) => {
          if (i === index2) {
            specItem.checked = !specItem.checked;
          } else {
            specItem.checked = false;
          }
        });
    
        // 更新 spec_value_ids_arr 和 spec_value_str
        let specValueArr = this.specList
          .filter(specItem => specItem.checked)
          .map(specItem => specItem.name);
    
        this.checkedGoods.spec_value_ids_arr = specValueArr;
        this.checkedGoods.spec_value_str = specValueArr.join(", ");
    
        // 重新计算禁用项（如需要）
        this.updateDisabledSpecs();
      },
    
      // 计算禁用项（如果有相关需求）
      updateDisabledSpecs() {
        // 例如：禁用当前选择项不符合库存的其他规格
        let disableList = [];
        // 计算禁用项的逻辑
        this.disable = disableList;
      },
	previewImage(url) {
	  if (url) {
	    uni.previewImage({
	      urls: [url],
	    });
	  } else {
	    console.log('没有可预览的图片');
	  }
	},
  },
};

</script>

<style lang="scss" scoped>
.goods-info {
  display: flex;
  flex-direction: column; /* 垂直排列 */
}
.row {
  align-items: flex-end; /* 竖直方向上底部对齐 */
}

.spec-contain {
  border-radius: 10rpx 10rpx 0 0;
  overflow: hidden;
  position: relative;

  .spec {
    margin-top: 30rpx;
  }

  .close {
    position: absolute;
    right: 10rpx;
    top: 10rpx;
  }

  .activity-name {
    font-size: 45rpx;
    flex: 1;
  }

  .spec-header {
    padding: 30rpx 20rpx;
    padding-right: 70rpx;
    align-items: flex-start;
    border: $-solid-border;
	
	.custom-price {
	  padding-left: 15rpx;
	  color: red !important; /* 设置字体颜色为红色 */
	}
    .original-price-wrapper {
      padding-left: 8rpx;
	  align-items: flex-end; /* 竖直方向上底部对齐 */
    }

    .original-price {
      font-size: 24rpx; /* 小字体 */
      color: #999999; /* 灰色 */
      text-decoration: line-through; /* 划线效果 */
    }

    .goods-img {
      width: 180rpx;
      height: 180rpx;
      flex: none;
    }
  }

  .spec-main {
    .spec-list {
      padding: 30rpx 20rpx;

      .spec-item {
        line-height: 52rpx;
        padding: 0 20rpx;
        background-color: #f4f4f4;
        border-radius: 60rpx;
        margin: 0 20rpx 20rpx 0;
        border: 1px solid #f4f4f4;

        &.checked {
          background-color: #ffb946;  /* 选中时的背景色 */
          color: white;               /* 选中时的文字颜色 */
          border-color: #ffb946;      /* 选中时的边框颜色 */
        }

        &.disabled {
          opacity: 0.5;
          text-decoration: line-through; /* 灰色并划线 */
        }
      }
    }
  }

  .disabled {
    opacity: 0.4;
  }

  .btns {
    height: 120rpx;
    padding: 0 30rpx;
    margin-top: 80rpx;

    .add-cart {
      background-color: #ff9e1e; /* 橙色 */
    }

    .btn {
      margin: 0 10rpx;
      flex: 1;
    }
  }
}
</style>
