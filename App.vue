<script>
	import logonApi from './api/logon'
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
			uni.getStorage({
				key: 'token',
				success:(res) => {
					logonApi.testToken({token: res.data}).then(data => {
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
				},
				fail: (res) => {
					console.log(res)
					uni.reLaunch({
							url: './pages/logon/login'
					});
				}
			});
			this.getUserInfo()
		},
		computed: {
		    ...mapState(['userInfo','chatList','AllBadge'])
		},
		onShow: function() {
			this.getChatList()
			this.getAllBadge()
			this.getBadge(this.AllBadge)
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.socket.emit('setRoom',{"_id": res.data._id})
					console.log('连接websocket')
				},
				fail: (err) => {
					console.log('用户信息无效')
				}
			})
			uni.$on('setTabBarItem', res => {
				this.getChatList()
				this.getAllBadge()
				this.getBadge(this.AllBadge)
			})
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {  
		    ...mapActions(['getLoginToken', 'getChatList', 'getUserInfo', 'getAllBadge']),
			getBadge: function (data) {
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
			}
		}  
	}
</script>

<style>
	/*每个页面公共css */
</style>
<style lang="scss">
@import "uview-ui/index.scss";
</style>
