<template>
    <view class="index home-bg" :style="[navBackground]">
        <!-- #ifdef H5 -->
        <download-nav v-if="isShowDownload"></download-nav>
        <!-- #endif -->
        <u-sticky offset-top="0" h5-nav-height="0" bg-color="transparent" :enable="enable">
            <u-navbar
                :border-bottom="false"
                :is-fixed="false"
                custom-class="home-bg"
                :background="navBackground"
                :is-back="false"
            >
                <view class="row logo-wrap flex1" v-show="navBg < 1 && showLogo">
                    <image :src="logo" mode="heightFix" class="logo ml30"></image>
                </view>
                <view class="flex1 row nav-search" v-show="navSearch">
                    <navigator
                        hover-class="none"
                        @click="goPage('/bundle/pages/message_center/message_center')"
                    >
                        <image class="icon-md ml30" src="/static/images/icon_news.png"> </image>
                    </navigator>
                    <navigator
                        class="ml20 flex1 mr20"
                        hover-class="none"
                        url="/pages/goods_search/goods_search"
                    >
                        <u-search
                            wrap-bg-color="transparent"
                            :bg-color="'#fff'"
                            :disabled="true"
                            :height="62"
                        >
                        </u-search>
                    </navigator>
                </view>
            </u-navbar>
        </u-sticky>
        <view class="flex1 row" v-if="showLogo">
            <navigator
                hover-class="none"
                @tap="goPage('/bundle/pages/message_center/message_center')"
            >
                <image class="icon-md ml30" src="/static/images/icon_news.png"> </image>
            </navigator>
            <navigator
                class="ml20 flex1 mr20"
                hover-class="none"
                url="/pages/goods_search/goods_search"
            >
                <u-search
                    wrap-bg-color="transparent"
                    :bg-color="'#fff'"
                    :disabled="true"
                    :height="62"
                ></u-search>
            </navigator>
        </view>
        <view class="contain">
			<!-- 宣传图轮播区块 -->
			<view class="promo-swiper">
				<swiper 
				  :autoplay="true" 
				  :interval="3000" 
				  :circular="true" 
				  indicator-dots
				  indicator-color="rgba(255,255,255,0.5)"
				  indicator-active-color="#ffffff"
				>
				  <swiper-item v-for="(item, index) in promoList" :key="index">
					<image 
					  :src="item.image" 
					  mode="widthFix" 
					  class="swiper-image"
					  @tap="handlePromoClick(item.link)"
					/>
				  </swiper-item>
				</swiper>
			</view>
			<view class="main">
                <bubble-tips top="50rpx" :discharge="isDischarge"></bubble-tips>
                <!-- <swipers :pid="1" height="322rpx" padding="10rpx 0"></swipers> -->
                <!-- 导航入口 -->
                <view class="nav bg-white" v-if="navList.length">
                    <swiper :style="'height:' + navSwiperH + 'rpx;'" @change="swiperChange">
                        <swiper-item v-for="(items, index) in navList" :key="index">
                            <view class="nav-list row wrap">
                                <view
                                    v-for="(item, index2) in items"
                                    :key="index2"
                                    @tap="tapMenu(item)"
                                    class="nav-item column-center"
                                >
                                    <image class="nav-icon" :src="item.image"></image>
                                    <view class="name xs">{{ item.name }}</view>
                                </view>
                            </view>
                        </swiper-item>
                    </swiper>
                    <view class="dots" v-if="navList.length > 1">
                        <view
                            v-for="(item, index) in navList"
                            :key="index"
                            :class="'dot ' + (index == currentSwiper ? 'active' : '')"
                        ></view>
                    </view>
                </view>
                <!-- 资讯 -->
