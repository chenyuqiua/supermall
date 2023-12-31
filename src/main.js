import Vue from 'vue'
import App from './App.vue'
import router from './router/intex.js'
import store from './store/index.js'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
	router,
	store
}).$mount('#app')
