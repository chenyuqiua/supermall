<template>
	<div id="detail">
		<detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
		<scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
			<detail-swiper :topImages="topImages" />
			<detail-base-info :goods="goods" />
			<detail-shop-info :shop="shop" />
			<detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
			<detail-param-info ref="params" :param-info="paramInfo" />
			<detail-comment-info ref="comment" :comment-info="commentInfo" />
			<goods-list ref="recommend" :goods="recommends" />
		</scroll>
		<detail-bottom-bar @addCart="addToCart"/>
		<back-top @click.native="backClick" v-show="isShowBackTop" />
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
	import DetailBottomBar from "./childComps/DetailBottomBar.vue"

	import Scroll from "components/common/scroll/Scroll.vue"
	import GoodsList from "components/content/goods/GoodsList.vue"
	// import BackTop from "components/content/backTop/BackTop.vue" 混入backTop--1/4

	import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail.js"
	import {itemListenerMixin, backTopMixin} from "common/mixin";

	export default {
		name: "Detail",
		mixins: [itemListenerMixin, backTopMixin],
		data() {
			return {
				iid: null,
				topImages: [],
				goods: {},
				shop: {},
				detailInfo: {},
				paramInfo: {},
				commentInfo: {},
				recommends: [],
				themeTopYs: [],
				currentIndex: 0,
				// isShowBackTop: false 混入backTop--3/4
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
			DetailBottomBar,
			Scroll,
			GoodsList,
			// BackTop混入backTop--2/4
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
				if (data.rate.cRate !== 0) {
					this.commentInfo = data.rate.list[0]
				}

				/* this.$nextTick(() => {
					this.themeTopYs = []
					
					this.themeTopYs.push(0),
					this.themeTopYs.push(this.$refs.params.$el.offsetTop),
					this.themeTopYs.push(this.$refs.comment.$el.offsetTop),
					this.themeTopYs.push(this.$refs.recommend.$el.offsetTop),
					console.log(this.themeTopYs);
				}) */
			})

			// 3.请求推荐数据
			getRecommend().then(res => {
				this.recommends = res.data.list
			})
		},
		mounted() {
			// console.log('detail-mounted');
			//以下代码注释掉是因为使用了混入
			// const refresh = debounce(this.$refs.scroll.refresh, 500);
			// this.$bus.$on('itemImgLoad', () => {
			//   refresh()
			// });
		},
		methods: {
			imageLoad() {
				this.$refs.scroll.refresh()
				// 给数组传入Y值
				this.themeTopYs = []
				this.themeTopYs.push(0),
					this.themeTopYs.push(this.$refs.params.$el.offsetTop),
					this.themeTopYs.push(this.$refs.comment.$el.offsetTop),
					this.themeTopYs.push(this.$refs.recommend.$el.offsetTop),
					this.themeTopYs.push(Number.MAX_VALUE)
			},
			titleClick(index) {
				// console.log(index);
				this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
			},
			contentScroll(position) {
				// console.log(position)
				// 1.获取Y值
				const positionY = -position.y

				// 2.positionY和主题中的值对比
				let length = this.themeTopYs.length;
				for (let i = 0; i < length - 1; i++) {
					// 优化条件判断
					if (this.currentIndex !== i &&
						(positionY >= this.themeTopYs[i] &&
						 positionY < this.themeTopYs[i + 1])) {
						this.currentIndex = i;
						this.$refs.nav.currentIndex = this.currentIndex;
					}

					/* if (this.currentIndex !== i &&
						((i < length - 1 && positionY >= this.themeTopYs[i] &&
								positionY < this.themeTopYs[i + 1]) ||
							(i === length - 1 && positionY >= this.themeTopYs[i]))) {
						this.currentIndex = i;
						this.$refs.nav.currentIndex = this.currentIndex;
					} */
				}
				
				// 3.判断BackTop是否显示 必须在无法混入
				this.isShowBackTop = (-position.y) > 1000
			},
			// backClick() {
			// 	this.$refs.scroll.scrollTo(0, 0, 500)
			// }混入backTop--4/4
			
			addToCart() {
				// --1.获取购物车需要展示的信息
				const product = {}
				product.image = this.topImages[0];
				product.title = this.goods.title;
				product.desc = this.goods.desc;
				product.price = this.goods.realPrice;
				product.iid = this.iid;
				
				// --2将商品添加到购物车里面
				// this.$store.commit('addCart', product)
				// this.$store.dispatch("addCart", product)
				this.$store.dispatch('addCart', product)
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
		height: calc(100% - 44px - 49px);
	}

	.detail-nav {
		position: relative;
		z-index: 9;
		background-color: #fff;
	}
</style>
