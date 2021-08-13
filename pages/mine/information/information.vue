<template>
	<view>
		<view class="list" v-for="(item, index) in listData" :key="index" :class="!item.borderAndMargin ? 'margin-bt' : ''" @tap="tapListID(item)">
			<view class="left">
			</view>
			<view class="right" :class="!item.borderAndMargin ? 'border-no' : ''">
				<view class="name">
					{{item.name}}
				</view>
				<view class="right-right">
					<image v-if="item.imgType" :src="userInfo.avatar" mode=""></image>
					<image v-if="item.id === 4" style="width: 40rpx; height: 40rpx;" src="../../../static/commonImg/qr-code.png" mode=""></image>
					<text v-if="item.id === 2" style="display: block; width: 400rpx;">{{userInfo.nickName}}</text>
					<text v-if="item.id === 3">{{userInfo.mail}}</text>
				</view>
				<view class="arrow">
					<uni-icons type="arrowright" style="color: #b2b2b2"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	export default {
		data() {
			return {
				listData: [
					{
						id: 1,
						img: '',
						name: '头像',
						imgType: true,
						zan: false,
						borderAndMargin: true
					},
					{
						id: 2,
						img: '',
						name: '昵称',
						imgType: false,
						zan: false,
						borderAndMargin: true
					},
					{
						id: 3,
						img: '',
						name: '微信号',
						imgType: false,
						zan: false,
						borderAndMargin: true
					},
					{
						id: 4,
						img: '',
						name: '二维码名片',
						imgType: false,
						zan: false,
						borderAndMargin: true
					},
					{
						id: 5,
						img: '',
						name: '性别',
						imgType: false,
						zan: false,
						borderAndMargin: false
					},
					{
						id: 6,
						img: '',
						name: '地区',
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
		computed: {
		    ...mapState(['userInfo'])
		},
		methods: {
			...mapActions(['quitLogin']),
			tapListID: function (row) {
				if (row.id === 4) {
					uni.navigateTo({
					    url: "./qrCode"
					});
				}
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
			.right-right {
				display: flex;
				align-self: center;
				text-align: right;
				color: #999999;
				image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 8rpx;
					margin-right: 10rpx;
				}
			}
			.arrow {
				flex: 0 0 20rpx;
				align-self: center;
			}
		}
	}
</style>
