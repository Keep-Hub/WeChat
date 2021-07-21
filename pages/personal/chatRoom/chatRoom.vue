<template>
	<view>
		<scroll-view @scrolltoupper="_nextPage()" :upper-threshold="50" @tap="bigView()" @touchstart="bigView()" id="scrollview" scroll-y="false" :style="{height: (style.contentViewHeight*2 + chatScreen) + 'rpx', 'padding-bottom': (scrollPadding ? '640rpx' : '0rpx')}" :scroll-with-animation="scrollAnimation" :scroll-y="true" :scroll-into-view="scrollToView">
			<view v-if="loading"><image class="loading-img" src="../../../static/loading.png" mode=""></image></view>
			<view v-for="(item, index) in chatData" :key="index" :id="'msg' + index">
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
									<text class="voice-time" v-if="item.userId === userInfo._id" :style="{ width: (item.voiceTime * 4) + 'rpx' }">{{item.voiceTime}}″</text>
									<text class="voice-red-hot" v-if="item.userId === userInfo._id && item.hot === true"></text>
								 </view>
							</view>	
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<send-info :userInfo="userInfo" :sendUserInfo="sendUserInfo"></send-info>
	</view>
</template>

<script>
	import sendInfo from './sendInfo.vue'
	import {mapActions, mapState} from 'vuex'
	import userInfoApi from '../../../api/userInfo.js'
	const recorderManager = uni.getRecorderManager();
	export default {
		components:{
			sendInfo
		},
		data() {
			return {
				scrollToView: '',
				loading: false,
				loadAnimation: {},
				chatScreen: 0,
				sendUserInfo: null,
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
				scrollPadding: false,
				style: {
				            pageHeight: 0,
				            contentViewHeight: 0,
				            footViewHeight: 90,
				            mitemHeight: 0
				 },
				 pageNub: 1,
				 allChatData: [],
			}
		},
		onLoad(option) {
			this.sendUserInfo = JSON.parse(decodeURIComponent(option.item));
			// var animation = uni.createAnimation({
			//       duration: 1,
			//       timingFunction: 'step-start',
			//     })
			// 	let i = 1
			//     this.animation = animation
			//     setInterval(function() {
			//       animation.rotate(i + 30).step()
			//       this.loadAnimation = animation.export()
			// 	  i++
			//     }.bind(this), 10)
		},
		onShow () {
			this.getMsgFalg = true
			this.init()
		},
		computed: {
		    ...mapState(['chatList', 'userInfo'])
		},
		created() {
			uni.setNavigationBarTitle({
			    title: this.sendUserInfo.name
			});
			 const res = uni.getSystemInfoSync()   //获取手机可使用窗口高度     api为获取系统信息同步接口
		　　　this.style.pageHeight = res.windowHeight
		　　　this.style.contentViewHeight = res.windowHeight - uni.getSystemInfoSync().screenWidth / 750 * (100) //像素   因为给出的是像素高度 然后我们用的是upx  所以换算一下 
		},
		onPullDownRefresh() {
				// console.log('refresh');
				// setTimeout(function () {
				// 	uni.stopPullDownRefresh();
				// }, 1000);
		},
		mounted(){
			if (uni.getSystemInfoSync().platform === 'android') {
				this.chatScreen = 45
			} else {
				this.chatScreen = 0
			}
			this._getMsg()
			uni.$on('getSendData', (data) => {
				this.socket.emit('massage', data)
				this.chatData.push(data)
				uni.setStorage({key: data.userId + '_' + data.sendId, data: this.chatData})
				this.updataMsg(data.sendId, data)
				this.$nextTick(function(){
					this.scrollToView = 'msg' + (this.chatData.length - 1)
				})
			})
			uni.$on('showFile', (data) => {
				this.scrollPadding = data
				this.$forceUpdate()
				console.log(data)
			})
			// this.timeConversion()
		},	
		methods: {
			...mapActions(['getUserInfo', 'getChatList']),
			_nextPage: function () {
				this.pageNub++
				let nowPageData = this.getPages(this.pageNub)
				if (nowPageData !== false) {
					this.loading = true
					setTimeout(() => {
						nowPageData.reverse().forEach(i => {
							this.chatData.unshift(i)
						})
						this.loading = false
						this.$nextTick(function(){
							this.scrollToView = 'msg' + (nowPageData.length - 2)
						})
					}, 1200)
				}
			},
			getPages: function (page) {
				return this.getPageData(page, 18, this.allChatData)
			},
			getPageData: function (currentPage, pageSize, objData) {
			      let totalPage = Math.ceil(objData.length / pageSize) // 先算出一共多少页
			      if (currentPage > 0 && currentPage < totalPage) {
			        return objData.slice(objData.length-pageSize * currentPage, objData.length-(currentPage - 1)*pageSize)
			      } else if (currentPage === totalPage) {
			        return objData.slice(0, objData.length-(currentPage - 1)*pageSize)
			      } else {
					  return false
				  }
			},
			init: function () {
				uni.getStorage({
					key: this.userInfo._id + '_' + this.sendUserInfo.id,
					success: (res) => {
						this.allChatData = res.data;
						this.chatData = this.getPages(this.pageNub)
						this.$nextTick(function(){
							this.scrollToView = 'msg' + (this.chatData.length - 1)
						})
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
					if (data.userId === this.sendUserInfo.id && this.getMsgFalg === true) {
						data.hot = 0
						this.chatData.push(data)
						uni.setStorage({key: data.sendId + '_' + data.userId,data: this.chatData})
						this.getChatList()
						this.$nextTick(function(){
							this.scrollToView = 'msg' + (this.chatData.length - 1)
						})
					}
				})	
			},
			bigView: function () {
				this.showIconFlie = false
				
			},
			stopBigView: function () {
				
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
								uni.$emit('updataChatList', item)
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
										uni.$emit('updataChatList', n)
									})
								}
							}
						})
					},
					fail: (err) => {
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
							uni.$emit('updataChatList', n)
						})
					}
				})
			},
			onChange: function(e) {
				console.log(e.detail)
				this.old.x = e.detail.x
				this.old.y = e.detail.y
			},
			playVoice: function (e) {
				e.hot = false
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
			this.getMsgFalg = false
			uni.$off('updataChatList')
			uni.$off('getSendData')
			this.getChatList()
			uni.$emit('setTabBarItem')
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
	.loading-img{
		width: 50rpx;
		height: 50rpx;
		margin: 0 auto;
		padding: 30rpx 0;
		display: block;
		animation: movea 1s linear infinite;
	}
	@keyframes movea {
	    from {transform: rotate(0deg);}
	    to {transform: rotate(360deg);}
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
	
</style>
