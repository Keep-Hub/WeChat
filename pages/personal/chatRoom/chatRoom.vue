<template>
	<view>
		<scroll-view style="position: absolute;" @tap="bigView()" @touchstart="bigView()" id="scrollview" scroll-y="false" :style="{height: (style.contentViewHeight*2 + 140) + 'rpx'}" :scroll-with-animation="scrollAnimation" :scroll-y="true" :scroll-top="scrollTop">
			<view v-for="(item, index) in chatData" :key="index">
				<view v-if="fiveMinutesApart(item.time, index, chatData)" class="send-time">
					<text>{{timeConversion(item.time)}}</text>
				</view>
				<view class="chat-list" :class="item.userId === userInfo._id? 'flex-direction' : ''">
					<view class="left">
						<image :src="item.img" mode="" @tap="init()"></image>
					</view>
					<view class="right" :class="item.userId === userInfo._id? 'right-row' : 'left-row'">
						<view class="chat-bubble" :class="item.userId === userInfo._id && item.msgType === 1 ? (item.msgType === 1 ?'bg-color-g' : '') : (item.msgType === 1 ?'bg-color-b' : '')">
							<text class="square" :class="item.userId === userInfo._id && item.msgType === 1? (item.msgType === 1 ?'right' : '') : (item.msgType === 1 ?'left' : '')"></text>
							<view class="msg-info">
								<view class="msg-text" v-if="item.msgType === 1">
									{{item.msg}}
								</view>
								<image
								 class="image-zoom" 
								 :class="item.height >= 320? 'max' : (item.height > 60 ? 'small' : 'min')"
								 v-else-if="item.msgType === 2"
								 :src="item.msg"
								 ref="imgSize"
								 @click="onPreviewImage(item.msg)"
								 :mode="calculateProportion(item.width, item.height, item)"
								 ></image>
								 <view class="recorder-msg" @tap="playVoice(item)" v-else-if="item.msgType === 4" :class="item.userId === userInfo._id && item.msgType === 4 ? (item.msgType === 4 ?'bg-color-g' : '') : (item.msgType === 4 ?'bg-color-b' : '')">
									<text class="voice-time" v-if="item.userId === userInfo._id" style="text-align: right;" :style="{ width: (item.voiceTime * 4) + 'rpx' }">{{item.voiceTime}}″</text>
									<view class="voice-box" :class="item.userId === userInfo._id && item.msgType === 4 ? 'f-r' : ''">
										<view class="voice-symbol">
											<view class="voice-circle first"></view>
											<view class="voice-circle second" :class="item.move === 1 ? 'second-animation' : ''"></view>
											<view class="voice-circle third" :class="item.move === 1 ? 'third-animation' : ''"></view>
										</view>
									</view>
									<text class="voice-time" v-if="item.uId === 1" :style="{ width: (item.voiceTime * 4) + 'rpx' }">{{item.voiceTime}}″</text>
									<text class="voice-red-hot" v-if="item.uId === 1 && item.hot === 1"></text>
								 </view>
							</view>	
						</view>
					</view>
				</view>
			</view>
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
		</scroll-view>
	</view>
</template>

