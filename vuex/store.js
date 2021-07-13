import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
Vue.use(Vuex)
// 应用初始状态
const state = {
	loginState: false,
	userInfo: {}
}
// 定义所需的 mutations
const mutations = {
  hasLogin: (state, data) => {
    state.loginState = data.token? true : false,
	state.userInfo = data.result[0]
	uni.setStorageSync('userInfo', data.result[0])
	uni.setStorageSync('token', data.token)
	if (state.loginState === false) {
	}
  },
  getUserInfo: (state, data) => {
	  return state.userInfo
  }
}
// 创建 store 实例
export default new Vuex.Store({
  actions,
  state,
  mutations
})