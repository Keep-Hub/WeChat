<template>
	<view>
		<u-form :model="form" ref="uForm" label-position="top" style="padding: 0 30rpx;" :label-style="labelStyle">
			<u-form-item label="发送添加好友申请" :border-bottom="false">
				<u-input v-model="form.remark" placeholder="" :clearable="false" type="textarea" style="background-color: #F5F3F3; border-radius: 10rpx; color: #191919; padding: 20rpx 30rpx;" />
			</u-form-item>
			<u-form-item label="备注" :border-bottom="false">
				<u-input v-model="form.label" placeholder="" :clearable="false" style="background-color: #F5F3F3; border-radius: 10rpx; color: #191919; padding: 20rpx 30rpx;" />
			</u-form-item>
		</u-form>
		<u-button @tap="sendApply" type="success" :plain="false" :custom-style="customStyle">发送</u-button>
		<u-mask :show="showMask" :custom-style="maskStyle">
			<view class="warp">
				<view class="rect">
					<u-loading mode="flower" color="#FFFFFF" size="100" style="margin: 50rpx"></u-loading>
				</view>
			</view>
				
		</u-mask>
	</view>
</template>

<script>
	import Friend from '../../../api/friend.js'
	import {mapState, mapActions} from 'vuex'
	export default {
		data() {
			return {
				labelStyle: {
					color: "#808080"
				},
				maskStyle: {
					backgroundColor: "transparent",
				},
				customStyle: {
					backgroundColor: "#57be6a",
					width: "400rpx",
					margin: "30rpx auto",
				},
				sendInfo: {},
				showMask: false,
				form: {
					remark: '',
					label: ''
				}
			}
		},
		computed: {
		    ...mapState(['userInfo'])
		},
		onLoad(option) {
			if (option.info) {
				this.sendInfo = JSON.parse(decodeURIComponent(option.info))
			}
		},
		onReady() {
			uni.setNavigationBarColor({
				frontColor: "#000000",	//文字颜色
				backgroundColor: "#ffffff"	//底部背景色
			})
		},
		methods: {
			sendApply: function () {
				this.sendInfo.remark = this.form.remark
				this.sendInfo.label = this.form.label
				this.showMask = true
				setTimeout(() => {
					Friend.sendFriendApply(this.sendInfo).then(res => {
						if (res.code === 2000) {
							this.showMask = false
							this.socket.emit('addNewFriend', this.sendInfo)
							setTimeout(() => {
								uni.navigateBack()
							}, 800)
						}
					})
				},300)
			}
		}
	}
</script>

<style lang="scss">
page {
		background-color: #ffffff;
	}
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	.rect {
			width: 200rpx;
			height: 200rpx;
			background-color: #000000;
			opacity: 0.6;
			border-radius: 10rpx;
		}
</style>