<script>
	import {mapActions, mapState} from 'vuex'
	import userInfoApi from '../../../api/userInfo.js'
	const recorderManager = uni.getRecorderManager();
	export default {
		data() {
			return {
				userInfo: {},
				sendUserInfo: null,
				mid: 13888888888,
				chatData: [],
				getMsgFalg: false, // 开启页面接受socket的消息
				scrollAnimation: false, // 是否开启滚动动画
				sendMsg: '', // 发送的内容
				showSendBtn: false, // 显示发送按钮
				showFocus: false, // 获取输入框焦点
				isRecording: true, // 按住说话
				showIconFlie: false, // 显示文件和表情
				scrollTop: '9999',
				indicatorDots: true,
				autoplay: false,
				interval: 2000,
				duration: 300,
				voicePath: '',
				voiceTiming: '', // 录音计时
				voiceDuration: 0, // 录音时长
				voicePopup: false,
				cancalSend: false,
				voiceAnimation: 'fadeInOut',
				moveCancal: 0,
				moveText: 0,
				x: 150,
				y: 600,
				old: {
					x: 0,
					y: 0
				},
				text: 'uni-app',
				imgUrls: [], // 预览图片路径集合
				style: {
				            pageHeight: 0,
				            contentViewHeight: 0,
				            footViewHeight: 90,
				            mitemHeight: 0
				        },
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
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.userInfo = res.data;
				}
			})
			this.sendUserInfo = JSON.parse(decodeURIComponent(option.item));
			this._getMsg()
		},
		onShow () {
			this.getMsgFalg = true
		},
		computed: {
		    ...mapState(['chatList'])
		},
		created() {
			this.socket.on('connect', () => {
			  console.log('connection created.')
			});
			uni.setNavigationBarTitle({
			    title: this.sendUserInfo.name
			});
			 const res = uni.getSystemInfoSync()   //获取手机可使用窗口高度     api为获取系统信息同步接口
		　　　this.style.pageHeight = res.windowHeight
		　　　this.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100) - 70 //像素   因为给出的是像素高度 然后我们用的是upx  所以换算一下 
		},
		mounted(){
			this.init()
			this.scrollToBottom()
			// uni.setStorage({key: this.userInfo._id + '_' + this.sendUserInfo.id,data: this.chatData})
			// this.timeConversion()
		},	
		methods: {
			...mapActions(['getUserInfo', 'getChatList']),
			init: function () {
				uni.getStorage({
					key: this.userInfo._id + '_' + this.sendUserInfo.id,
					success: (res) => {
						this.chatData = res.data;
					}
				});
				this.chatData.forEach(i => {
					if(i.msgType === 2) {
						this.imgUrls.push(i.msg)
						this.getImageInfo(i.msg).then((res) => {
								i.height = res.height
								i.width = res.width
							}).catch((err) => console.log(err))
					}
					
				})
			},
			calculateProportion: function (w, h, row) {
				let ratio = w/h
				if(ratio > 1) {
					return h >= 160 ? 'widthFix' : 'heightFix'
				} else if(ratio === 1) {
					return 'heightFix'
				} else if(ratio < 1) {
					return 'heightFix'
				}
			},
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
			scrollToBottom: function () {
				setTimeout(() => {
					let that = this;
					let query = uni.createSelectorQuery();
					query.selectAll('.chat-list').boundingClientRect();
					query.select('#scrollview').boundingClientRect();
					query.exec((res) => {
						that.style.mitemHeight = 0;
						res[0].forEach((rect) => that.style.mitemHeight = that.style.mitemHeight + rect.height + 60)   //获取所有内部子元素的高度
		　　　　　　　　　　 // 因为vue的虚拟DOM 每次生成的新消息都是之前的，所以采用异步setTimeout    主要就是添加了这红字
		　　　　　　　　　　 setTimeout(() => {
						　　if (that.style.mitemHeight > (that.style.contentViewHeight - 100)) {   //判断子元素高度是否大于显示高度
							　　that.scrollTop = that.style.mitemHeight - that.style.contentViewHeight    //用子元素的高度减去显示的高度就获益获得序言滚动的高度
						　　}
		　　　　　　　　　}, 10)
		　　　　　　　})
				}, 100)
				
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
			_getMsg: function () {
				this.socket.on('getMassage', data => {
					if (data.userId === this.sendUserInfo.id) {
						this.chatData.push(data)
						uni.setStorage({key: data.sendId + '_' + data.userId,data: this.chatData})
						this.scrollToBottom()
					}
				})	
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
							this.chatData.push(sendNewMsg)
							uni.setStorage({key: this.userInfo._id + '_' + this.sendUserInfo.id,data: this.chatData})
							this.sendMsg = ''
							this.$nextTick(function(){
								this.scrollToBottom()
							})
						}).catch((err) => console.log(err))
				} else if(msgType === 1) {
					this.chatData.push(sendNewMsg)
					this.socket.emit('massage', sendNewMsg)
					uni.setStorage({key: this.userInfo._id + '_' + this.sendUserInfo.id,data: this.chatData})
					this.updataMsg(sendNewMsg.sendId, sendNewMsg)
					this.sendMsg = ''
					this.showSendBtn = false
				} else if (msgType === 4) {
					this.chatData.push(sendNewMsg)
					uni.setStorage({key: this.userInfo._id + '_' + this.sendUserInfo.id,data: this.chatData})
				}
				this.$nextTick(function(){
					this.scrollToBottom()
				})
			},
			_addPlus: function () {
				this.showIconFlie = !this.showIconFlie
				this.scrollToBottom()
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
			onPreviewImage: function (index) {
				let currentIndex = 0
				this.imgUrls.forEach((item, i) => {
					if(item === index) {
						currentIndex = i
					}
				})
				uni.previewImage({
					current: currentIndex,
					urls: this.imgUrls,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: res => {
							console.log('选中了第' + (res.tapIndex + 1) + '个按钮,第' + (res.index + 1) + '张图片');
						},
						fail: err => {
							console.log(err.errMsg);
						}
					}
				});
			},
			onFocus: function () {
				this.showFocus = true
			},
			onBlur: function () {
				this.showFocus = false
			},
			updataMsg: function (id, data) {
				let chatList = []
				uni.getStorage({
					key: this.userInfo._id + 'chatList',
					success: (res) => {
						chatList = res.data
						chatList.forEach(item => {
							if (id === item.id) {
								item.new = data.msg
								item.time = data.time
								uni.setStorage({
									key: this.userInfo._id + 'chatList',
									data: chatList
								})
								this.getChatList()
							} else {
								let isIn = chatList.findIndex(item => item.id === id)
								if (isIn == -1) {
									userInfoApi.getVerifyBuddy({_id: this.userInfo._id, sendId: data.sendId}).then(res => {
										const row = res.result[0]
										let n = {
												id: row.buddyId,
												img: row.img,
												name: row.nickName,
												new: data.msg,
												time: data.time,
												hot: data.hot,
												remind: false,
												swipe: row.swipe,
												showSwipe: row.showSwipe,
												clickBtnFlag: false,
												clearTime: null
											}
										chatList.push(n)
										uni.setStorage({
											key: this.userInfo._id + 'chatList',
											data: chatList
										})
										this.getChatList()
									})
								}
							}
						})
					},
					fail: (err) => {
						console.log('chuang')
						userInfoApi.getVerifyBuddy({_id: this.userInfo._id, sendId: data.sendId}).then(res => {
							const row = res.result[0]
							let n = {
									id: row.buddyId,
									img: row.img,
									name: row.nickName,
									new: data.msg,
									time: data.time,
									hot: data.hot,
									remind: false,
									swipe: row.swipe,
									showSwipe: row.showSwipe,
									clickBtnFlag: false,
									clearTime: null
								}
							chatList.push(n)
							uni.setStorage({
								key: this.userInfo._id + 'chatList',
								data: chatList
							})
							this.getChatList()
						})
					}
				})
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
				
			},
			onChange: function(e) {
				console.log(e.detail)
				this.old.x = e.detail.x
				this.old.y = e.detail.y
			},
			playVoice: function (e) {
				e.hot = 0
				this.chatData.forEach(i => {
					if (i.msgType === 4) {
						console.log(i.move)
						i.move = 0
					}
					
				})
				e.move = 1
				setTimeout(() => {
					e.move = 0
				},e.voiceTime * 1000)
				
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				innerAudioContext.src = e.msg;
				innerAudioContext.onPlay(() => {
				  console.log('开始播放');
				});
			},
			getNowTime: function (value, format) {// value - 标准时间 format: 0-日期+时间 1-时分 2-星期 3-日期
				let date = new Date(value)
				let week = date.getDay();
				let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
				let y = date.getFullYear()
				let m = date.getMonth() + 1
				let d = date.getDate()
				let hh = date.getHours()
				let mm = date.getMinutes()
				let ss = date.getSeconds()
				m = m < 10 ? '0' + m : m
				d = d < 10 ? '0' + d : d
				hh = hh < 10 ? '0' + hh : hh
				mm = mm < 10 ? '0' + mm : mm
				ss = ss < 10 ? '0' + ss : ss
				if (format === 1) {
					return (hh + ':'+ mm)
				} else if (format === 2) {
					return weeks[week] + ' ' + (hh + ':'+ mm)
				} else if (format === 3) {
					return (y + '-' + m + '-' + d)
				} else {
					return (y + '-' + m + '-' + d + ' ' + hh + ':'+ mm)
				}
			},
			timeConversion: function (n) {
				let nowTime = Date.parse(this.getNowTime(Date.parse(new Date()), 3))
				let oldTime = Date.parse(this.getNowTime(n, 3))
				if ((nowTime - oldTime)/(3600000*24) === 0) {
					return this.getNowTime(n, 1)
				} else if ((nowTime - oldTime)/(3600000*24) === 1) {
					return '昨天 ' + this.getNowTime(n, 1)
				} else if ((nowTime - oldTime)/(3600000*24) <= 6) {
					return this.getNowTime(n, 2)
				} else {
					return this.getNowTime(n, 0)
				}
			},
			// 间隔五分钟显示时间
			fiveMinutesApart: function (time, index, data) {
				if (index === 0) {
					return true
				} else {
					if (Date.parse(time) - Date.parse(data[index-1].time) >= (5*60*1000)) {
						return true
					} else {
						return false
					}
				}
			}
		},
		onUnload:function () {
			console.log('销毁聊天页')
			this.getMsgFalg = false
		}
	}
