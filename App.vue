<script>
	import logonApi from './api/logon'
	import userInfoApi from './api/userInfo.js'
	import {mapState, mapActions} from 'vuex'
	export default {
		onLaunch: function() {
			//#ifdef APP-PLUS
				plus.screen.lockOrientation("portrait-primary");
			//#endif
			//#ifdef H5
			//#endif
			// uni.clearStorage();
		},
		computed: {
		    ...mapState(['userInfo','chatList','AllBadge', 'token'])
		},
		onShow: function() {
			//监听网络状态变化
			uni.onNetworkStatusChange((res)=>{
				uni.$emit('networkStatus', res)
				if (res.isConnected) {
					this.$nextTick(function(){
						this.joinSocket(this.userInfo.openid)
					})
				} else {
					this.socket.emit('leaveRoom',{"openid": this.userInfo.openid})
				}
			});
			this.$nextTick(function(){
				if (this.token === '') {
					uni.reLaunch({
							url: './pages/logon/login'
					})
				} else if (this.userInfo !== '' && this.token !== '') {
					this.joinSocket(this.userInfo.openid)
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
			this.getUserInfo()
			this.linkSocketMsg()
			uni.$on('setTabBarItem', async(res) => {
				await this.getChatList()
				await this.getAllBadge()
				await this.getBadge(this.AllBadge)
			})
			uni.$on('toJoinSocket', res => {
				this.joinSocket(res.result[0].openid)
			})
			uni.$on('updataMsg', res => {
				this.updataMsg(res.sendId, res)
			})
		},
		onHide: function() {
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
				if (data.newApply > 0) {
					uni.setTabBarBadge({
						index: 1,
						text: data.newApply >= 99 ? '99+' : data.newApply.toString()
					})
				} else {
					uni.hideTabBarRedDot({
						index: 1,
					})
				}
				
				// plus.runtime.setBadgeNumber(data.unreadMsg);
			},
			joinSocket: function (linkId) {
				this.socket.emit('setRoom',{"openid": linkId})
			},
			linkSocketMsg: function () {
				this.socket.on('getMassage', async data => {
					//#ifdef APP-PLUS
					uni.vibrateLong({
					    success: function () {
					        console.log('震动');
					    }
					});
					if (data.msgType === 3) {
							await this.downloadFile(data.thumbnail).then( res => {
								data.thumbnail = res.savedFilePath
							})
					} else if (data.msgType === 2) {
						await this.downloadFile(data.path).then( res => {
							data.path = res.savedFilePath
						})
					}
					//#endif
					// 聊天页面接收
					let pages = getCurrentPages(); //当前页
					if (pages[pages.length - 1].route === "pages/personal/chatRoom/chatRoom") {
						// 获取当前聊天的对象
						let currentChatId = pages[pages.length - 1].options.item.indexOf(data.userId)
						if (currentChatId !== -1) {
							data.hot = 0
							uni.$emit('chatRoomReception', data)
						}
						
					}
					let chatData = []
					await uni.getStorage({
						key: this.userInfo.openid + '_' + data.userId,
						success: (res) => {
							chatData = res.data;
							chatData.push(data)
							uni.setStorageSync(this.userInfo.openid + '_' + data.userId, chatData)
							this.updataMsg(data.userId, data)
						},
						fail: (err) => {
							chatData.push(data)
							uni.setStorageSync(this.userInfo.openid + '_' + data.userId, chatData)
							this.updataMsg(data.userId, data)
						}
					})
				})
				this.socket.on('getAddNewFriend', data => {
					let add = uni.getStorageSync(this.userInfo.openid + '_newFriend')
					if (add === '') {
						let addArr = []
						addArr.push(data)
						uni.setStorageSync(this.userInfo.openid + '_newFriend', addArr)
					} else {
						add.push(data)
						uni.setStorageSync(this.userInfo.openid + '_newFriend', add)
					}
					uni.$emit('setTabBarItem')
				})
			},
			// 接收图片并且下载
			downloadFile: function(imgUrl) {
				return new Promise((resolve, reject) => {
					uni.downloadFile({
					url: imgUrl,
					success: (res) => {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: function(red) {
								resolve(red)
							}
						});
					},
					fail: (err) => {
						reject(err)
					}
				})
			 })
			},
			updataMsg: function (id, data) {
				uni.getStorage({
					key: this.userInfo.openid + 'chatList',
					success: (res) => {
						let findId = res.data.findIndex(item => item.id === id)
						if (findId === -1) {
							userInfoApi.getVerifyBuddy({openid: this.userInfo.openid, sendId: id}).then(res => {
								const row = res.result
								let n = {
										id: row.openid,
										img: row.avatar,
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
								uni.setStorageSync(this.userInfo.openid + 'chatList', this.chatList);
								uni.$emit('setTabBarItem')
							})
						} else {
							res.data.forEach(item => {
								if (item.id === id) {
									item.new = data.msg
									item.time = data.time
								}
							})
							uni.setStorageSync(this.userInfo.openid + 'chatList', res.data);
							uni.$emit('setTabBarItem')
						}
					},
					fail: (err) => {
						userInfoApi.getVerifyBuddy({openid: this.userInfo.openid, sendId: id}).then(res => {
							const row = res.result
							let n = {
									id: row.openid,
									img: row.avatar,
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
							uni.setStorageSync(this.userInfo.openid + 'chatList', this.chatList);
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
