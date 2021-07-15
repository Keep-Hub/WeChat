<script>
	import logonApi from './api/logon'
	import {mapActions} from 'vuex'
	export default {
		onLaunch: function() {
			// uni.clearStorage();
			// 手机禁止横屏 app 
			// plus.screen.lockOrientation("portrait-primary");
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
		    ...mapActions(['getLoginToken', 'getChatList'])  
		}  
	}
</script>

<style>
	/*每个页面公共css */
</style>
<style lang="scss">
@import "uview-ui/index.scss";
</style>