</script>
<style>
	@import '../../../static/iconfont.css'
</style>

<style lang="scss">
	page {
		background-color: #ededed;
	}
	.flex-direction {
		flex-direction: row-reverse;
	}
	.bg-color-b {
		background-color: #FFFFFF
	}
	.bg-color-g {
		background-color: #95ec69
	}
	.send-time {
		margin: 30rpx auto;
		color: #888888;
		font-size: 24rpx;
		text-align: center;
		text {
			background-color: #F8F8F8;
			padding: 4rpx 10rpx;
			border-radius: 6rpx;
		}
	}
	.chat-list {
		display: flex;
		flex-wrap: nowrap;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
		.left {
			flex: 0 0 76rpx;
				image {
					width: 76rpx;
					height: 76rpx;
					border-radius: 10rpx;
				}
		}
		.left-row {
			margin-left: 26rpx;
			margin-right: 100rpx;
		}
		.right-row {
			margin-right: 26rpx;
			margin-left: 100rpx;
		}
		.right {
			text-align: justify;
			text-justify: newspaper;
			word-break: break-all;
				.chat-bubble{
					width: 100%;
					min-height: 76rpx; 
					position: relative; 
					border-radius: 10rpx;
					display: flex;
						.square {
							display: block;
							position: absolute; 
							top: 24rpx;
						}
						.left {
							border-style: solid dashed dashed;
							border-width: 16rpx; 
							left: -26rpx;
							border-color: transparent  #FFFFFF transparent transparent;
						}
						.right {
							border-style: solid dashed dashed;
							border-width: 16rpx; 
							right: -26rpx;
							border-color: transparent  transparent transparent #95ec69;
						}
						.msg-info {
							width: 100%;
							line-height: 48rpx;
							align-self: center;
							font-size: 32rpx;
								.msg-text {
									padding: 14rpx 20rpx;
								}
								image {
									border-radius: 10rpx;
									background-color: #FFFFFF;
								}
								.recorder-msg {
									position: relative;
									padding: 0 20rpx;
									display: flex;
									border-radius: 10rpx;
									.voice-box {
									    width: 50rpx;
									    height: 60rpx;
									    box-sizing: border-box;
									    position: relative;
									    margin: 8rpx auto;
										.voice-symbol {
										    width: 50rpx;
										    height: 50rpx;
										    box-sizing: border-box;                
										    position: relative;    /*必须，否则苹果overflow失效*/
											top: 5rpx;
											left: 20rpx;
										    overflow: hidden;
										    transform: rotate(135deg);
										 
										}
										.voice-circle {
										    border: 4rpx solid #000000;
										    border-radius: 50%;
										    position: absolute;
										}
										 
										.first {
										    width: 6rpx;
										    height: 6rpx;
										    background: #000000;
										    top: 45rpx;
										    left: 45rpx;
										}
										 
										.second {
										    width: 25rpx;
										    height: 25rpx;
										    top: 35rpx;
										    left: 35rpx;
										    animation: fadeInOut1 1s infinite 0.5s;
										}
										 
										.third {
										    width: 40rpx;
										    height: 40rpx;
										    top: 25rpx;
										    left: 25rpx;
										    animation: fadeInOut1 1s infinite 0.5s;
										}
										.second-animation {
											animation: fadeInOut 1s infinite 0.5s;
										}
										.third-animation {
											animation: fadeInOut 1s infinite 0.6s;
										}
										@keyframes fadeInOut {
										    0% {
										        opacity: 0; /*初始状态 透明度为0*/
										    }
										    100% {
										        opacity: 1; /*结尾状态 透明度为1*/
										    }
										}
										@keyframes fadeInOut1 {
										    0% {
										        opacity: 1; /*初始状态 透明度为1*/
										    }
										    100% {
										        opacity: 1; /*结尾状态 透明度为1*/
										    }
										}
									}
									.f-r {
										transform: rotate(180deg)!important;
										/* left: -10rpx!important; */
									}
									.voice-time {
										min-width: 50rpx;
										max-width: 260rpx;
										height: 76rpx;
										line-height: 76rpx;
										font-size: 26rpx;
									}
									.voice-red-hot {
										width: 20rpx;
										height: 20rpx;
										background-color: red;
										position: absolute;
										right: -40rpx;
										border-radius: 50%;
										top: 28rpx;
									}
								}
								.max {
									max-width: 400rpx;
									max-height: 320rpx;
								}
								.small {
									max-height: 160rpx;
								}
								.min {
									max-height: 80rpx;
								}
						}
					}
		}
		
	}
	
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
