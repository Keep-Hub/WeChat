<template>
	<view>
	  <!-- <view class="user-avatar margin-bt" v-for="(item, index) in chatList" :key="index">
	  	<view class="left">
	  		<image :src="item.img" mode=""></image>
			<view class="msg-hot" v-if="item.hot !== 0">
				{{item.hot}}
			</view>
	  	</view>
		<view class="center new-msg">
			<view class="nike-name">
				{{item.name}}
			</view>
			
			<view class="new-msg">
				{{item.new}}
			</view>
		</view>
	  	<view class="right">
			{{item.time}}
	  	</view>
	  </view>
	  -->
	  <uni-swipe-action>
	      <uni-swipe-action-item v-for="(item, index) in chatList" :autoClose="item.swipe" :show="item.showSwipe" :key="index" :right-options="options"  @change="swipeChange($event, index)">
	          <view class="user-avatar margin-bt" @touchend="recoveryShow(item)" @tap="bindClick(item)">
	          	<view class="left pd-20">
	          		<image :src="item.img" mode=""></image>
	          			<view class="msg-hot" v-if="item.hot !== 0">
	          				{{item.hot}}
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
	          			{{item.time}}
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
	import userInfoApi from '../../api/userInfo.js'
	export default {
		data() {
		        return {
					userInfo: {},
					chatData: [],
					btnTab: "标记未读",
					btnShow: "不显示",
					btnDelete: "删除",
					setTime: null,
					btnFlag: 0, // 1 2 3
		            chatList: [{
						id: '60d04bd51a85fe5394c33b90',
						img: '../../static/lufei.jpg',
						name: '1743413502@163.com',
						new: '我是新的消息我是新的消息我是新的消息我是新的消息我是新的消息我是新的消息',
						time: '10:30',
						hot: 99,
						remind: false,
						swipe: true,
						showSwipe: "none",
						clickBtnFlag: false,
						clearTime: null
						
					},{
						id: '60d041cf4b33000035006098',
						img: '../../static/lufei.jpg',
						name: '1427316264@qq.com',
						new: '我是新的消息我是新的消息我是新的消息我是新的消息我是新的消息我是新的消息',
						time: '周五',
						hot: 8,
						remind: false,
						swipe: true,
						showSwipe: "none",
						clickBtnFlag: false,
						clearTime: null
					},{
						id: '60cc4a0b8fc9ad5e981d3e4e',
						img: '../../static/lufei.jpg',
						name: '1743413502@qq.com',
						new: '我是新的消息我是新的消息我是新的消息我是新的消息我是新的消息我是新的消息',
						time: '2021/6/15',
						hot: 0,
						remind: false,
						swipe: true,
						showSwipe: "none",
						clickBtnFlag: false,
						clearTime: null
					}],
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
				// userInfoApi.getVerifyBuddy({_id: this.userInfo._id, sendId:}).then(res => {
				// 	console.log(res)
				// })
				uni.getStorage({
					key: 'userInfo',
					success: (res) => {
						this.userInfo = res.data;
					}
				})
		    },
			mounted(){
				this.init()
			},
		    methods: {
				init: function() {
					this.socket.on('getMassage', data => {
						uni.getStorage({
							key: this.userInfo._id + '_' + data.userId,
							success: (res) => {
								this.chatData = res.data;
							}
						})
						this.chatData.push(data)
						uni.setStorage({key: this.userInfo._id + '_' + data.userId,data: this.chatData})
					})
				},
				swipeChange(e,index){
				  // console.log('当前状态：'+ open +'，下标：' + index)
				},
				bindClick: function (item){
					uni.navigateTo({
					    url: '../personal/chatRoom/chatRoom?item=' + encodeURIComponent(JSON.stringify(item))
					});
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
			border-bottom: 1rpx solid #f4f4f4;
		}
	}
</style>
