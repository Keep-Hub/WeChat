import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
Vue.use(Vuex)
// 应用初始状态
const state = {
	loginState: false,
	userInfo: {
		id: 123
	},
	chatList: [],
	AllBadge: {}
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
	  state.userInfo = uni.getStorageSync('userInfo')
  },
  quitLogin: (state, data) => {
	  uni.removeStorage({
	      key: 'userInfo',
	      success: function (res) {
	          console.log('success');
	      }
	  });
	  uni.removeStorage({
	      key: 'token',
	      success: function (res) {
	          console.log('success');
	      }
	  });
	  console.log('退出登录')
  },
  getChatList(state, data) {
	  let list = uni.getStorageSync(state.userInfo._id + 'chatList')
	  state.chatList = list === '' ? [] : list,
	  state.chatList.sort((a,b) => {
	  	 return Date.parse(new Date(b.time)) - Date.parse(new Date(a.time))
	  })
  },
  getAllBadge (state, data) {
	  // state.chatList.forEach(item => {
		 //  uni.getStorage({
			// key: state.userInfo._id + '_' + item.id,
			// success: (res) => {
			// 	let nub = 0
			// 	let ind = res.data.length
			// 	res.data.slice(ind - 100, ind).forEach(i => {
			// 		if (i.hot === 1) {
			// 			nub++
			// 		}
			// 	})
			// 	item.hot = nub > 99 ? 99 : nub,
			// 	state.AllBadge.unreadMsg = state.chatList.reduce((pre,cur)=>{
			// 	    return pre+cur.hot	
			// 	},0)
			// 	// //  nub = 0
			// }
		 //  })
	  // })
	  // state.AllBadge.unreadMsg = state.chatList.reduce((pre,cur)=>{
	  //     return pre+cur.hot	
	  // },0)
  }
}
// 创建 store 实例
export default new Vuex.Store({
  actions,
  state,
  mutations
})