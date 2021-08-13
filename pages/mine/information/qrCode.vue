<template>
	<view style="display: flex;">
		<view class="code-Info">
			<view class="user-avatar margin-bt" @tap="toInformation()">
				<view class="left">
					<image :src="userInfo.avatar" mode=""></image>
				</view>
				<view class="right">
					<view class="nick-name">
						{{userInfo.nickName}}
					</view>
					<view class="we-chat-nub">
						{{userInfo.mail}}
					</view>
				</view>
			</view>
			<view class="qr-code">
					<tki-qrcode
					ref="qrcode"
					:cid="qrCode.cid"
					:val="qrCode.val"
					:size="qrCode.size"
					:unit="qrCode.unit"
					:background="qrCode.background"
					:foreground="qrCode.foreground"
					:pdground="qrCode.pdground"
					:icon="qrCode.icon"
					:iconSize="qrCode.iconsize"
					:lv="qrCode.lv" 
					:onval="qrCode.onval"
					:loadMake="qrCode.loadMake"
					:usingComponents="qrCode.usingComponents"
					:showLoading="qrCode.showLoading"
					:loadingText="qrCode.loadingText"
					@result="qrCallBack" />
			</view>
			<view style="color: #7f7f7f; text-align: center;">
				扫上面的二维码图案, 加我好友
			</view>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	import { mapState, mapActions } from 'vuex'
	export default {
		components: { tkiQrcode },
		data() {
			return {
				qrCode: {
					cid: '',
					val: '',
					size: 230,
					unit: 'px',
					background: '#ffffff',
					foreground: '#000000',
					pdground: '#000000',
					icon: '',
					iconSize: 40,
					lv: 3,
					onval: true,
					loadMake: true,
					usingComponents: true,
					showLoading: true,
					loadingText: '生成名片中',
				}
			}
		},
		computed: {
		    ...mapState(['userInfo'])
		},
		onLoad() {
			this.qrCode.icon = this.userInfo.avatar
			this.qrCode.val = this.userInfo.openid
		},
		onReady() {
			uni.setNavigationBarColor({
				frontColor: "#000000",	//文字颜色
				backgroundColor: "#EDEDED"	//底部背景色
			})
		},
		methods: {
			...mapActions(['quitLogin']),
			qrCallBack: function () {},
		}
	}
</script>

<style lang="scss">
page {
		background-color: #EDEDED;
	}
	.margin-bt{
		margin-bottom: 30rpx;
	}
	.code-Info {
		width: 600rpx;
		height: 820rpx;
		background-color: #FFFFFF;
		margin: 120rpx auto;
		align-self: center;
		border-radius: 20rpx;
		overflow: hidden;
		.user-avatar{
			width: 100%;
			height: 160rpx;
			margin: 10rpx 0;
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
				}
				.we-chat-nub {
					font-size: 28rpx;
					color: #7f7f7f;
					display: flex;
					flex-wrap: nowrap;
					margin-top: 10rpx;
					padding-right: 60rpx;
				}
			}
		}
		.qr-code {
			width: 230px;
			margin: 50rpx auto;
		}
	}
</style>