<!--                <navigator
                    v-if="news.length"
                    class="information bg-white row mt20"
                    hover-class="none"
                    open-type="navigate"
                    url="/pages/news_list/news_list"
                >
                    <image class="icon-toutiao" src="/static/images/icon_toutiao.png"></image>
                    <text class="gap-line"></text>
                    <view class="news flex1">
                        <view class="shade"></view>
                        <swiper
                            autoplay="true"
                            style="height: 76rpx; flex: 1"
                            vertical="true"
                            circular="true"
                            :interval="3000"
                        >
                            <swiper-item v-for="(item, index) in news" :key="index" class="row">
                                <view class="flexnone">
                                    <u-tag
                                        v-if="item.is_new"
                                        shape="circle"
                                        text="最新"
                                        size="mini"
                                        type="primary"
                                        mode="plain"
                                    />
                                </view>
                                <view class="text-swiper ml10 line1">{{ item.title }}</view>
                            </swiper-item>
                        </swiper>
                    </view>
                    <image class="icon-sm ml20" src="/static/images/arrow_right.png" />
                </navigator>
                -->
				<!-- 领卷 -->
                <swipers :is-swiper="false" :pid="23" height="170rpx" padding="20rpx 0 0"></swipers>
				<!-- 当季精选 -->
				<view class="special-area mt20" v-if="goodsList.length">
					<view class="title-container column-center">
						<view class="title-text">当季精选</view>
						<view class="desc-text">探索当季精彩活动，发现更多惊喜！</view>
					</view>
					<goods-list type="triple" :list="goodsList"></goods-list>
				</view>
				<!-- 每周活动 -->
				<view class="special-area mt20" v-if="seckillGoods.length">
					<!-- 标题块 -->
					<view class="title-container column-center">
						<view class="title-text">每周活动</view>
						<view class="desc-text">探索最新的精彩活动，发现更多惊喜！</view>
					</view>
					<!-- 一日游 -->
					<view class="goods-section">
						<!-- 竖向标题栏 -->
						<view class="vertical-title">一日游</view>
						<!-- 活动区域 -->
						<view class="activity-container">
							<view v-if="newGoods.length && seting.news" class="new-goods">
								<active-area type="news" progressBarColor="#9912FE" :lists="newGoods">
									<navigator
										slot="header"
										hover-class="none"
										open-type="navigate"
										url=""
									></navigator>
								</active-area>
							</view>
						</view>
					</view>
					<!-- 多日游 -->
					<view class="goods-section">
						<!-- 竖向标题栏 -->
						<view class="vertical-title">多日游</view>
						<!-- 活动区域 -->
						<view class="activity-container">
							<view v-if="newGoods.length && seting.news" class="new-goods">
								<active-area type="news" progressBarColor="#9912FE" :lists="newGoods">
									<navigator
										slot="header"
										hover-class="none"
										open-type="navigate"
										url=""
									></navigator>
								</active-area>
							</view>
						</view>
					</view>
				</view>
				<!-- 地区小团 -->
				<view class="goods mt20" v-if="goodsList.length">
				    <view class="title-container row-center">
				        <text class="line"></text>
							<view class="row">
								<view class="title-text">地区小团</view>
							</view>
						<text class="line"></text>
						<view class="desc-text">拼包车小团出行，行程自由，随走随停，下方为已经发起的活动，加入即成行，任何人均可发起小团活动，2人成行最多8人</view>
					</view>
					<!-- 宣传 -->
					<view class="guide-container">
					    <view class="guide-item" v-for="(item, index) in guideItems" :key="index">
					      <view class="image-container">
					        <image :src="item.image" class="guide-image" />
					      </view>
					      <view class="text-container">
					        <text class="guide-text">{{ item.text }}</text>
					      </view>
					    </view>
					  </view>
					<!-- 可折叠卡片组件-->
					<view>
					    <expandable-card 
					      v-for="(card, index) in tourCards"
					      :key="card.id"
					      :title="card.title"
					      :desc="card.desc"
					      :bgImage="card.bgImage"
					      :initiallyExpanded="card.expanded"
					      @toggle="handleCardToggle(index)"
					    >
						<!-- 使用插槽传递详细内容 -->
						<template #content>
						  <view class="card-detail" v-if="card.expanded">
							<view v-if="newGoods.length && seting.news" class="new-goods">
								<active-area type="news" progressBarColor="#9912FE" :lists="newGoods">
									<navigator
									  slot="header"
									  hover-class="none"
									  open-type="navigate"
									  url=""
									>
									</navigator>
								</active-area>
							</view>
						  </view>
						</template>	
					    </expandable-card>
					</view>
				</view>
				
				<!-- 其他线路 -->
				<view class="special-area mt20">
				    <view class="title-container column-center">
				        <view class="title-text">国内其他线路</view>
				        <view class="desc-text">目前覆盖四川、重庆、湖北等地高校，在这些城市有一些经典的目的地线路，大家可以走出去看世界呀～</view>
				    </view>
				    <view>
				        <scroll-view style="white-space: nowrap" :scroll-x="true">
				            <navigator
				                class="item bg-white"
				                v-for="(item, index) in activityArea"
				                :key="index"
				                hover-class="none"
				                :url="`/bundle/pages/activity_detail/activity_detail?id=${item.id}&name=${item.title}&title=${item.name}`"
				            >
				                <view class="column-center">
				                    <custom-image
				                        width="300rpx"
				                        height="436rpx"
				                        :src="item.image"
				                    ></custom-image>
				                </view>
				            </navigator>
				        </scroll-view>
				    </view>
				</view>
                <!-- 更多出行 -->
				<view class="special-area mt20">
                    <view class="title-container column-center">
                        <view class="title-text">更多出行</view>
                        <view class="desc-text">如果上面线路没有你合适的，或者想做大型团建活动/班级活动/三下乡等等 ……可以联系我们的客服，行程更加自由，更能满足你的个性化需求～</view>
                    </view>
                </view>
                
				
				<!-- 秒杀 -->
                <!-- <view class="seckill mt20" v-if="seckillGoods.length">
                    <active-area type="seckill" progressBarColor="#FF2C3C" :lists="seckillGoods">
                        <navigator
                            slot="header"
                            hover-class="none"
                            class="row activity-header white"
                            open-type="navigate"
                            url="/bundle/pages/goods_seckill/goods_seckill"
                        >
                            <view class="title xxl bold">超值秒杀</view>
                            <view class="row flex1">
                                <text class="white xs ml10 line1"
                                    >{{ seckill.start_time }}点场</text
                                >
                                <view class="dec ml20 row-center mr20 br60">
                                    <u-count-down
                                        :timestamp="remainTime"
                                        separator-color="#FF2C3C"
                                        color="#FF2C3C"
                                        :separator-size="24"
                                        :font-size="24"
                                        bg-color="transparent"
                                    ></u-count-down>
                                </view>
                            </view>
                            <view class="row xs">
                                更多
                                <u-icon name="arrow-right" size="28"></u-icon>
                            </view>
                        </navigator>
                    </active-area>
                </view> -->
                <!-- 热销,竖向选择-->
