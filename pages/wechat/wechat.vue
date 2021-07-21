<template>
	<view>
	  <uni-swipe-action>
	      <uni-swipe-action-item v-for="(item, index) in chatList" :key="index" :autoClose="item.swipe" :show="item.showSwipe" :right-options="options"  @change="swipeChange($event, index)">
	          <view class="user-avatar margin-bt" @touchend="recoveryShow(item)" @tap="bindClick(item)">
	          	<view class="left pd-20">
	          		<image :src="item.img" mode=""></image>
	          			<view class="msg-hot" v-if="item.hot !== 0">
	          				{{item.hot >= 99 ? '99+' : item.hot}}
	          			</view>
	          	</view>
	          		<view class="center new-msg pd-20">
	          			<view class="nike-name">
	          				{{item.name}}
	          			</view>
	          			
	          			<view class="new-msg">
	          				{{item.new}}
	          			</view>
	          		</view>
	          	<view class="right pd-20">
	          			{{timeConversion(item.time)}}
	          	</view>
	          </view>
			  <template v-slot:right>
			         <view @tap.stop="onClick(item, 1)" v-show="btnFlag === 1 || btnFlag === 0" style="background-color: #4C4C4C;" class="swipe-btn"
					 :class="btnFlag === 1? 'w-100' : ''"
					 >
							<text>{{btnTab}}</text>
						 </view>
					 <view  @tap.stop="onClick(item, 2)" style="background-color: #FA9E3B;" class="swipe-btn" v-show="btnFlag === 2 || btnFlag === 0" :class="btnFlag === 2? 'w-100' : ''">
							<text>{{btnShow}}</text>
						 </view>
					 <view @tap.stop="onClick(item, 3, index)" style="background-color: #FB5151;" class="swipe-btn" v-show="btnFlag === 3 || btnFlag === 0" :class="btnFlag === 3? 'w-100' : ''">
							<text>{{btnDelete}}</text>
					 </view>
			   </template>
	      </uni-swipe-action-item>
	  </uni-swipe-action>
	</view>
</template>

