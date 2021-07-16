<script>
	import logonApi from './api/logon'
	import {mapActions} from 'vuex'
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
			this.getChatList()
		},
		onShow: function() {
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.socket.emit('setRoom',{"_id": res.data._id})
				}
			})
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {  
		    ...mapActions(['getLoginToken', 'getChatList', 'getUserInfo'])  
		}  
	}
</script>

<style>
	/*每个页面公共css */
</style>
<style lang="scss">
@import "uview-ui/index.scss";
</style>
