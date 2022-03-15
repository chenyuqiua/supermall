import {debounce} from "./utils";

import BackTop from "components/content/backTop/BackTop.vue"

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    this.refresh = debounce(this.$refs.scroll.refresh, 500);
    this.itemImgListener = () => {
      this.refresh()
    };
    this.$bus.$on('itemImgLoad', this.itemImgListener);
    // console.log('我是混入的操作');
  }
}

// 混入backTop
export const backTopMixin = {
	components: {
		BackTop
	},
	data() {
		return {
			isShowBackTop: false,
		}
	},
	methods: {
		backClick() {
			this.$refs.scroll.scrollTo(0, 0, 500)
		}
	}
}