<!--                <view class="hot mt20" v-if="hotGoods.length && seting.hots">
                    <active-area type="hot" progressBarColor="#9912FE" :lists="hotGoods">
                        <navigator
                            slot="header"
                            hover-class="none"
                            class="row activity-header"
                            open-type="navigate"
                            url="/bundle/pages/hot_list/hot_list"
                        >
                            <view class="title flex1">
                                <image
                                    class="title-image"
                                    src="/static/images/hot_title.png"
                                ></image>
                            </view>
                            <view class="row xs">
                                更多
                                <u-icon name="arrow-right" size="28"></u-icon>
                            </view>
                        </navigator>
                    </active-area>
                </view>
 -->               
				<!-- 新品推荐 -->
<!--                <view v-if="newGoods.length && seting.news" class="new-goods">
                    <active-area type="news" progressBarColor="#9912FE" :lists="newGoods">
                        <navigator
                            slot="header"
                            hover-class="none"
                            class="row activity-header"
                            open-type="navigate"
                            url=""
                        >
                            <view class="title flex1">
                                <image
                                    class="title-image"
                                    src="/static/images/new_title.png"
                                ></image>
                            </view>
                        </navigator>
                    </active-area>
                </view>
            -->
			</view>
			
			<!-- 末尾宣传 -->
			<view class="special-area mt20">
				<view class="promo-swiper">
					<swiper 
					  :autoplay="true" 
					  :interval="3000" 
					  :circular="true" 
					  indicator-dots
					  indicator-color="rgba(255,255,255,0.5)"
					  indicator-active-color="#ffffff"
					>
					  <swiper-item v-for="(item, index) in promoList" :key="index">
						<image 
						  :src="item.image" 
						  mode="widthFix" 
						  class="swiper-image"
						  @tap="handlePromoClick(item.link)"
						/>
					  </swiper-item>
					</swiper>
				</view>
				<view class="title-container column-center">
					<view class="title-text">关于我们</view>
					<view class="desc-text">这是一个新青年社交旅行平台，做大学生最喜欢的旅行，在这里，你能结交来自天南海北志同道合的朋友，我们为你提供各种好玩有趣、深度体验、值得信赖的精品活动。</view>
				</view>
			</view>
            <!-- 好物优选 -->
