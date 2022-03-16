<template>
	<div class="bottom-bar">
		<!-- 全选按钮 -->
		<div class="check-content">
			<check-button :is-checked="isSelectAll" 
										class="check-button" 
										@click.native="checkClick"/>
			<span>全选</span>
		</div>
		<!-- 合计价格 -->
		<div class="price">
			合计: {{totalPrice}}
		</div>
		<!-- 结算价格 -->
		<div class="calculate">
				去结算({{checkLength}})
		</div>
	</div>
</template>

<script>
	import CheckButton from "components/content/checkButton/CheckButton.vue"
	import {mapGetters} from "vuex"
	export default {
		name: "CartBottomBar",
		components: {
			CheckButton
		},
		methods: {
			checkClick() {
				if(this.isSelectAll) {//全部选中时
					this.cartList.forEach(item => item.checked = false)
				} else {//部分选中时
					this.cartList.forEach(item => item.checked = true)
				}
			}
		},
		computed: {
			...mapGetters(["cartList"]),
			totalPrice() {
				return "￥" + this.cartList.filter(item => {
					return item.checked
				}).reduce((preValue, item) => {
					return preValue + item.price * item.count
				},0).toFixed(2)
			},
			checkLength() {
				return this.cartList.filter(item => item.checked).length
			},
			isSelectAll() {
				if(this.cartList.length === 0) return false
				// return !(this.cartList.filter(item => !item.checked).length)
				return !this.cartList.find(item => !item.checked)
			}
		}
	}
</script>

<style scoped>
	.bottom-bar {
		position: relative;
		display: flex;
		
		height: 40px;
		line-height: 40px;
		font-style: 14px;
		
		background-color: #eee;
	}
	
	.check-content {
		display: flex;
		align-items: center;
		margin-left: 10px;
		width: 60px;
	}
	
	.check-button {
		width: 20px;
		height: 20px;
		line-height: 20px;
		margin-right: 5px;
	}
	
	.price {
		margin-left: 20px;
		flex: 1;
	}
	
	.calculate {
		width: 90px;
		color: #fff;
		background: red;
		text-align: center;
	}
</style>
