<template>
	<view class="send-main" @tap.stop="stopBigView()" @touchstart.stop="stopBigView()">
		<view class="send-info">
		<uni-icons v-if="isRecording" class="mic-icon iconfont icon-sound" size="28" @tap="holdToTalk()"></uni-icons>
		<uni-icons v-else class="mic-icon iconfont icon-jianpan" size="25" @tap="holdToTalk()"></uni-icons>
		<textarea v-if="isRecording" @input="sendChange()" type="text" confirm-type="send" class="chat-send" :focus="showFocus" @blur="onBlur" v-model="sendMsg" cursor-spacing="5" auto-height="true" show-confirm-bar="false" maxlength="-1" />
		<view class="chat-send recording-a" @touchstart="_recording" @touchend="_stopRecording" @touchmove="_moveCancal" v-else>
				<view>按住说话</view>
				<view class="cancal-record" v-if="voicePopup">
					<view class="move-common move-cancal" :class="moveCancal === 1 ? 'move-cancal-hover' : ''">
						取消
					</view>
					<view class="move-common move-text" :class="moveText === 1 ? 'move-text-hover' : ''">
						文字
					</view>
					<view class="move-bottom" :class="(moveCancal === 1 || moveText === 1)? '' : 'move-bottom-hover'">
						
					</view>
				</view>
			</view>
			<uni-icons class="smile-icon iconfont icon-emoji" size="28" @tap="onFocus"></uni-icons>
			<view v-if="showSendBtn" class="send-icon" size="small" @tap="_sendMsg(1, sendMsg)">发送</view>
			<uni-icons v-else class="plus-icon iconfont icon-roundadd" size="28" @tap="_addPlus()"></uni-icons>
		</view>
		<view v-if="showIconFlie" class="select-main">
		<view class="uni-padding-wrap" style="padding: 20px 15px;">
			<view class="page-section swiper">
				<view class="page-section-spacing">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
						<swiper-item>
							<view class="swiper-item">
								<view class="add-select-list" v-for="(item, index) in sendInfo.slice(0,8)" :key="index">
									<view class="img-bg">
										<image :src="item.img" mode=""></image>
									</view>
									<view class="text">
										{{item.text}}
									</view>
								</view>
							</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item">
								<view class="add-select-list" v-for="(item, index) in sendInfo.slice(8,16)" :key="index">
									<view class="img-bg">
										<image :src="item.img" mode=""></image>
									</view>
									<view class="text">
										{{item.text}}
									</view>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	import {mapActions, mapState} from 'vuex'
	import userInfoApi from '../../../api/userInfo.js'
	const recorderManager = uni.getRecorderManager();
	export default {
		props: ['userInfo', 'sendUserInfo'],
		data() {
			return {
				sendMsg: '', // 发送的内容
				showSendBtn: false, // 显示发送按钮
				showFocus: false, // 获取输入框焦点
				isRecording: true, // 按住说话
				showIconFlie: false, // 显示文件和表情
				indicatorDots: true,
				autoplay: false,
				interval: 2000,
				duration: 300,
				voicePath: '',
				voiceTiming: '', // 录音计时
				voiceDuration: 0, // 录音时长
				voicePopup: false,
				cancalSend: false,
				moveCancal: 0,
				moveText: 0,
				x: 150,
				y: 600,
				old: {
					x: 0,
					y: 0
				},
				text: 'uni-app',
				sendInfo: [
					{
						"img": "../../../static/chat-room-img/xc.png",
						"text": "相册"
					},
					{
						"img": "../../../static/chat-room-img/ps.png",
						"text": "拍摄"
					},
					{
						"img": "../../../static/chat-room-img/th.png",
						"text": "视频通话"
					},
					{
						"img": "../../../static/chat-room-img/wz.png",
						"text": "位置"
					},
					{
						"img": "../../../static/chat-room-img/hb.png",
						"text": "红包"
					},
					{
						"img": "../../../static/chat-room-img/zz.png",
						"text": "转账"
					},
					{
						"img": "../../../static/chat-room-img/yy.png",
						"text": "语音输入"
					},
					{
						"img": "../../../static/chat-room-img/sc.png",
						"text": "我的收藏"
					},
					{
						"img": "../../../static/chat-room-img/mp.png",
						"text": "名片"
					},
					{
						"img": "../../../static/chat-room-img/wj.png",
						"text": "文件"
					}
					
				]
			}
		},
		onLoad(option) {
		},
		onShow () {
		},
		computed: {
		},
		created() {
		},
		mounted(){
		},	
		methods: {
			getImageInfo: async function (src) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
							src: src,
							success: (res) => {
								resolve(res)
							},
							fail: (err) => {
								reject(err)
							}
					})
				})
			},
			sendChange: function (){
				let reg = /^(?!(\s+$))/ //不能全是空格
				if (this.sendMsg.length > 0 && reg.test(this.sendMsg)) {
					this.showSendBtn = true
					this.showFocus = true
				} else {
					this.showSendBtn = false
				}
			},
			_sendMsg: function (msgType, msg, voiceT) {
				let sendNewMsg = {
						userId: this.userInfo._id,
						sendId: this.sendUserInfo.id,
						img: '../../../static/lufei.jpg',
						time: new Date(),
						msgType: msgType, // 1-文字 2-图片 3-视频 4-语音 5-红包 6-表情
						msg: msg,
						hot: 1,
						voiceTime: voiceT,
						move: 0
					}
				if(msgType === 2) {
					this.getImageInfo(sendNewMsg.msg).then((res) => {
							sendNewMsg.height = res.height
							sendNewMsg.width = res.width
							this._chatMsg(sendNewMsg)
							this.sendMsg = ''
						}).catch((err) => console.log(err))
				} else if(msgType === 1) {
					this._chatMsg(sendNewMsg)
					this.sendMsg = ''
					this.showSendBtn = false
				} else if (msgType === 4) {
					this._chatMsg(sendNewMsg)
				}
				this.$nextTick(function(){
					// this.scrollToBottom()
				})
			},
			_addPlus: function () {
				this.showIconFlie = !this.showIconFlie
				// this.scrollToBottom()
			},
			_chatMsg:function (msgData) {
				uni.$emit('getSendData', msgData)
			},
			bigView: function () {
				this.showIconFlie = false
				
			},
			stopBigView: function () {
				
			},
			holdToTalk: function () {
				this.showSendBtn = false
				if (!this.isRecording && this.sendMsg.length > 0) {
					this.showSendBtn = true
					this.showFocus = true
				}
				this.isRecording = !this.isRecording
			},
			chooseImg: function () {
				uni.chooseImage({
				    count: 9, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album'], //从相册选择
				    success: res => {
						console.log(res.tempFiles)
						res.tempFilePaths.forEach( item => {
							this._sendMsg(2, item)
							this.imgUrls.push(item)
						})
					}
				})
				
			},
			onFocus: function () {
				this.showFocus = true
			},
			onBlur: function () {
				this.showFocus = false
			},
			_recording:function (){
				this.cancalSend = false
				let info = uni.createSelectorQuery().select(".move-cancal");
					info.boundingClientRect(function(data) {
					console.log(data);  // 获取元素信息
				}).exec()
				console.log('开始录音');
				this.voicePopup = true
				let i = 0
				this.voiceTiming = setInterval(() => {
					i++
					this.voiceDuration = i
					if (i > 59) {
						this._stopRecording()
					}
				}, 1000)
				recorderManager.start();
				
			},
			_stopRecording:function (){
				console.log('录音结束');
				console.log(this.voiceDuration)
				this.voicePopup = false
				recorderManager.stop();
				clearInterval(this.voiceTiming)
				if (this.voiceDuration >= 1) {
					recorderManager.onStop((res) => {
						// console.log('recorder stop' + JSON.stringify(res));
						// self.voicePath = res.tempFilePath;
						if (this.cancalSend  === true) {
							console.log('不发送')
							this.moveCancal = 0
							this.moveText = 0
							this.cancalSend = false
						} else {
							console.log('发送')
							this.moveCancal = 0
							this.moveText = 0
							this.cancalSend = false
							this._sendMsg(4, res.tempFilePath, this.voiceDuration)
							this.voiceDuration = 0
						}
						// _sendMsg(4, res.tempFilePath, this.voiceDuration)
					});
				}
			},
			_moveCancal: function (e) {
				let win = uni.getSystemInfoSync()
				// console.log(win.windowWidth, win.windowHeight)
				// console.log(Math.round(e.touches[0].pageX), Math.round(e.touches[0].pageY))
				if (win.windowHeight - (Math.round(e.touches[0].pageY)) > 80) {
					if ((Math.round(e.touches[0].pageX)) > win.windowWidth/2) {
						// console.log('超过')
						this.moveCancal = 0
						this.moveText = 1
					} else if ((Math.round(e.touches[0].pageX)) < win.windowWidth/2) {
						// console.log('没超过')
						this.cancalSend = true
						this.moveCancal = 1
						this.moveText = 0
					}
				} else {
					this.moveCancal = 0
					this.moveText = 0
					this.cancalSend = false
					//console.log('没过')
				}	
			}
		}
	}
