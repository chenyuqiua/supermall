<template>
	<div id="home" class="wrapper">
			<nav-bar class="home-nav"><div slot="center" >购物街</div></nav-bar>
			<tab-control :titles="['流行','新款','精选']"
									 @tabClick="tabClick" 
									 ref="tabControl1" 
									 class="tab-control" 
									 v-show="isTabFixed"/>
			<scroll class="content" 
							ref="scroll" 
							:probe-type="3" 
							@scroll="contentScroll" 
							:pull-up-load="true" 
							@pullingUp="loadMore">
				<home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
				<home-recommend-view :recommends="recommends" />
				<home-feature-view />
				<tab-control :titles="['流行','新款','精选']" 
										 @tabClick="tabClick" 
										 ref="tabControl2"/>
				<goods-list :goods="showGoods" />
			</scroll>
			
			<back-top @click.native="backClick" v-show="isShowBackTop" />
	</div>
</template>

<script>
	import HomeSwiper from "./childComps/HomeSwiper.vue"
	import HomeRecommendView from "./childComps/HomeRecommendView.vue"
	import HomeFeatureView from "./childComps/HomeFeatureView.vue"
	
	import NavBar from "components/common/navbar/NavBar.vue"
	import TabControl from "components/content/tabControl/TabControl.vue"
	import GoodsList from "components/content/goods/GoodsList.vue"
	import Scroll from "components/common/scroll/Scroll.vue"
	// import BackTop from "components/content/backTop/BackTop.vue" 混入backTop--1/4
	
	import {getHomeMultidata,getHomeGoods} from "network/home.js"
	import {debounce} from "common/utils.js"
	import {itemListenerMixin, backTopMixin} from "common/mixin.js"
	
	export default {
		name: "Home",
		mixins: [itemListenerMixin, backTopMixin],
		components: {
			HomeSwiper,
			HomeRecommendView,
			HomeFeatureView,
			NavBar,
			TabControl,
			GoodsList,
			Scroll,
			// BackTop 混入backTop--2/4
		},
		computed:{
			showGoods() {
				return this.goods[this.currentType].list
			}
		},
		data() {
			return {
				
				// 请求下来的数据分类保存
				banners: [],
				dKeywords: [],
				keywords: [],
				recommends: [],
				goods: {
					"pop": {page: 0,list: []},
					"new": {page: 0,list: []},
					"sell": {page: 0,list: []}
				},
				currentType: "pop",
				// isShowBackTop: false, 混入backTop--3/4
				tabOffsetTop:  0,
				isTabFixed: false,
				saveY: 0
			}
		},
		activated() {
			this.$refs.scroll.scrollTo(0,this.saveY,0)
			this.$refs.scroll.refresh()
		},
		deactivated() {
			// 1.保存Y值
			this.saveY = this.$refs.scroll.getScrollY()
			
			// 2、取消全局事件监听
			this.$bus.$off('itemImgLoad', this.itemImgListener)
		},
		
		// 生命周期函数
		created() {
			
			// 请求多个数据
			this.getHomeMultidata()
			
			// 请求商品数据
			this.getHomeGoods("pop")
			this.getHomeGoods("new")
			this.getHomeGoods("sell")
		},
		mounted() {
			// 使用了混入
			/* // 1.iteam中图片加载完成的事件监听
			const refresh = debounce(this.$refs.scroll.refresh,200)
			this.$bus.$on("itemImageLoad", () => {
				refresh()
			}) */
		},
		methods: {
			
			// 事件监听相关方法
			tabClick(index) {
				switch(index) {
					case 0:
						this.currentType = "pop"
						break
					case 1:
						this.currentType = "new"
						break
					case 2:
						this.currentType = "sell"
						break
				}
				this.$refs.tabControl1.currentIndex = index;
				this.$refs.tabControl2.currentIndex = index;
			},
			// backClick() {
			// 	this.$refs.scroll.scrollTo(0, 0, 500)
			// },混入backTop--4/4
			
					// 拿到监听滚动的位置
			contentScroll(position) {
				
				// 1.判断BackTop是否显示
				this.isShowBackTop = (-position.y) > 1000
				
				// 2.决定tabContro是否吸顶(prsition: fixed)
				this.isTabFixed = (-position.y) > this.tabOffsetTop
			},
			
					// 拿到上拉加载更多
			loadMore() {
				this.getHomeGoods(this.currentType)
			},
			swiperImageLoad() {
				
				// 获取tabControl的offsetTop
				// 所有组件都有一个元素$el:用于获取组件中的元素
				this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
			},
			
			// 网络请求封装相关方法
			getHomeMultidata() {
				getHomeMultidata().then(res => {
					this.banners = res.data.banner.list;
					this.dKeywords = res.data.dKeyword.list;
					this.keywords = res.data.keywords.list;
					this.recommends = res.data.recommend.list;
				})
			},
			getHomeGoods(type) {
				const page = this.goods[type].page + 1
				getHomeGoods(type, page).then(res => {
					this.goods[type].list.push(...res.data.list)
					this.goods[type].page += 1
					
					// 完成上拉加载更多
					this.$refs.scroll.finishPullUp()
				})
			}
		}
	}
</script>

<style scoped>
	#home {
	  /* padding-top: 44px; */
	  height: 100vh;
		position: relative;
	}
	
	.home-nav {
		background-color: var(--color-tint);
		color: #fff;
		/* position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 9; */
	}
	
	/* .tab-control {
		position: sticky;
		top: 44px;
		z-index: 9;
	} */
	
	.content {
		overflow: hidden;
		position: absolute;
		top: 44px;
		bottom: 49px;
		left: 0;
		right: 0;
	}
	
	.tab-control {
		position: relative;
		z-index: 9;
	}
</style>
