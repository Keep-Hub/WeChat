import Vue from 'vue'
import App from './App'
import io from 'socket/weapp.socket.io.js'

Vue.config.productionTip = false
Vue.prototype.socket = io('http://10.10.20.128:8082')
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