<!--            <view class="goods mt20" v-if="goodsList.length">
                <view class="goods-title row-center">
                    <text class="line"></text>
                    <view class="row">
                        <image class="mr10 icon" src="/static/images/icon_like.png"></image>
                        <text class="bold xxl">好物优选</text>
                    </view>
                    <text class="line"></text>
                </view>
                <goods-list :list="goodsList"></goods-list>
                <loading-footer :status="status"></loading-footer>
            </view> -->
        </view>
		
        <u-popup class="coupons-popup" v-model="showCoupop" mode="center">
            <view class="wrap">
                <image class="coupon-bg" src="/static/images/home_coupon_bg.png"></image>
                <scroll-view :scroll-y="true" style="height: 460rpx; margin-top: 300rpx">
                    <view class="item" v-for="(item, index) in couponPopList" :key="item.id">
                        <image class="img" src="/static/images/pop_bg_coupon.png"></image>
                        <view class="row item-con">
                            <view class="row-center price">
                                <price-format
                                    color="#FF2C3C"
                                    :showSubscript="true"
                                    :subscriptSize="32"
                                    :first-size="56"
                                    :second-size="40"
                                    :price="item.money"
                                />
                            </view>
                            <view class="ml20 mr20">
                                <view class="bold md lighter">{{ item.name }}</view>
                                <view class="xs muted mt10">{{ item.use_goods_type }}</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <view class="white row-center bg-primary lg btn br60" @click="showCoupop = false"
                >立即领取</view
            >
        </u-popup>
        <!-- #ifdef APP-PLUS -->
        <lyg-popup
            v-if="appConfig.app_agreement"
            title="用户使用及隐私保护政策提示"
            protocolPath="/bundle/pages/server_explan/server_explan?type=0"
            policyPath="/bundle/pages/server_explan/server_explan?type=1"
            policyStorageKey="has_read_privacy"
        >
        </lyg-popup>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <!-- 用户隐私协议弹框 -->
        <privacy-popup v-model="showPrivacyPopup"></privacy-popup>
        <!-- #endif -->

        <!-- 无网络提示 -->
        <u-no-network z-index="1200" @retry="handleRetry"></u-no-network>

        <u-back-top
            :scroll-top="scrollTop"
            :top="1000"
            :customStyle="{
                backgroundColor: '#FFF',
                color: '#000',
                boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)'
            }"
        ></u-back-top>
    </view>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { getHome, getMenu, getBestList } from '@/api/store'
