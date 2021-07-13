<template>
	<view>
		<view class="user-avatar margin-bt">
			<view class="left">
				<image src="../../static/lufei.jpg" mode=""></image>
			</view>
			<view class="right">
				<view class="nick-name">
					Keep
				</view>
				<view class="we-chat-nub">
					<view class="number">
						<view class="o-f">
							微信号：1743413502微信号：1743413502微信号：1743413502微信号：1743413502
						</view>
					</view>
					<view class="qr-code">
						<image src="../../static/commonImg/qr-code.png" mode=""></image>
					</view>
					<view class="arrow">
						<uni-icons type="arrowright" style="color: #b2b2b2"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view class="list" v-for="(item, index) in listData" :key="index" :class="!item.borderAndMargin ? 'margin-bt' : ''" @tap="bindClick(item)">
			<view class="left">
				<image :src="item.img" mode=""></image>
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				listData: [
					{
						id: 1,
						img: '../../static/commonImg/zf.png',
						name: '支付',
						imgType: false,
						zan: false,
						borderAndMargin: false,
						jumpURL: ''
					},
					{
						id: 2,
						img: '../../static/commonImg/sc.png',
						name: '收藏',
						imgType: false,
						zan: false,
						borderAndMargin: true,
						jumpURL: ''
					},
					{
						id: 3,
						img: '../../static/commonImg/xc.png',
						name: '相册',
						imgType: false,
						zan: false,
						borderAndMargin: true,
						jumpURL: ''
					},
					{
						id: 4,
						img: '../../static/commonImg/kb.png',
						name: '卡包',
						imgType: false,
						zan: false,
						borderAndMargin: true,
						jumpURL: '../logon/login'
					},
					{
						id: 5,
						img: '../../static/commonImg/bq.png',
						name: '表情',
						imgType: false,
						zan: false,
						borderAndMargin: false,
						jumpURL: '../logon/register'
					},
					{
						id: 6,
						img: '../../static/commonImg/sz.png',
						name: '设置',
						imgType: false,
						zan: false,
						borderAndMargin: false,
						jumpURL: './setting/setting'
					}
				]
			}
		},
		onReady() {
			uni.setNavigationBarColor({
				frontColor: "#000000",	//文字颜色
				backgroundColor: "#ffffff"	//底部背景色
			})
		},
		methods: {
			bindClick: function (item){
				console.log(item)
				uni.navigateTo({
				    url: item.jumpURL
				});
			},
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
			height: 60rpx;
			flex: 0 0 50rpx;
			padding: 0 28rpx;
			align-self: center;
			display: flex;
			position: relative;
			image {
				width: 46rpx;
				height: 46rpx;
				align-self: center;
				border-radius: 10rpx;
			}
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
