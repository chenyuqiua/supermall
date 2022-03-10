<template>
	<div id="home">
		<nav-bar class="home-nav"><div slot="center" >购物街</div></nav-bar>
		<home-swiper :banners="banners" />
		<home-recommend-view :recommends="recommends" />
		<home-feature-view />
	</div>
</template>

<script>
	import NavBar from "components/common/navbar/NavBar.vue"
	import HomeSwiper from "./childComps/HomeSwiper.vue"
	import HomeRecommendView from "./childComps/HomeRecommendView.vue"
	import HomeFeatureView from "./childComps/HomeFeatureView.vue"
	import {getHomeMultidata} from "network/home.js"
	
	export default {
		name: "Home",
		components: {
			NavBar,
			HomeSwiper,
			HomeRecommendView,
			HomeFeatureView
		},
		data() {
			return {
				// 请求下来的数据分类保存
				banners: [],
				dKeywords: [],
				keywords: [],
				recommends: []
			}
		},
		// 生命周期函数
		created() {
			// 请求多个数据
			getHomeMultidata().then(res => {
				this.banners = res.data.banner.list;
				this.dKeywords = res.data.dKeyword.list;
				this.keywords = res.data.keywords.list;
				this.recommends = res.data.recommend.list;
			})
		}
	}
</script>

<style>
	#home {
		padding-top: 44px;
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
</style>
