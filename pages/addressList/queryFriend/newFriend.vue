<template>
	<view>
		<view v-for="(item,index) in applyList" :key="index" class="user-avatar margin-bt" @tap="bindClick(item)">
			<view class="left pd-20">
				<image :src="item.avatar" mode=""></image>
			</view>
				<view class="center new-msg pd-20">
					<view class="nike-name">
						{{item.nickName}}
					</view>
					<view class="new-msg">
						我是b备注我是b备注我是b备注我是b备注我是b备注我是b备注我是b备注我是b备注
					</view>
				</view>
			<view class="right pd-20">
					<view v-if="item.isAgree === 0" class="btn" @tap.stop="_agree(item)">
						同意
					</view>
					<view v-else-if="item.isAgree === 1" class="text-btn">
						已同意
					</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState, mapActions} from 'vuex'
	import Friend from '../../../api/friend.js'
	export default {
		data() {
		        return {
					applyList: []
				}
		},
		computed: {
		    ...mapState(['userInfo'])
		},
		async onShow() {
			let newApply = uni.getStorageSync(this.userInfo.openid + '_newFriend')
			this.applyList = newApply
		},
		methods: {
			bindClick: function (row) {
				console.log(row)
			},
			_agree: function(row) {
				let sendTo = {
					userId: this.userInfo.openid,
					friendId: row.userId,
					isFriend: 1
				}
				Friend.sendFriendApply(sendTo).then(res => {
					console.log(res.result)
					this.applyList.forEach(item => {
						if (item.friendId === row.friendId) {
							item.isAgree = 1
						}
					})
					uni.setStorageSync(this.userInfo.openid + '_newFriend', this.applyList)
				})
			}
		}
	}
</script>

<style lang="scss">
	.w-100 {
		// width: 410rpx;
		animation: fadeInOut .2s linear forwards;
	}
	@keyframes fadeInOut {
	    0% {
	        width: 200rpx;
	    }
	    100% {
	        width: 410rpx; /*结尾状态 透明度为1*/
	    }
	}
	.swipe-btn {
		color: #FFFFFF;
		text-align: center;
		line-height: 140rpx;
		padding: 0 30rpx;
		
	}
	.user-avatar{
		width: 100%;
		height: 140rpx;
		background-color: #FFFFFF;
		display: flex;
		flex-direction: row;
		.pd-20 {
			padding: 20rpx 0;
		}
		.left {
			height: 100rpx;
			width: 100rpx;
			margin: 0 20rpx;
			position: relative;
			image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 10rpx;
			}
			.msg-hot {
				position: absolute;
				top: 10rpx;
				height: 30rpx;
				line-height: 30rpx;
				right: -10rpx;
				padding: 2rpx 10rpx;
				font-size: 24rpx;
				color: #FFFFFF;
				background-color: red;
				border-radius: 16rpx;
			}
		}
		.center {
			flex: 1;
			min-width: 0;
			height: 140rpx;
			border-bottom: 1rpx solid #f4f4f4;
			-webkit-flex: 1;
			.nike-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 32rpx;
				margin: 8rpx 0;
			}
			.new-msg {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 26rpx;
				color: #7f7f7f;
			}
		}
		.right {
			width: 140rpx;
			height: 140rpx;
			font-size: 24rpx;
			padding-right: 20rpx!important;
			color: #7f7f7f;
			text-align: right;
			display: flex;	
			border-bottom: 1rpx solid #f4f4f4;
			.btn {
				height: 60rpx; 
				width: 100rpx; 
				background-color: #07C160; 
				color: #FFFFFF; 
				text-align: center; 
				line-height: 60rpx; 
				align-self: center;
				font-size: 28rpx;
				border-radius: 6rpx;
			}
			.text-btn {
				height: 60rpx;
				width: 100rpx; 
				text-align: center; 
				line-height: 60rpx; 
				align-self: center;
				font-size: 28rpx;
				border-radius: 6rpx;
			}
			.btn:active {
				background-color: #18B566;
			}
		}
	}
</style>
