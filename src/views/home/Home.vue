<template>
	<div id="home" class="wrapper">
			<nav-bar class="home-nav"><div slot="center" >购物街</div></nav-bar>
			
			<scroll class="content">
				<home-swiper :banners="banners" />
				<home-recommend-view :recommends="recommends" />
				<home-feature-view />
				<tab-control :titles="['流行','新款','精选']" 
										 class="tab-control" 
										 @tabClick="tabClick"/>
				<goods-list :goods="showGoods"></goods-list>
			</scroll>
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
	
	import {getHomeMultidata,getHomeGoods} from "network/home.js"
	
	export default {
		name: "Home",
		components: {
			HomeSwiper,
			HomeRecommendView,
			HomeFeatureView,
			NavBar,
			TabControl,
			GoodsList,
			Scroll
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
				currentType: "pop"
			}
		},
		// 生命周期函数
		created() {
			// 请求多个数据
			this.getHomeMultidata(),
			// 请求商品数据
			this.getHomeGoods("pop"),
			this.getHomeGoods("new"),
			this.getHomeGoods("sell")
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
				})
			}
		}
	}
</script>

<style scoped>
	#home {
	  padding-top: 44px;
	  height: 100vh;
		position: relative;
	}
	
	.home-nav {
		background-color: var(--color-tint);
		color: #fff;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 9;
	}
	
	.tab-control {
		position: sticky;
		top: 44px;
		z-index: 9;
	}
	
	.content {
		overflow: hidden;
		position: absolute;
		top: 44px;
		bottom: 49px;
		left: 0;
		right: 0;
	}
	/* .content {
		height: calc(100% - 93px);
		overflow: hidden;
		margin-top: 44px;
	} */
</style>
