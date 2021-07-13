import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import io from './socket/weapp.socket.io.js'
import uView from 'uview-ui'
import store from './vuex/store'
Vue.use(uView);
Vue.use(Vuex)

Vue.config.productionTip = false
Vue.prototype.socket = io('http://10.10.20.128:8668')

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
