<template>
	<view>
		<view class="list" v-for="(item, index) in listData" :key="index" :class="!item.borderAndMargin ? 'margin-bt' : ''">
			<view class="left">
				<image :src="item.img" mode=""></image>
			</view>
			<view class="right" :class="!item.borderAndMargin ? 'border-no' : ''">
				<view class="name">
					{{item.name}}
				</view>
				<view class="right-right">
					<image v-if="item.imgType" src="../../static/lufei.jpg" mode=""></image>
					<view v-if="item.zan" class="zan">赞过</view>
					<view v-if="item.imgType" class="hot"></view>
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
						img: '../../static/commonImg/pyq.png',
						name: '朋友圈',
						imgType: true,
						zan: false,
						borderAndMargin: false
					},
					{
						id: 2,
						img: '../../static/commonImg/sph.png',
						name: '视频号',
						imgType: true,
						zan: true,
						borderAndMargin: false
					},
					{
						id: 3,
						img: '../../static/commonImg/sys.png',
						name: '扫一扫',
						imgType: false,
						zan: false,
						borderAndMargin: true
					},
					{
						id: 4,
						img: '../../static/commonImg/yyy.png',
						name: '摇一摇',
						imgType: false,
						zan: false,
						borderAndMargin: false
					},
					{
						id: 5,
						img: '../../static/commonImg/kyk.png',
						name: '看一看',
						imgType: false,
						zan: false,
						borderAndMargin: true
					},
					{
						id: 6,
						img: '../../static/commonImg/ss.png',
						name: '搜一搜',
						imgType: false,
						zan: false,
						borderAndMargin: false
					},
					{
						id: 7,
						img: '../../static/commonImg/fjdr.png',
						name: '附近的人',
						imgType: false,
						zan: false,
						borderAndMargin: false
					},
					{
						id: 8,
						img: '../../static/commonImg/gw.png',
						name: '购物',
						imgType: false,
						zan: false,
						borderAndMargin: true
					},
					{
						id: 9,
						img: '../../static/commonImg/yx.png',
						name: '游戏',
						imgType: false,
						zan: false,
						borderAndMargin: false
					},
					{
						id: 10,
						img: '../../static/commonImg/xcx.png',
						name: '小程序',
						imgType: false,
						zan: false,
						borderAndMargin: true
					}
					
					
				]
			}
		},
		methods: {
			
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
			.right-right {
				display: flex;
				align-self: center;
				position: relative;
				.hot {
					width: 20rpx;
					height: 20rpx;
					position: absolute;
					left: 56rpx;
					top: -8rpx;
					background-color: red;
					border-radius: 50%;
				}
				.zan {
					width: 60rpx;
					font-size: 30rpx;
					align-self: center;
					margin: 0 10rpx;
					color: #7f7f7f;
				}
				image {
					width: 68rpx;
					height: 68rpx;
					border-radius: 8rpx;
					flex: 0 0 68rpx;
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
