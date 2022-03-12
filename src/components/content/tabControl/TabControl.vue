<template>
	<div class="tab-control">
		<div v-for="(iteam,index) in titles" 
				 class="tab-control-iteam" 
				 :class="{active: index === currentIndex}" 
				 @click="iteamClick(index)">
			<span>{{iteam}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: "TabControl",
		props: {
			titles: {
				type: Array,
				default() {
					return []
				}
			}
		},
		data() {
			return {
				currentIndex: 0,
			}
		},
		methods: {
			iteamClick(index) {
				this.currentIndex = index;
				this.$emit("tabClick",index)
			}
		}
	}
</script>

<style scoped>
	.tab-control {
		display: flex;
		text-align: center;
		height: 40px;
		line-height: 40px;
		font-size: 15px;
		background-color: #fff;
	}
	
	.tab-control-iteam {
		flex: 1;
	}
	
	.tab-control-iteam span {
		padding: 5px;
	}
	
	.active {
		color: var(--color-high-text);
	}
	
	.active span {
		border-bottom:3px solid var(--color-tint);
	}
</style>
