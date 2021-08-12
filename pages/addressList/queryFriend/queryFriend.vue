<template>
	<view>
		<view class="user-avatar" @tap="toInformation()">
			<view class="left">
				<image :src="friendInfo.avatar" mode=""></image>
			</view>
			<view class="right">
				<view class="nick-name">
					{{friendInfo.nickName}}
				</view>
				<view class="we-chat-nub">
					地区：广东 广州
				</view>
			</view>
		</view>
		<view class="list" v-for="(item, index) in listData" :key="index" :class="!item.borderAndMargin ? 'margin-bt' : ''" @tap="bindClick(item)">
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
			<view v-if="isFriend === '1'" style="width: 100%;text-align: center;font-size: 32rpx;padding: 30rpx 0; color: #5b6a91; font-weight: bolder; letter-spacing: 2rpx;" @tap="sendMsg">
				发送消息
			</view>
			<view v-else style="width: 100%;text-align: center;font-size: 32rpx;padding: 30rpx 0; color: #5b6a91; font-weight: bolder; letter-spacing: 2rpx;" @tap="addFriend">
				添加到通讯录
			</view>
		</view>
	</view>
</template>

<script>
	import addFriend from '../../../api/friend.js'
	import {mapState, mapActions} from 'vuex'
	export default {
		data() {
			return {
				listData: [
					{
						id: 1,
						img: '',
						name: '设置备注和标签',
						imgType: false,
						zan: false,
						borderAndMargin: true,
						jumpURL: ''
					},
					{
						id: 2,
						img: '',
						name: '个性签名',
						imgType: false,
						zan: false,
						borderAndMargin: true,
						jumpURL: ''
					},
					{
						id: 3,
						img: '',
						name: '朋友圈',
						imgType: false,
						zan: false,
						borderAndMargin: false,
						jumpURL: ''
					}
				],
				friendInfo: {},
				isFriend: ''
			}
		},
		computed: {
		    ...mapState(['userInfo'])
		},
		onLoad(option) {
			if (option.isFriend) {
				this.isFriend = option.isFriend
				this.friendInfo = JSON.parse(decodeURIComponent(option.friendInfo))
			}
		},
		onReady() {
			uni.setNavigationBarColor({
				frontColor: "#000000",	//文字颜色
				backgroundColor: "#ffffff"	//底部背景色
			})
		},
		methods: {
			sendMsg: function() {},
			toInformation: function () {
				uni.navigateTo({
				    url: "./information/information"
				});
			},
			bindClick: function (item){
				console.log(item)
				uni.navigateTo({
				    url: item.jumpURL
				});
			},
			addFriend: function () {
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
			height: 200rpx;
			background-color: #FFFFFF;
			display: flex;
			flex-wrap: nowrap;
			padding: 0 40rpx 40rpx;
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
					font-size: 36rpx;
				}
				.we-chat-nub {
					font-size: 24rpx;
					color: #7f7f7f;
					display: flex;
					flex-wrap: nowrap;
					margin-top: 10rpx;
					padding-right: 60rpx;
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
		.right {
			width: 100%;	
			display: flex;
			flex-wrap: nowrap;
			border-top: 1rpx solid #f4f4f4;
			padding: 24rpx 20rpx 24rpx 0;
			margin-left: 40rpx;
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
