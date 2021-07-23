<template>
	<view>
		<view class="list" v-for="(item, index) in listData" :key="index" :class="!item.borderAndMargin ? 'margin-bt' : ''">
			<view class="left">
			</view>
			<view class="right" :class="!item.borderAndMargin ? 'border-no' : ''">
				<view class="name">
					{{item.name}}
				</view>
				<view class="arrow">
					<uni-icons type="arrowright" style="color: #b2b2b2"></uni-icons>
				</view>
			</view>
		</view>
		<view class="list">
			<view style="width: 100%;text-align: center;font-size: 32rpx;padding: 30rpx 0; color: #dd524d;" @tap="_quitLogin">
				退出登录
			</view>
		</view>
	</view>
</template>

<script>
	import {mapActions} from 'vuex'
	export default {
		data() {
			return {
				listData: [
					{
						id: 1,
						img: '../../static/commonImg/zf.png',
						name: '账号与安全',
						imgType: false,
						zan: false,
						borderAndMargin: false
					},
					{
						id: 2,
						img: '../../static/commonImg/sc.png',
						name: '青少年模式',
						imgType: false,
						zan: false,
						borderAndMargin: true
					},
					{
						id: 3,
						img: '../../static/commonImg/xc.png',
						name: '新消息通知',
						imgType: false,
						zan: false,
						borderAndMargin: true
					},
					{
						id: 4,
						img: '../../static/commonImg/kb.png',
						name: '隐私',
						imgType: false,
						zan: false,
						borderAndMargin: true
					},
					{
						id: 5,
						img: '../../static/commonImg/bq.png',
						name: '通用',
						imgType: false,
						zan: false,
						borderAndMargin: false
					},
					{
						id: 6,
						img: '../../static/commonImg/sz.png',
						name: '关于微信',
						imgType: false,
						zan: false,
						borderAndMargin: false
					}
				]
			}
		},
		onReady() {
			uni.setNavigationBarColor({
				frontColor: "#000000",	//文字颜色
				backgroundColor: "#F7F7F7"	//底部背景色
			})
		},
		methods: {
			...mapActions(['quitLogin']),
			_quitLogin: function() {
				uni.$emit('setTabBarItem')
				uni.getStorage({
					key: 'userInfo',
					success: (res) => {
						this.socket.emit('leaveRoom',{"_id": res.data._id})
					},
					fail: (err) => {
						console.log('无用户信息')
					}
				})
				this.quitLogin()
				uni.reLaunch({
						url: '../../logon/login'
				});
				// this.$router.go(0)
			}
		}
	}
</script>

<style lang="scss">
page {
		background-color: #F7F7F7;
	}
	.border-no {
		border-bottom: none!important;
	}
	.margin-bt{
		margin-bottom: 30rpx;
	}
	.user-avatar{
		width: 100%;
		height: 160rpx;
		background-color: #FFFFFF;
		display: flex;
		flex-wrap: nowrap;
		padding: 40rpx;
		.left {
			height: 120rpx;
			flex: 0 0 120rpx;
			position: relative;
			align-self: center;
			image {
				width: 100%;
				height: 100%;
				border-radius: 10rpx;
			}
		}
		.right {
			width: 100%;
			padding-left: 30rpx;
			align-self: center;
			.nick-name {
				width: 100%;
				font-weight: bold;
				margin-bottom: 30rpx;
			}
			.we-chat-nub {
				font-size: 28rpx;
				color: #7f7f7f;
				display: flex;
				flex-wrap: nowrap;
				padding-right: 60rpx;
				.number {
					flex: 1;
					.o-f {
						width: 400rpx;
						align-self: center;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
					}
				}
				.qr-code {
					flex: 0 0 50rpx;
					align-self: center;
					display: flex;
					image {
						width: 30rpx;
						height: 30rpx;
						align-self: center;
					}
				}
				.arrow {
					flex: 0 0 20rpx;
					align-self: center;
				}
			}
		}
	}
	.list {
		width: 100%;
		height: auto;
		display: flex;
		flex-wrap: nowrap;
		font-size: 28rpx;
		background-color: #FFFFFF;
		.left {
			flex: 0 0 30rpx;
			align-self: center;
			display: flex;
			position: relative;
		}
		.right {
			width: 100%;
			display: flex;
			flex-wrap: nowrap;
			border-bottom: 1rpx solid #f4f4f4;
			padding: 24rpx 20rpx 24rpx 0;
			.name {
				width: 100%;
				align-self: center;
				font-size: 32rpx;
			}
			.arrow {
				flex: 0 0 20rpx;
				align-self: center;
			}
		}
	}
</style>
