<template>
	<div class="goods">
		<goods-list-iteam v-for="item in goods" :goodsIteam="item"></goods-list-iteam>
	</div>
</template>

<script>
	import GoodsListIteam from "./GoodsListIteam.vue"
	
	export default {
		name: "GoodsList",
		components: {
			GoodsListIteam
		},
		props: {
			goods: {
				type: Array,
				default() {
					return []
				}
			}
		}
	}
</script>

<style scoped>
	.goods {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		padding: 2px;
	}
</style>
