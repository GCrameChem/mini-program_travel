<template>
  <view class="swiper-wrap">
    <swiper
      class="swiper"
      ref="swiper"
      :autoplay="autoplay"
      :circular="circular"
      :interval="interval"
      :duration="duration"
      @change="swiperChange"
    >
      <!-- 循环遍历urls, 显示图片或视频 -->
      <block v-for="(item, index) in urls" :key="index">
        <swiper-item @tap="previewImage(index)">
          <view v-if="item.type === 'video'" class="video-wrap">
            <!-- 如果是视频类型，展示视频 -->
            <video
              id="myVideo"
              class="my-video"
              :enable-progress-gesture="false"
              :controls="showControls"
              :show-progress="true"
              :show-fullscreen-btn="showControls"
              :src="item.url"
              :show-center-play-btn="false"
              :muted="false"
              show-mute-btn="true"
              @error="videoErrorCallback"
              :show-play-btn="showControls"
              @click="play"
              @ended="playEnd"
              @fullscreenchange="fullscreenchange"
            ></video>
            <image
              v-show="showPlay"
              @tap.stop="play"
              src="/static/images/icon_play.png"
              class="icon-play"
            ></image>
          </view>
          <u-image
            v-else
            width="750rpx"
            height="750rpx"
            :src="item.url"
            mode="aspectFill"
          ></u-image>
        </swiper-item>
      </block>
    </swiper>
    <view class="dots black sm bg-white br60" id="bottom">
      {{ currentSwiper + 1 }}/{{ urls.length }}
    </view>
  </view>
</template>

<script>
var app = getApp();
export default {
  data() {
    return {
      currentSwiper: 0,
      urls: [], // 用于存储图片或视频
      showPlay: true,
      showControls: false,
      autoplay: true,
      start: 0,
    };
  },
  props: {
    imgUrls: {
      type: Array,
      default: () => [],
    },
    circular: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    duration: {
      type: Number,
      default: 500,
    },
    video: {
      type: String,
      default: '', // 默认没有视频
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    // 监听图片数组和视频链接，更新 urls
    imgUrls: {
       handler(val) {
         this.urls = val.map((item) => {
           return {
             url: item,
             type: 'image',
           };
         });
   
         // 如果有视频链接，插入视频到 urls 数组中
         if (this.video && this.video !== '') {
           this.urls.unshift({
             url: this.video,
             type: 'video',
           });
           this.autoplay = false;
           this.$nextTick(() => {
             this.videoContext = uni.createVideoContext('myVideo', this);
             this.videoContexts = uni.createVideoContext('videos', this);
           });
         }
       },
       immediate: true,
     },
    isShow: {
      handler(val) {
        if (val == true && !this.showPlay) {
          this.videoContext.stop();
        } else if (val == false && this.showPlay == false) {
          this.videoContext.play();
        }
      },
    },
  },

  methods: {
    swiperChange(e) {
      this.currentSwiper = e.detail.current;
      if (e.detail.current !== 0 && this.video !== "") {
        try {
          this.showPlay = true;
          this.videoContext.stop();
          this.videoContexts.stop();
        } catch (error) {
          console.log("err==>", error);
        }
      }
    },
    videoErrorCallback(err) {
      console.log("err==>", err);
    },

    previewImage(current) {
      let index = current;

      if (current == 0 && this.video) {
        return false;
      }

      // #ifdef MP-WEIXIN
      wx.previewMedia({
        current,
        indicator: "default",
        sources: this.urls,
      });
      //#endif
      // #ifdef H5 || APP-PLUS
      if (this.video) {
        index = current - 1;
      }
      if (this.urls[current].type === "video") {
        this.videoContext.requestFullScreen();
      } else {
        uni.previewImage({
          indicator: "default",
          index,
          urls: this.urls.map((item) => item.url),
        });
      }
      //#endif
    },
    play() {
      if (this.start === 0) {
        this.start = 1;
        this.showPlay = false;
        this.videoContext.play();
      } else {
        this.start = 0;
        this.showPlay = true;
        this.videoContext.stop();
      }
    },

    playEnd() {
      this.start = 0;
      this.showPlay = true;
    },

    fullscreenchange(e) {
      const { fullScreen } = e.detail;
      !fullScreen && this.videoContext.stop();
      this.showControls = fullScreen ? true : false;
      this.showPlay = fullScreen ? false : true;
    },
  },
};
</script>

<style lang="scss">
.swiper-wrap {
  width: 100%;
  height: 750rpx;
  position: relative;
}

.swiper-wrap .swiper {
  width: 100%;
  height: 100%;
  position: relative;
}

.swiper-wrap .video-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.swiper-wrap .my-video {
  width: 100%;
  height: 100%;
}

.swiper-wrap .icon-play {
  width: 90rpx;
  height: 90rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
}
/* 页码样式 */
.dots {
  position: absolute;
  bottom: 20rpx; /* 距离底部20rpx */
  right: 20rpx;  /* 距离右侧20rpx */
  background-color: rgba(0, 0, 0, 0.7); /* 黑色背景 */
  color: white; /* 白色字体 */
  padding: 8rpx 15rpx; /* 内边距 */
  border-radius: 25rpx; /* 圆角椭圆 */
  font-size: 28rpx; /* 字体大小 */
  z-index: 10; /* 确保在最上层 */
}
</style>