</script>
<style>
	@import '../../../static/iconfont.css'
</style>

<style lang="scss">
	
	.send-main{
			position: fixed;
			bottom: 0;
			width: 100%;
			min-height: 80rpx;
			background:rgba(255,255,255, 1);
			.send-info {
				display: flex;
				padding: 16rpx 0;
				.chat-send {
					align-self: center;
					flex: 1;
					min-height: 56rpx;
					max-height: 200rpx;
					background: rgba(242,242,242,1);
					border-radius: 10rpx;
					font-size: 30rpx;
					color: rgba(25,29,35,1);
					line-height: 52rpx;
					padding: 10rpx 18rpx;
					word-break: break-all;
					word-wrap: break-word;
					position: relative;
						.cancal-record {
							position: fixed;  
							bottom: 0;  
							left: 0;  
							width: 100%;
							height: 100%;
							background-color: rgba(0,0,0,0.5);
							z-index: 99;
							.move-common {
								width: 180rpx;
								height: 180rpx;  
								border-radius:50%; 
								background-color: #CCCCCC; 
								position: absolute; 
								bottom: 260rpx; 
								color: #000000;
								line-height: 180rpx;
								font-size: 36rpx;
								z-index: 999;
								transition: 400ms;
								transform: scale(1);
							}
							.move-cancal {
								left: 80rpx; 
							}
							.move-text {
								right: 80rpx; 
							}
							.move-cancal-hover {
								background-color: #F56C6C;
								color: #FFFFFF;
								transform: scale(1.1);
							}
							.move-text-hover {
								background-color: #07c160;
								color: #FFFFFF;
								transform: scale(1.1);
							}
							.move-bottom {
								width: 100%;
								height: 150rpx;
								position: absolute;
								z-index: -1;
								overflow: hidden;
								bottom: 0;
								transition: 400ms;
								transform: scale(1);
							}
							.move-bottom:after {
							    content: '';
							    width: 110%;
							    height: 150rpx;
							    position: absolute;
							    left: -5%;
							    top: 0;
							    z-index: -1;
							    border-radius: 50% 50% 0 0;
							    background: #C0C0C0;
							}
							.move-bottom-hover {
								transition: 500ms;
								transform: scale(1, 1.3);
							}
						}
						view {
							text-align: center;
							color: #888888;
						}
				}
				.recording-a:active {
					background-color: #FCF7E9;
				}
				.mic-icon,.plus-icon,.smile-icon {
					align-self: center;
					width: 86rpx;
					text-align: center;
				}
				.plus-icon {
					width: 76rpx;
					text-align: left;
				}
				.smile-icon{
					
				}
				.send-icon{
					text-align: center;
					align-self: center;
					min-height: 46rpx;
					line-height: 46rpx;
					font-size: 30rpx;
					border-radius: 6rpx;
					color: #FFFFFF;
					margin-right: 20rpx;
					padding: 4rpx  20rpx!important;
					background-color: #07c160;
				}
			}
			.select-main {
				width: 100%;
				height: 520rpx;
				background-color: #F7F7F7;
				swiper {
					height: 480rpx;
				}
				swiper-item {
					height: 480rpx;
					display: flex;
					.add-select-list {
						float: left;
						width: 140rpx;
						height: 200rpx;
						margin: 0 16rpx;
						margin-bottom: 10rpx;
						color: #7b7b7b;
						.img-bg {
							width: 60rpx;
							height: 60rpx;
							background-color: #FFFFFF;
							padding: 30rpx;
							border-radius: 30rpx;
							margin: 0 auto;
							image {
								width: 100%;
								height: 100%;
							}
						}
						.text {
							display: block;
							width: 140rpx;
							text-align: center;
							font-size: 24rpx;
							height: 60rpx;
							line-height: 60rpx;
						}
					}
				}
			}
		}
</style>
