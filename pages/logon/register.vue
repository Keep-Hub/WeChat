<template>
	<view class="register">
		<view class="last-step" v-if="!nextStep" @tap="_lastStep">上一步</view>
		<view class="last-step" v-else @tap=_toLogin()>取消</view>
		<view v-if="nextStep">
			<view class="register-title">用邮箱注册</view>
			<u-avatar :src="src" mode="square" :show-level="true" :level-icon="src ? '' : 'camera'" @tap="selectAvatar()"></u-avatar>
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
				v-model="nickName"
				label="昵称"
				maxlength="16"
				:clearable="false"
				placeholder="例如: keep"
			>
			</u-field>
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
		<u-message-input v-else :focus="true" value="" font-size="80" width="100" active-color="#18b566" @finish="finish" @change="_change" mode="bottomLine" :maxlength="4" style="margin: 400rpx 0 100rpx 0;"></u-message-input>
		<u-button class="btn" v-if="nextStep" size="medium"  type="success" @tap="_nextStep">下一步</u-button>
		<!-- <u-button class="btn" v-else size="medium"  type="success" :disabled="!btnFinishRegistration">完成注册</u-button> -->
		<u-modal v-model="showModal" :content="content" :show-cancel-button="true" :show-title="false" @confirm="confirmModel" @cancel="cancelModel"></u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import logonApi from '../../api/logon.js'
export default {
	data() {
		return {
			email: "",
			nickName: "",
			code: "",
			showPass: true,
			password: "",
			hidePassword: true,
			src: "",
			nextStep: true,
			btnFinishRegistration: false,
			showEmailTip: false,
			emailArray: [],
			defaultEmail: ['@qq.com', '@163.com', '@sina.com'],
			action: 'http://www.example.com/upload',
			fileList: [
				{
					url: 'https://t7.baidu.com/it/u=1819248061,230866778&fm=193&f=GIF',
				}
			],
			showModal: false,
			content: ''
		}
	},
	onReady() {
		// uni.setNavigationBarColor({
		// 	frontColor: "#000000",	//文字颜色
		// 	backgroundColor: "#F7F7F7"	//底部背景色
		// })
	},
	mounted() {
		// document.querySelector('.uni-page-head-hd').style.display = 'none'
	},
	methods: {
		selectAvatar () {
			uni.chooseImage({
			    count: 1, //默认9
			    sourceType: ['album'], //从相册选择
				crop: {
					quality: 100,
					width: 200,
					height: 200,
					resize: false
				},
			    success: (res) => {
					uni.uploadFile({
							url: 'http://10.10.20.128:8668/sendUploadFile', //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							fileType: 'image',
							name: 'file',
							formData: {
								fileType: 2
							},
							success: (uploadRes) => {
								this.src = JSON.parse(uploadRes.data).normogram
							}
						})
			    }
			});
		},
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
		confirmModel () {
			logonApi.mail({mail: this.email}).then(data => {
				if (data.code === 2000) {
					this.nextStep = false
					this.$refs.uToast.show({
							title: '验证码已发送 请前往邮箱查看',
							type: 'default',
							url: '',
							position: 'top'
					})
				} else {
					this.$refs.uToast.show({
							title: '验证码发送失败',
							type: 'default',
							url: '',
							position: 'top'
					})
				}
			})
		},
		cancelModel () {
			// this.$refs.uToast.show({
			// 		title: '验证码已发送 已取消',
			// 		type: 'default',
			// 		url: ''
			// })
		},
		_nextStep () {
			this.showModal = true
			this.content = '是否向邮箱' + this.email + '发送验证码'
			// logonApi.mail({mail: this.email}).then(data => {
			// 	console.log(data)
			// })
		},
		_lastStep () {
			this.nextStep = true
			this.btnFinishRegistration = false
		},
		finish(e) {
			// console.log(e.length)
			// this.btnFinishRegistration = true
			// console.log('输入结束，当前值为：' + e);
		},
		_change(e) {
			if (e.length < 4 ) {
				this.btnFinishRegistration = false
			} else {
				this.btnFinishRegistration = true
				this.code = Number(e)
				logonApi.checkCode({mail: this.email, code: this.code}).then(data => {
					if (data.code === 2000) {
						let params = {
							mail: this.email,
							nickName: this.nickName,
							password: this.password,
							avatar: this.src
						}
						logonApi.register(params).then(data => {
							if (data.code === 2000) {
								this.$refs.uToast.show({
										title: data.message,
										type: 'default',
										url: ''
								})
								setTimeout(() => {
									uni.navigateTo({
									    url: '../logon/login'
									});
								}, 300)
							} else {
								this.$refs.uToast.show({
										title: data.message,
										type: 'default',
										url: ''
								})
							}
						})
					} else {
						this.$refs.uToast.show({
								title: data.message,
								type: 'default',
								url: '',
								position: 'top'
						})
					}
				})
			}
		},
		showHidePassWord () {
			this.hidePassword = !this.hidePassword
		},
		_toLogin () {
			uni.navigateTo({
			    url: '../logon/login'
			});
		}
	}
}	
</script>

<style lang="scss">
	page {
			background-color: #F7F7F7;
			overflow-y: hidden;
		}
		.register {
			padding: 0 50rpx;
			position: relative;
			.last-step {
				color: #19BE6B;
				position: fixed;
				top: 60rpx;
			}
		}
		.register-title {
			font-size: 64rpx; 
			margin: 120rpx 0 80rpx 0; 
			text-align: center;
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
			margin: 80rpx 0 40rpx 0; 
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
		/deep/ .u-avatar__level {
			border: none!important;
			background-color: transparent!important;
			right: 10rpx!important;
			bottom: 10rpx!important;
		}
		/deep/ .u-avatar {
			position: relative;
			width: 140rpx!important;
			height: 140rpx!important;
			left: 50%;
			margin-left: -70rpx;
			margin-bottom: 40rpx;
		}
		/deep/ .uni-input-placeholder {
			font-size: 32rpx!important;
		}
		/deep/ .uicon-eye-fill, /deep/ .uicon-eye-off {
			font-size: 42rpx !important;
			color: #19be6b!important;
		}
		/deep/ .uicon-camera {
			font-size: 36rpx!important;
			color: #18b566!important;
		}
</style>
