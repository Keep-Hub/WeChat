<template>
	<view>
		<scroll-view 
		@scrolltoupper="_nextPage()" 
		:upper-threshold="50" 
		@tap="tapScrollView()"
		@touchstart="tapScrollView()"
		id="scrollview" 
		scroll-y="false" 
		:style="{height: (style.contentViewHeight*2 + chatScreen) + 'rpx', 'padding-bottom': (scrollPadding ? '640rpx' : '0rpx')}" 
		:scroll-with-animation="scrollAnimation"
		:scroll-y="true" 
		:scroll-into-view="scrollToView">
			<view v-if="loading"><image class="loading-img" src="../../../static/loading.png" mode=""></image></view>
			<view v-for="(item, index) in chatData" :key="index" :id="'msg' + index">
				<view v-if="fiveMinutesApart(item.time, index, chatData)" class="send-time">
					<text>{{timeConversion(item.time)}}</text>
				</view>
				<view class="chat-list" :class="item.userId === userInfo.openid? 'flex-direction' : ''">
					<view class="left">
						<image v-if="item.userId === userInfo.openid" :src="userInfo.avatar" mode="" @tap="init()"></image>
						<image v-else :src="sendUserInfo.img" mode="" @tap="init()"></image>
					</view>
					<view class="right" :class="item.userId === userInfo.openid? 'right-row' : 'left-row'">
						<view class="chat-bubble" :class="item.userId === userInfo.openid && item.msgType === 1 ? (item.msgType === 1 ?'bg-color-g' : '') : (item.msgType === 1 ?'bg-color-b' : '')">
							<text class="square" :class="item.userId === userInfo.openid && item.msgType === 1? (item.msgType === 1 ?'right' : '') : (item.msgType === 1 ?'left' : '')"></text>
							<view class="msg-info">
									<u-circle-progress
										 v-if="(item.msgType === 2 || item.msgType === 3) && item.userId === userInfo.openid"
										 bg-color="transparent"
										 active-color="#cccccc"
										 :percent="item.progress"
										 :width="50"
										 :border-width="6"
										 style="align-self: center; margin-right: 10rpx;"
										 >
									</u-circle-progress>
								<view class="msg-text" v-if="item.msgType === 1">
									{{item.msg}}
								</view>
								<image
									 v-else-if="item.msgType === 2"
									 :class="item.height >= 320? 'max' : (item.height > 60 ? 'small' : 'min')"
									 style="margin-bottom: 20rpx;"
									 :src="item.path"
									 ref="imgSize"
									 @tap="onPreviewImage(item.path, item)"
									 :mode="calculateProportion(item.width, item.height, item)"
								 ></image>
								 <view 
									v-else-if="item.msgType === 3"
									:class="item.width/item.height >= 1? 'horizontal' : 'vertical'"
									class="video-bg"
									:style="{background: 'url(' + item.thumbnail + ')' + 'no-repeat', backgroundSize: '100% auto'}"
									@tap="playVedio(item.path, item.width/item.height)"
								 >
									  <view class="video-bg-2" style="width: 100%; height: 100%; background-color: transparent;display: flex;">
									  	<image class="play-btn" src="../../../static/play.png"></image>
									  	<text class="video-duration">{{videoTimeFormat(item.videoDuration)}}</text>
									  </view>
								 </view>
								 <view class="recorder-msg" @tap="playVoice(item)" v-else-if="item.msgType === 4" :class="item.userId === userInfo.openid && item.msgType === 4 ? (item.msgType === 4 ?'bg-color-g' : '') : (item.msgType === 4 ?'bg-color-b' : '')">
									<text class="voice-time" v-if="item.userId === userInfo.openid" style="text-align: right;" :style="{ width: (item.voiceTime * 4) + 'rpx' }">{{item.voiceTime}}″</text>
									<view class="voice-box" :class="item.userId === userInfo.openid && item.msgType === 4 ? 'f-r' : ''">
										<view class="voice-symbol">
											<view class="voice-circle first"></view>
											<view class="voice-circle second" :class="item.move === 1 ? 'second-animation' : ''"></view>
											<view class="voice-circle third" :class="item.move === 1 ? 'third-animation' : ''"></view>
										</view>
									</view>
									<text class="voice-time" v-if="item.userId === userInfo.openid" :style="{ width: (item.voiceTime * 4) + 'rpx' }">{{item.voiceTime}}″</text>
									<text class="voice-red-hot" v-if="item.userId === userInfo.openid && item.hot === true"></text>
								 </view>
							</view>	
						</view>
					</view>
				</view>
			</view>
			<video
			    v-if="showVideoPlay"
				id="screenVideo"
				style="width: 0; height: 0;"
				:src="playVideoUrl"
				@fullscreenchange="screenChange"
				:enable-play-gesture="true"
				:show-center-play-btn="false"
				objectFit="contain"
				:controls="true"
				:autoplay="true"
				></video>
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
				showVideoPlay: false,
				playVideoUrl: '',
				scrollToView: '',
				loading: false,
				loadAnimation: {},
				chatScreen: 0,
				sendUserInfo: {},
				chatData: [],
				scrollAnimation: false, // 是否开启滚动动画
				scrollTop: '9999',
				autoplay: false,
				duration: 300,
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
		async onLoad(option) {
			this.sendUserInfo = JSON.parse(decodeURIComponent(option.item));
			await this.init()
		},
		onShow () {
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
				// setTimeout(function () {
				// 	uni.stopPullDownRefresh();
				// }, 1000);
		},
		async mounted(){
			if (uni.getSystemInfoSync().platform === 'android') {
				this.chatScreen = 45
			} else if (uni.getSystemInfoSync().platform === "ios") {
				this.chatScreen = -50
			} else {
				this.chatScreen = 0
			}
			uni.$on('chatRoomReception', res => {
				this.chatData.push(res)
				if (res.msgType === 2) {
					this.imgUrls.push(res.path)
				}
				this.scrollAnimation = true
				this.$nextTick(function(){
					this.scrollToView = 'msg' + (this.chatData.length - 1)
				})
			})
			// 监听发送的文件
			uni.$on('getSendData', async (data) => {
				//#ifdef APP-PLUS
				if (data.msgType === 3) {
						await this.downloadFile(data.thumbnail).then( res => {
							data.thumbnail = res.savedFilePath
						})
				} else if (data.msgType === 2) {
					await this.downloadFile(data.path).then( res => {
						data.path = res.savedFilePath
					})
					await this.imgUrls.push(data.path)
				}
				//#endif
				// //#ifdef H5
				// if (data.msgType === 2) {
				// 	await this.imgUrls.push(data.path)
				// }
				// //#endif
				await uni.$emit('chatRoomReception', data)
				await uni.setStorageSync(data.userId + '_' + data.sendId, this.chatData)
				await uni.$emit('updataMsg', data)
				// this.$nextTick(function(){
				// 	this.scrollAnimation = true
				// 	this.scrollToView = 'msg' + (this.chatData.length - 1)
				// })
			})
			// 点击文件框的时候向上撑开
			uni.$on('showFileList', (data) => {
				this.scrollPadding = data
				this.$nextTick(function() {
					uni.pageScrollTo({scrollTop: 99999, duration: 0})
				});
			})
			// this.timeConversion()
		},	
		methods: {
			tapScrollView: function () {
				uni.$emit('hideFileList', false)
			},
			// videoUrl->视频链接 ratio->生成图片的大小比例 quality->图片质量 0.1 - 1
			videoToImg (videoUrl, ratio, quality) {
				return new Promise((resolve, reject) => {
					// 获取video节点
					const video = document.createElement("video");
					video.setAttribute('crossOrigin', 'Anonymous')
					video.src = videoUrl;
					//如果不设置currentTime，画出来的图片是空的
					video.currentTime = 1;
					video.onloadeddata = function(e) {
						let canvas = document.createElement('canvas');
						//判断视频的高度和宽度
						//画布的大小，由设置的视频显示的大小决定
						canvas.width = e.path[0].videoWidth * ratio;
						canvas.height = e.path[0].videoHeight * ratio;
						canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
						resolve(canvas.toDataURL('image/png', quality))
					};
				})
			},
			playVedio: function (path, ratio) {
				let videoContext = uni.createVideoContext("screenVideo", this)
				this.playVideoUrl = path
				this.showVideoPlay = true
				setTimeout(() => {
					videoContext.play()
					videoContext.requestFullScreen({ direction: 0})
				}, 200)
			},
			screenChange: function (e) {
				let fullScreen = e.detail.fullScreen; //值true为进入全屏，false为退出全屏
				if (!fullScreen) {
				  //退出全屏
				  this.showVideoPlay = false;   // 隐藏播放盒子
				}
			},
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
						this.scrollAnimation = false
						this.$nextTick(function(){
							this.scrollToView = 'msg' + (nowPageData.length - 2)
						})
					}, 1200)
				}
			},
			getPages: function (page) {
				return this.getPageData(page, 15, this.allChatData)
			},
			getPageData: function (currentPage, pageSize, objData) {
			      let totalPage = Math.ceil(objData.length / pageSize) // 先算出一共多少页
			      if (currentPage > 0 && currentPage < totalPage) {
			        return objData.slice(objData.length-pageSize * currentPage, objData.length-(currentPage - 1)*pageSize)
			      } else if (currentPage === totalPage) {
			        return objData.slice(0, objData.length-(currentPage - 1)*pageSize)
			      } else {
					  return []
				  }
			},
			init: async function () {
				this.allChatData = await uni.getStorageSync(this.userInfo.openid + '_' + this.sendUserInfo.id)
				this.chatData = await this.getPages(this.pageNub)
				if (this.allChatData) {
					await this.allChatData.forEach(i => {
						if(i.msgType === 2) {
							this.imgUrls.push(i.path)
						}
					})
				}
				this.$nextTick(function(){
					this.scrollToView = 'msg' + (this.chatData.length - 1)
				})
				uni.$on('listenUpdateProgress', res => {
					this.chatData.slice(this.chatData.length - 9,this.chatData.length).forEach(item => {
						if (item.msg === res.path) {
							item.progress = res.progress
						} else {
							// console.log('没有')
						}
					})
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
			onPreviewImage: async function (index, row) {
				let currentIndex = 0
				await this.imgUrls.forEach((item, i) => {
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
			// 接收文件并且下载
			downloadFile: function(imgUrl) {
				return new Promise((resolve, reject) => {
					uni.downloadFile({
					url: imgUrl,
					success: (res) => {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: function(red) {
								resolve(red)
							},
							fail: (err) => {
								reject(err)
							}
						});
					},
					fail: (err) => {
						reject(err)
					}
				})
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
			},
			videoTimeFormat: function (time) {
				if(time > 0) {
					let m = parseInt(Math.round(time) / 60)
					let s = Math.round(time) % 60
					return m + ':' + (s > 10 ? s : '0' + s)
				} else {
					return 0
				}
			}
		},
		onUnload:function () {
			// uni.$emit('setTabBarItem')
			this.scrollAnimation = false
			uni.$off('getSendData')
		}
	}
</script>

<style>
	@import '../../../static/iconfont.css'
</style>

<style lang="scss">
	page {
		background-color: #FFFFFF;
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
		margin: 0 auto;
		padding: 30rpx 0;
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
	#scrollview {
		background-color: #ededed;
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
							display: flex;
								.msg-text {
									padding: 14rpx 20rpx;
								}
								image {
									border-radius: 10rpx;
									background-color: #FFFFFF;
								}
								.video-bg {
									display: flex;
									position: relative;
									border-radius: 10rpx;
									margin-bottom: 20rpx;
									.video-bg-2:active {
										background-color: #CCCCCC!important;
										border-radius: 10rpx;
										opacity: 0.2;
									}
									.play-btn {
										display: block;
										width: 100rpx;
										height: 100rpx;
										border-radius: 50%; 
										background-color: transparent; 
										margin: 0 auto; 
										align-self: center;
									}
									.video-duration {
										display: inline-block;
										width: 100rpx;
										height: 30rpx;
										line-height: 30rpx;
										position: absolute;
										bottom: 10rpx;
										right: 10rpx;
										text-align: right;
										font-size: 24rpx;
										z-index: 9;
										color: #FFFFFF;
									}
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
						}
					}
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
	.horizontal  {
		width: 360rpx;
		height: 200rpx;
	}
	.vertical {
		width: 216rpx;
		height: 306rpx;
	}
</style>
