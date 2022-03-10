<template>
		<tab-bar>
			<!-- 如果要自己更改文字颜色，可在标签的属性activeColor=""设置，默认为红色 -->
			<tab-bar-item path="/home" activeColor="deepPink">
				<img src="~assets/img/tabbar/home.svg" alt="" slot = "item-icon">
				<img src="~assets/img/tabbar/home_active.svg" alt="" slot = "item-icon-active">
				<div slot = "item-text">首页</div>
			</tab-bar-item>
			<tab-bar-item  path="/category" activeColor="deepPink">
				<img src="~assets/img/tabbar/category.svg" alt="" slot = "item-icon">
				<img src="~assets/img/tabbar/category_active.svg" alt="" slot = "item-icon-active">
				<div slot = "item-text">分类</div>
			</tab-bar-item>
			<tab-bar-item  path="/cart" activeColor="deepPink">
				<img src="~assets/img/tabbar/shopcart.svg" alt="" slot = "item-icon">
				<img src="~assets/img/tabbar/shopcart_active.svg" alt="" slot = "item-icon-active">
				<div slot = "item-text">购物车</div>
			</tab-bar-item>
			<tab-bar-item  path="/profile" activeColor="deepPink">
				<img src="~assets/img/tabbar/profile.svg" alt="" slot = "item-icon">
				<img src="~assets/img/tabbar/profile_active.svg" alt="" slot = "item-icon-active">
				<div slot = "item-text">我的</div>
			</tab-bar-item>
		</tab-bar>
</template>

<script>
	import TabBar from "components/common/tabbar/TabBar.vue"
	import TabBarItem from "components/common/tabbar/TabBarItem.vue"
	
	export default {
		name: "MainTabBar",
		components: {
			TabBar,
			TabBarItem
		}
	}
</script>

<style>
</style>
