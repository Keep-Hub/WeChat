<script>
	import logonApi from './api/logon'
	import userInfoApi from './api/userInfo.js'
	import {mapState, mapActions} from 'vuex'
	export default {
		onLaunch: function() {
			  // uni.clearStorage();
			  switch(uni.getSystemInfoSync().platform){
			      case 'android':
			         console.log('运行Android上')
					 // 手机禁止横屏 app
					 plus.screen.lockOrientation("portrait-primary");
			         break;
			      case 'ios':
			         console.log('运行iOS上')
			         break;
			      default:
			         console.log('运行在开发者工具上')
			         break;
			  }
		},
		computed: {
		    ...mapState(['userInfo','chatList','AllBadge', 'token'])
		},
		onShow: function() {
			this.$nextTick(function(){
				if (this.token === '') {
					uni.reLaunch({
							url: './pages/logon/login'
					})
				} else {
					logonApi.testToken({token: this.token}).then(data => {
						if (data.code === 2001) {
							uni.setStorageSync('userInfo', data.result)
							uni.setStorageSync('token', data.token)
							let d = {
								result: {},
								token: ''
							}
							this.getLoginToken(d)
							uni.reLaunch({
							    url: './pages/logon/login'
							});
						}
					})
				}
			})
			
			uni.getStorage({
				key: 'token',
				success:(res) => {
				},
				fail: (res) => {
					
				}
			});
			this.getUserInfo()
			this.joinSocket()
			this.linkSocketMsg()
			uni.$on('setTabBarItem', async(res) => {
				await this.getChatList()
				await this.getAllBadge()
				await this.getBadge(this.AllBadge)
			})
			uni.$on('toJoinSocket', res => {
				this.joinSocket()
			})
			uni.$on('updataMsg', res => {
				this.updataMsg(res.sendId, res)
			})
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {  
		    ...mapActions(['getLoginToken', 'getChatList', 'getUserInfo', 'getAllBadge']),
			getBadge: function (data) {
				uni.$emit('setWeChatTitleBadge', data.unreadMsg)
				if (data.unreadMsg > 0) {
					uni.setTabBarBadge({
						index: 0,
						text: data.unreadMsg >= 99 ? '99+' : data.unreadMsg.toString()
					})
				} else {
					uni.hideTabBarRedDot({
						index: 0,
					})
				}
				// plus.runtime.setBadgeNumber(data.unreadMsg);
			},
			joinSocket: function () {
				setTimeout(() => {
					if (this.userInfo !== '' && this.token !== '') {
						this.socket.emit('setRoom',{"_id": this.userInfo._id})
					} else {
						console.log('用户信息无效, 连接socket失败')
					}
				}, 1000)
			},
			linkSocketMsg: function () {
				this.socket.on('getMassage', data => {
					let chatData = []
					uni.getStorage({
						key: this.userInfo._id + '_' + data.userId,
						success: (res) => {
							chatData = res.data;
							chatData.push(data)
							uni.setStorageSync(this.userInfo._id + '_' + data.userId, chatData)
							this.updataMsg(data.userId, data)
						},
						fail: (err) => {
							chatData.push(data)
							uni.setStorageSync(this.userInfo._id + '_' + data.userId, chatData)
							this.updataMsg(data.userId, data)
						}
					})
				})
			},
			updataMsg: function (id, data) {
				uni.getStorage({
					key: this.userInfo._id + 'chatList',
					success: (res) => {
						let findId = res.data.findIndex(item => item.id === id)
						if (findId === -1) {
							userInfoApi.getVerifyBuddy({_id: this.userInfo._id, sendId: id}).then(res => {
								const row = res.result[0]
								let n = {
										id: row.buddyId,
										img: row.img,
										name: row.nickName,
										new: data.msg,
										time: data.time,
										hot: data.hot,
										remind: false,
										swipe: row.swipe,
										showSwipe: row.showSwipe,
										clickBtnFlag: false,
										clearTime: null
									}
								this.chatList.push(n)
								uni.setStorageSync(this.userInfo._id + 'chatList', this.chatList);
								uni.$emit('setTabBarItem')
							})
						} else {
							res.data.forEach(item => {
								if (item.id === id) {
									item.new = data.msg
									item.time = data.time
								}
							})
							uni.setStorageSync(this.userInfo._id + 'chatList', res.data);
							uni.$emit('setTabBarItem')
						}
					},
					fail: (err) => {
						userInfoApi.getVerifyBuddy({_id: this.userInfo._id, sendId: id}).then(res => {
							const row = res.result[0]
							let n = {
									id: row.buddyId,
									img: row.img,
									name: row.nickName,
									new: data.msg,
									time: data.time,
									hot: data.hot,
									remind: false,
									swipe: row.swipe,
									showSwipe: row.showSwipe,
									clickBtnFlag: false,
									clearTime: null
								}
							this.chatList.push(n)
							uni.setStorageSync(this.userInfo._id + 'chatList', this.chatList);
							uni.$emit('setTabBarItem')
						})
					}
				})
			},
		}  
	}
</script>

<style>
	/*每个页面公共css */
</style>
<style lang="scss">
@import "uview-ui/index.scss";
</style>