<script>
	import {mapState, mapActions} from 'vuex'
	import userInfoApi from '../../api/userInfo.js'
	export default {
		data() {
		        return {
					chatData: [],
					btnTab: "标记未读",
					btnShow: "不显示",
					btnDelete: "删除",
					setTime: null,
					btnFlag: 0, // 1 2 3
					isSupport: false,
					options:[
							{
								text: '标记未读',
								style: {
									backgroundColor: '#4C4C4C'
								}
							},
					        {
					            text: '不显示',
					            style: {
					                backgroundColor: '#FA9E3B'
					            }
					        }, {
					            text: '删除',
					            style: {
					                backgroundColor: '#FB5151'
					            }
					        }
					      ]
		        }
		    },
		    onLoad() {
				const pages = getCurrentPages();  
				const page = pages[pages.length - 1];
				if (uni.getSystemInfoSync().platform === 'android') {
					const currentWebview = page.$getAppWebview();
					currentWebview.setStyle({  
					  pullToRefresh: {  
					    support: !this.isSupport,  
					    style: plus.os.name === 'Android' ? 'circle' : 'default'  
					  }  
					});  
					this.isSupport = !this.isSupport;
				}
				uni.startPullDownRefresh();
		    },
			watch: {
			},
			onShow () {
				this.getChatList()
				uni.setNavigationBarTitle({
				　　title: this.AllBadge.unreadMsg > 0 ? '微信(' + (this.AllBadge.unreadMsg >= 99? '99+' : this.AllBadge.unreadMsg) + ')' : '微信'
				})
			},
			computed: {
			    ...mapState(['userInfo','chatList','AllBadge'])
			},
			onPullDownRefresh() {
			        this.getChatList()
			        setTimeout(function () {
			            uni.stopPullDownRefresh();
			        }, 1000);
			},
			mounted(){
				this.init()
				uni.$on('updataChatList', (data) => {
					this.getChatList()
				})
			},
		    methods: {
				...mapActions(['getChatList']),
				init: function() {
					this.socket.on('getMassage', data => {
						let chatData = []
						uni.getStorage({
							key: this.userInfo._id + '_' + data.userId,
							success: (res) => {
								chatData = res.data;
								chatData.push(data)
								uni.setStorageSync(this.userInfo._id + '_' + data.userId, chatData)
							},
							fail: (err) => {
								chatData.push(data)
								uni.setStorage({key: this.userInfo._id + '_' + data.userId,data: chatData})
							}
						})
						this.$nextTick(function(){
							this.updataMsg(data.userId, data)
						})
					})
				},
				swipeChange(e,index){
				  // console.log('当前状态：'+ open +'，下标：' + index)
				},
				bindClick: function (item){
					uni.navigateTo({
					    url: '../personal/chatRoom/chatRoom?item=' + encodeURIComponent(JSON.stringify(item))
					});
					if(item.hot > 0) {
						uni.getStorage({
							key: this.userInfo._id + '_' + item.id,
							success: (res) => {
								res.data.forEach(i => {
									i.hot = 0
								})
								uni.setStorage({key: this.userInfo._id + '_' + item.id, data: res.data})
								this.getChatList()
								uni.$emit('setTabBarItem')
							}
						})
					}
				},
				 onClick: function(item, code, index) {
					/* this.setTime = setInterval(() =>
					{
						item.showSwipe = "right"
						item.swipe = false 
					}
					, 100); */
					item.showSwipe = "right"
					item.swipe = false
					console.log(item.showSwipe)
					console.log(item.swipe)
					if(item.clickBtnFlag) {
						console.log("第二次点击" + code)
						item.clickBtnFlag = false
						if (code === 3) {
							this.chatList.splice(index, 1)
						}
					}
					this.btnFlag = code
					if (code === 1) {
						this.btnTab = "是否标记为未读"
						item.clickBtnFlag = true
					} else if (code === 2) {
						this.btnShow = "不显示该聊天"
						item.clickBtnFlag = true
					} else if (code === 3) {
						this.btnDelete = "删除该聊天"
						item.clickBtnFlag = true
					}
				},
				recoveryShow (i) {
					this.chatList.forEach(item => {
						item.swipe = true
						item.showSwipe = "none"
						item.clickBtnFlag = false
						item.clearTime = null
					})
					clearInterval(this.setTime)
					this.btnFlag = 0
					this.btnTab = "标记未读"
					this.btnShow = "不显示"
					this.btnDelete = "删除"
				},
				updataMsg: function (id, data) {
					uni.getStorage({
						key: this.userInfo._id + 'chatList',
						success: (res) => {
							let findId = res.data.findIndex(item => item.id === id)
							if (findId === -1) {
								userInfoApi.getVerifyBuddy({_id: this.userInfo._id, sendId: data.userId}).then(res => {
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
									this.chatList.push(n)
									uni.setStorage({
										key: this.userInfo._id + 'chatList',
										data: this.chatList
									})
								})
							} else {
								res.data.forEach(item => {
									if (item.id === id) {
										item.new = data.msg
										item.time = data.time
									}
								})
								uni.setStorageSync(this.userInfo._id + 'chatList', res.data);
							}
							this.getChatList()
							uni.$emit('setTabBarItem')
							this.$nextTick(function(){
								let pages = getCurrentPages(); //当前页
								if (pages[pages.length - 1].route === 'pages/wechat/wechat') {
									uni.setNavigationBarTitle({
									　　title: this.AllBadge.unreadMsg > 0 ? '微信(' + (this.AllBadge.unreadMsg >= 99? '99+' : this.AllBadge.unreadMsg) + ')' : '微信'
									})
								}
							})
						},
						fail: (err) => {
							userInfoApi.getVerifyBuddy({_id: this.userInfo._id, sendId: data.userId}).then(res => {
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
								this.chatList.push(n)
								uni.setStorage({
									key: this.userInfo._id + 'chatList',
									data: this.chatList
								})
								this.getChatList()
								uni.$emit('setTabBarItem')
							})
						}
					})
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
		    },
			onUnload:function () {
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
			border-bottom: 1rpx solid #f4f4f4;
		}
	}
</style>
