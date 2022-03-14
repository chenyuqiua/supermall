<template>
	<div id="detail">
		<detail-nav-bar class="detail-nav" />
		<scroll class="content" ref="scroll">
			<detail-swiper :topImages="topImages"/>
			<detail-base-info :goods="goods"/>
			<detail-shop-info :shop="shop"/>
			<detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
			<detail-param-info :param-info="paramInfo"/>
			<detail-comment-info :comment-info="commentInfo"/>
			<goods-list :goods="recommends"/>
		</scroll>
	</div>
</template>

<script>
	import DetailNavBar from "./childComps/DetailNavBar.vue"
	import DetailSwiper from "./childComps/DetailSwiper.vue"
	import DetailBaseInfo from "./childComps/DetailBaseInfo.vue"
	import DetailShopInfo from "./childComps/DetailShopInfo.vue"
	import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue"
	import DetailParamInfo from "./childComps/DetailParamInfo.vue"
	import DetailCommentInfo from "./childComps/DetailCommentInfo.vue"
	
	import Scroll from "components/common/scroll/Scroll.vue"
	import GoodsList from "components/content/goods/GoodsList.vue"
	
	import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail.js"
	
	export default {
		name: "Detail",
		data() {
			return {
				iid: null,
				topImages: [],
				goods: {},
				shop: {},
				detailInfo: {},
				paramInfo: {},
				commentInfo: {},
				recommends: []
			}
		},
		components: {
			DetailNavBar,
			DetailSwiper,
			DetailBaseInfo,
			DetailShopInfo,
			DetailGoodsInfo,
			DetailParamInfo,
			DetailCommentInfo,
			Scroll,
			GoodsList
		},
		created() {
			// 1.保存传入的iid
			this.iid = this.$route.params.iid
			
			// 2.根据iid请求详情数据
			getDetail(this.iid).then(res => {
				// --1.获取顶部轮播图数据
				const data = res.result;
				this.topImages = data.itemInfo.topImages
				
				// --2获取商品信息
				this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
				
				// --3获取店铺信息的对象
				this.shop = new Shop(data.shopInfo)
				
				// --4保存商品详情数据
				this.detailInfo = data.detailInfo
				
				// --5获取参数信息
				this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
				
				// --6取出评论信息
				if(data.rate.cRate !== 0) {
					this.commentInfo = data.rate.list[0]
				}
			})
			
			// 3.请求推荐数据
			getRecommend().then(res =>{
				this.recommends = res.data.list
			})
		},
		methods: {
			imageLoad() {
				this.$refs.scroll.refresh()
			}
		}
	}
</script>

<style scoped>
	#detail {
		position: relative;
		z-index: 9;
		background-color: #fff;
		height: 100vh;
	}
	
	.content {
		height: calc(100% - 44px);
	}
	
	.detail-nav {
		position: relative;
		z-index: 9;
		background-color: #fff;
	}
</style>
