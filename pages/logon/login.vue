<template>
	<view class="login">
		<view>
			<view class="login-title">登录</view>
			<u-field
				v-model="email"
				label="邮箱"
				:clearable="true"
				placeholder="请填写邮箱"
				@input="_emailTip"
				maxlength="24"
				style="position: relative!important;"
				@blur="emailBlur"
				@focus="emailFocus"
			>
			</u-field>
			<view class="email-tip" v-if="showEmailTip">
				<view class="email-tip-item" v-for="(item, index) in emailArray" :key="index" @tap="tapEmail(item)">
					{{item}}
				</view>
			</view>
			<u-field
				v-model="password"
				label="密码"
				type="text"
				:password="hidePassword"
				:clearable="false"
				placeholder="请填写密码"
				maxlength="16"
				v-if="showPass"
				:right-icon="hidePassword ? 'eye-off' : 'eye-fill'"
				@right-icon-click="showHidePassWord"
			>
			</u-field>
		</view>
		<u-button class="btn" size="medium"  type="success" @tap="_login">登录</u-button>
		<u-button class="btn" size="medium"  type="success" @tap="_TOKEN">TOKEN</u-button>
		<u-modal v-model="showModal" :content="content" :show-cancel-button="true" :show-title="false" @confirm="confirmModel" @cancel="cancelModel"></u-modal>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
	import logonApi from '../../api/logon.js'
	import {mapActions} from 'vuex'
export default {
	data() {
		return {
			email: "",
			showPass: true,
			password: "",
			hidePassword: true,
			showEmailTip: false,
			emailArray: [],
			defaultEmail: ['@qq.com', '@163.com', '@sina.com'],
			showModal: false,
			content: '',
			token: ''
		}
	},
	onReady() {
	},
	mounted() {
	},
	methods: {
		...mapActions(['getLoginToken']),
		_emailTip (e) {
			if (e.length > 0) {
				this.showEmailTip = true
			} else {
				this.showEmailTip = false
			}
			this._tips()
		},
		_tips () {
			let newText = this.email
			let flag = ''
			if (newText.indexOf('@') > 0) {
				flag = newText.substring(newText.indexOf('@') - 1)
				newText = newText.substring(0, newText.indexOf('@'));
			} else {
				flag = ''
			}
			let arr = []
			let reg = new RegExp(flag, "i");
			this.defaultEmail.forEach(item => {
				item = newText + item
				if (reg.test(item) && this.email !== item && this.email.indexOf('@') !== 0) {
					arr.push(item)
				}
			} )
			if (arr.length === 0) {
				this.showEmailTip = false
			}
			this.emailArray = arr
		},
		tapEmail (item) {
			this.email = item
			this.showEmailTip = false
		},
		emailBlur () {
			setTimeout(() => {
				this.showEmailTip = false
			}, 100)
			// this.showEmailTip = false
		},
		emailFocus () {
			if (this.email.length > 0) {
				this.showEmailTip = true
				this._tips()
			}
		},
		_login () {
			let params = {
				mail: this.email,
				password: this.password,
			}
			logonApi.login(params).then(data => {
				if (data.code === 2000) {
					this.token = data.token
					// uni.setStorageSync('token', data.token)
					this.getLoginToken(data)
					this.socket.emit('setRoom',{"_id": data.result[0]._id})
					uni.switchTab({
					    url: '../index/index'
					});
				}
				this.$refs.uToast.show({
						title: data.message,
						type: 'default',
						url: ''
				})
			})
		},
		_TOKEN () {
			logonApi.testToken({token: this.token}).then(data => {
				// console.log(new Date(parseInt(data.createTime)))
				// console.log(new Date(parseInt(data.createTime + data.expiresIn)))	
			})
		},
  		confirmModel () {
		},
		cancelModel () {
		},
		finish(e) {
			// console.log(e.length)
			// this.btnFinishRegistration = true
			// console.log('输入结束，当前值为：' + e);
		},
		showHidePassWord () {
			this.hidePassword = !this.hidePassword
		}
	}
}	
</script>

<style lang="scss">
	page {
			background-color: #F7F7F7;
			overflow-y: hidden;
		}
		.login {
			padding: 0 50rpx;
		}
		.login-title {
			font-size: 64rpx; 
			margin: 120rpx 0 120rpx 0; 
		}
		.email-tip {
			min-width: 100rpx;
			background-color: #FFFFFF;
			position: absolute;
			z-index: 9999;
			left: 180rpx;
			padding: 10rpx 20rpx;
			.email-tip-item {
				font-size: 32rpx;
				line-height: 58rpx;
				color: #303133;
			}
		}
		.btn {
			width: 100%!important; 
			margin: 80rpx 0; 
			height: 80rpx!important; 
			font-size: 34rpx!important;
		}
		/deep/ .u-field {
			padding: 20rpx 0;
			font-size: 32rpx!important;
			margin-bottom: 10rpx;
		}
		/deep/ .uni-input-input {
			font-size: 32rpx!important;
		}
		/deep/ .uni-input-placeholder {
			font-size: 32rpx!important;
		}
		/deep/ .uicon-eye-fill, /deep/ .uicon-eye-off {
			font-size: 42rpx !important;
			color: #19be6b!important;
		}
</style>