import { loadingType } from '@/utils/type'
import { loadingFun, menuJump, arraySlice, setTabbar, getRect, trottle } from '@/utils/tools'
import { toLogin } from '@/utils/login'
import Cache from '@/utils/cache'
import { getConfig, userShare, getRegisterCoupon } from '@/api/app'
const app = getApp()
export default {
	props: {
	    cardData: {
	      type: Object,
	      default: () => ({
	        bgImage: '/static/card-bg1.jpg',
	        title: '默认标题',
	        desc: '默认描述文字'
	      })
	    },
	    newGoods: {
	      type: Array,
	      default: () => []
	    },
	    seting: {
	      type: Object,
	      default: () => ({ news: true })
	    }
	},
    data() {
        return {
			promoList: [
				{
				  image: "/static/images/promo/banner1.jpg",
				  link: "/pages/promo/detail?id=1"
				},
				{
				  image: "/static/images/promo/banner2.jpg",
				  link: "/pages/promo/detail?id=2"
				},
				{
				  image: "/static/images/promo/banner3.jpg",
				  link: "/pages/promo/detail?id=3"
				}
			],
			tourCards: [
			        {
			          id: 1,
			          title: "三日及以上",
			          desc: "4-8人小团，随走随停",
			          bgImage: "/static/images/card-bg/3day.jpg",
			          expanded: false,
			          details: {}
			        },
			        {
			          id: 2,
			          title: "两日游",
			          desc: "发起活动，10人即可成行",
			          bgImage: "/static/images/card-bg/2day.jpg",
			          expanded: false,
			          details: {}
			        },
					{
					  id: 3,
					  title: "一日游",
					  desc: "成都周边景区直通车",
					  bgImage: "/static/images/card-bg/1day.jpg",
					  expanded: false,
					  details: {}
					},
			],
            // 导览数据
			guideItems: [
				{ image: '/static/images/img1.jpg', text: '示例 1' },
				{ image: '/static/images/img2.jpg', text: '示例 2' },
				{ image: '/static/images/img3.jpg', text: '示例 3' },
				{ image: '/static/images/img4.jpg', text: '示例 4' },
				{ image: '/static/images/img5.jpg', text: '示例 5' },
			],
			scrollTop: 0,
            navSwiperH: 374,
            logo: '',
            navHeight: 0,
            currentSwiper: 0,
            page: 1,
            status: loadingType.LOADING,
            remainTime: '',
            navBg: 0,
            navList: [],
            news: [],
            goodsList: [],
            seckill: {},
            seckillGoods: [],
            hotGoods: [],
            newGoods: [],
            activityArea: [],
            showCoupop: false,
            couponPopList: [],
            coupon: [],
            isDischarge: true,
            enable: true,
            isShowDownload: false,
			isExpanded: false, // 卡片默认不展开
            showPrivacyPopup: false ,//微信用户隐私协议
			radius: '4rpx', // 可动态修改（如根据设备类型调整）
        }
    },
    async onLoad(options) {
        // #ifdef MP-WEIXIN
        if (wx.getPrivacySetting) {
            wx.getPrivacySetting({
                success: (res) => {
                    console.log(res, '------') // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
                    if (res.needAuthorization) {
                        // 需要弹出隐私协议
                        setTimeout(() => {
                            uni.hideTabBar()
                        }, 100)
                        this.showPrivacyPopup = true
                    } else {
                        uni.showTabBar()
                    }
                },
                fail: (err) => {
                    uni.showTabBar()
                    console.log(err)
                }
            })
        } else {
            uni.showTabBar()
        }

        // #endif

        this.headerAction = wx.createAnimation({
            delay: 0,
            duration: 100,
            timingFunction: 'ease-in-out'
        })
        this.onPageScroll = trottle(this.onPageScroll, 500, this)
        setTabbar()
        this.navHeight = app.globalData.navHeight
        this.isDischarge = false
        await this.getMenuFun()
        this.getBestListFun()
        console.log(this.appConfig)
        // #ifdef H5
        if (options && options.isapp == 1) {
            this.isShowDownload = true
        }
        // #endif
    },
    async onShow() {
        this.$nextTick(function () {
            getRect('.index').then((res) => {
                if (res.top == 0) {
                    this.navBg = 0
                }
            })
        })

        // #ifdef H5
        this.enable = true
        // #endif
        await this.getHomeFun()
        this.getCartNum()
        this.isLogin && this.getRegisterCouponFun()

        // #ifdef MP
        wx.getUpdateManager().onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        wx.getUpdateManager().applyUpdate()
                    }
                }
            })
        })
        // #endif
    },
    onHide() {
        // #ifdef H5
        this.enable = false
        // #endif
    },
    onReachBottom() {
        this.getBestListFun()
    },
    onPullDownRefresh() {
        this.getHomeFun()
        this.getMenuFun()
    },
    onShareAppMessage() {
        console.log(this.inviteCode)
        const shareInfo = Cache.get('shareInfo')
        return {
            title: shareInfo.mnp_share_title,
            path: 'pages/index/index?invite_code=' + this.inviteCode,
            imageUrl: shareInfo.mnp_share_image
        }
    },
    onPageScroll(e) {
        const top = uni.upx2px(100)
        const { scrollTop } = e
        if (!this.enable) return
        let percent = scrollTop / top
        this.navBg = percent > 1 ? 1 : percent
        this.scrollTop = scrollTop
    },
    destroyed() {
        this.isDischarge = true
    },
    methods: {
        ...mapMutations(['SETCONFIG']),
        ...mapActions(['getCartNum', 'getUser']),
        // 网络重试刷新网络请求（解决在ios中首次进入时需要授权蜂窝加载空白页面问题
        async handleRetry() {
            console.log('网络重试刷')
            try {
                const { code, data } = await getConfig()
                if (code == 1) {
                    this.SETCONFIG(data)
                    setTabbar()
                }
            } catch (e) {
                uni.showTabBar()
            }
            this.getShareInfo()
            this.getUser()
        },
        async getShareInfo() {
            const { code, data } = await userShare()
            if (code == 1) {
                Cache.set('shareInfo', data)
            }
        },
        async getHomeFun() {
            const { code, data } = await getHome()
            uni.stopPullDownRefresh()
            if (code == 1) {
                const { coupon, news, seckill, host_goods, shop_logo, new_goods, activity_area } =
                    data
                this.remainTime = Math.abs(seckill.end_time - Date.parse(new Date()) / 1000)
                this.logo = shop_logo
                this.news = news
                this.seckillGoods = seckill.goods
                this.seckill = seckill
                this.hotGoods = host_goods
                this.coupon = coupon
                this.newGoods = new_goods
                this.activityArea = activity_area
            }
        },

        async getMenuFun() {
            const { code, data } = await getMenu({
                type: 1
            })
            uni.stopPullDownRefresh()
            if (code == 1) {
                //   截取数组
                if (data.length <= 5) {
                    this.navSwiperH = 200
                } else {
                    this.navSwiperH = 374
                }
                this.navList = arraySlice(data)
            }
        },
        async getBestListFun() {
            let { page, goodsList, status } = this
            const data = await loadingFun(getBestList, page, goodsList, status)
            if (!data) return
            this.page = data.page
            this.goodsList = data.dataList
            this.status = data.status
        },
		// 轮换图，留接口待开发
		handlePromoClick(link) {
		      uni.navigateTo({ url: link });
		},
		
        async tapMenu(item) {
            if (!this.isLogin) return toLogin()
            menuJump(item)
        },
        goPage(url) {
            if (!this.isLogin) return toLogin()
            uni.navigateTo({
                url
            })
        },
        swiperChange(e) {
            this.currentSwiper = e.detail.current
        },
		handleCardToggle(index) {
		    this.tourCards[index].expanded = !this.tourCards[index].expanded;
		},
		toggleExpand() {
		    this.isExpanded = !this.isExpanded
		    // 触发动画事件
		    this.$emit('toggle', this.isExpanded)
		},
        getRegisterCouponFun() {
            getRegisterCoupon().then((res) => {
                if (res.code == 1) {
                    if (res.data && res.data.length) {
                        this.showCoupop = true
                    }
                    this.couponPopList = res.data
                }
            })
        }
    },
    computed: {
        ...mapGetters(['cartNum', 'inviteCode', 'appConfig']),
        navBackground() {
            return this.seting.top_bg_image
                ? {
                      'background-image': `url(${this.seting.top_bg_image})`
                  }
                : {}
        },
        showLogo() {
            return this.seting.logo
        },
        navSearch() {
            if (this.showLogo === 0) return true

            return this.navBg < 1 ? false : true
        },
        seting() {
            const { index_setting } = this.appConfig
            return index_setting
        },
		arrowRotation() {
		    return this.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
		}
    }
}
</script>

<style lang="scss">
// #ifdef H5
::v-deep .home-bg {
    background: url(../../static/images/bg_hometop.png) no-repeat;
    background-size: 100% auto;
}

// #endif
.home-bg {
    background: url(../../static/images/bg_hometop.png) no-repeat;
    background-size: 100% auto;
}
.index {
    .live-play {
        position: fixed;
        z-index: 999;
        bottom: 200rpx;
        right: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        border: $-solid-border;
        border-radius: 50%;
        font-size: 32rpx;
        background-color: #ffffff;

        &__icon {
            animation: scale 0.5s infinite;
        }

        @keyframes scale {
            from {
                top: 0px;
                transform: scale(1);
            }
            to {
                transform: scale(1.2);
            }
        }
    }

    background-size: 100% auto;

    .logo-wrap {
        position: absolute;

        .logo {
            width: auto;
            height: 52rpx;
        }
    }

    .header {
        .navigation-bar {
            padding-top: var(--status-bar-height);
            box-sizing: border-box;
        }
    }

    .contain {
		/* 宣传图轮播容器 */
		.promo-swiper {
		  width: 100%;
		  height: 350rpx; /* 根据设计稿调整高度 */
		  overflow: hidden;
		  border-radius: 16rpx;
		  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
		  background-color: #f5f5f5; /* 默认背景色 */
		}
		
		/* 轮播图片样式 */
		.swiper-image {
		  width: 100%;
		  height: 100%;
		  display: block;
		  border-radius: inherit;
		}
		
		/* 适配不同屏幕 */
		@media (min-width: 750rpx) {
		  .promo-swiper {
		    height: 350rpx;
		  }
		}
		
        .main {
            position: relative;
            z-index: 9;
            padding: 0rpx 10rpx;
			
            .nav {
                position: relative;
                border-radius: 14rpx;

                .nav-item {
                    width: 20%;
                    margin-top: 30rpx;

                    .nav-icon {
                        width: 82rpx;
                        height: 82rpx;
                        margin-bottom: 15rpx;
                    }
                }

                .dots {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 20rpx;
                    display: flex;

                    .dot {
                        width: 10rpx;
                        height: 6rpx;
                        border-radius: 6rpx;
                        margin-right: 10rpx;
                        background-color: rgba(255, 44, 60, 0.4);

                        &.active {
                            width: 20rpx;
                            background-color: $-color-primary;
                        }
                    }
                }
            }

            .information {
                height: 76rpx;
                box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.06);
                padding: 0 20rpx;
                box-sizing: border-box;
                border-radius: 14rpx;

                .news {
                    position: relative;

                    .shade {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        z-index: 100;
                    }
                }

                .icon-toutiao {
                    width: 114rpx;
                    height: 34rpx;
                }

                .gap-line {
                    height: 28rpx;
                    width: 1px;
                    background-color: #dcdddc;
                    margin: 0 30rpx;
                }
            }

            .special-area {
                .item {
                    width: 300rpx;
                    border-radius: 20rpx;
                    display: inline-block;
					//display: flex;
					flex-direction: column;
					gap: 20rpx;
                    overflow: hidden;
                    margin-right: 20rpx;

                    .title {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-top: 60rpx;
                        margin-bottom: 20rpx;
                    }

                    // .desc {
                    //     background-color: #fee9eb;
                    //     padding: 6rpx 20rpx;
                    //     border-radius: 60rpx;
                    //     max-width: 260rpx;
                    // }
                }
            }

            .activity-header {
                height: 90rpx;
                padding: 0 20rpx;
            }
			
			.activity-container {
			    flex: 1; /* 让活动区域填充剩余空间 */
			}
			
            // .seckill {
            //     .dec {
            //         background-color: #fffbdb;
            //         width: 150rpx;
            //     }
            // }

            .hot,
            .new-goods {
                .title-image {
                    width: 144rpx;
                    height: 55rpx;
                }
            }
        }

        .goods {
            .goods-title {
                height: 160rpx;

                .line {
                    width: 58rpx;
                    height: 1px;
                    background-color: #ccc;
                    margin: 0 22rpx;
                }

                // .icon {
                //     width: 38rpx;
                //     height: 38rpx;
                // }
            }
        }
    }
	.title-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 60rpx;
		margin-bottom: 20rpx;
	}

	.title-text {
		font-size: 40rpx;  /* 标题较大 */
		font-weight: bold;
		color: #3b3b3b;
	}

	.desc-text {
		font-size: 20rpx;
		color: #666;
		margin-top: 10rpx;
		text-align: center;
		line-height: 1.8;
	}
	.goods-section {
		display: flex;
		align-items: stretch; /* 让左右两栏高度一致 */
		width: 100%;
	}

	.vertical-title {
	    writing-mode: vertical-rl; /* 竖向排列 */
	    background-color: #ddd; /* 灰色背景 */
	    padding: 20rpx;
	    font-size: 30rpx;
	    font-weight: bold;
	    color: #333;
	    text-align: center;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    min-width: 60rpx; /* 设定固定宽度 */
	}

	.goods-name {
		font-size: 24rpx;
		color: #333;
		margin-top: 10rpx;
		text-align: center;
	}

	.goods-price {
		font-size: 26rpx;
		font-weight: bold;
		color: #FF5722;
		margin-top: 5rpx;
	}

    .coupon-pop-container {
        background-image: url(../../static/images/home_coupon_bg.png);
        width: 638rpx;
        height: 804rpx;
        background-size: 100% 100%;
        padding-top: 323rpx;

        .coupon-pop-lists {
            .coupon-pop-item {
                background-image: url(../../static/images/pop_bg_coupon.png);
                width: 488rpx;
                height: 150rpx;
                background-size: 100% 100%;
                margin-top: 20rpx;

                .coupon-left {
                    width: 160rpx;
                    height: 100%;
                }

                .coupon-right {
                    padding-left: 30rpx;
                    border-left: 1rpx dashed $-color-primary;
                }
            }
        }
    }
	
	.guide-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 10rpx;
		
		.guide-item {
			width: calc(20% - 10rpx); /* 一行5个元素，每个元素占宽度的20%，减去间隙 */
			margin-bottom: 16rpx; /* 底部间隙 */
			background: #fff;
			border-radius: 8rpx;
			box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1); /* 阴影 */
			border: 1rpx solid #ddd; /* 浅灰色边框 */
			text-align: center;
			padding: 10rpx;
		}

		.image-container {
			width: 100%;
			height: 150rpx; /* 固定高度，保持图片正方形 */
			margin-bottom: 8rpx;
		}

		.guide-image {
			width: 100%;
			height: 100%;
			border-radius: 6rpx; /* 图片容器圆角 */
			object-fit: cover; /* 保证图片自适应容器 */
		}

		.text-container {
			font-size: 20rpx;
			color: #333;
			opacity: 0.8;
		}
	}
	
    .coupons-popup {
        .wrap {
            position: relative;
            width: 638rpx;
            height: 803rpx;
            overflow: hidden;

            .coupon-bg {
                position: absolute;
                top: 0;
                width: 100%;
                height: 100%;
            }

            .item {
                position: relative;
                width: 488rpx;
                height: 150rpx;
                margin: 0 auto 20rpx;
            }

            .img {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 0;
            }

            .item-con {
                z-index: 10;
                position: relative;
                padding: 20rpx 0;
                height: 100%;
                box-sizing: border-box;

                .price {
                    width: 160rpx;
                    border-right: 1px dashed $-color-primary;
                    height: 100%;
                }
            }
        }

        .btn {
            width: 478rpx;
            height: 84rpx;
            margin: 20rpx auto;
            box-sizing: border-box;
            border: 3px solid #f8d07c;
        }
    }
}
</style>
