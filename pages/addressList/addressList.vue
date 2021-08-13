<template>
	<view>
		<uni-indexed-list :options="list" :showSelect="false" @click="bindClick($event)"></uni-indexed-list>
	</view>
</template>

<script>
	import {mapState, mapActions} from 'vuex'
	import userInfoApi from '../../api/userInfo.js'
	import pinyin from '../../node_modules/js-pinyin/index'
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"
	export default {
		components: {
			 uniIndexedList
			 },
		data() { 
			return {
				fisrtPin: ["☆", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z", "#"],
				list: [{
						"letter": "↑",
						"data": [
							{
								"id": "666666",
								"nickName": "新的朋友",
								"avatar": "../../static/listImg/new.png",
								"jumpPage": "./queryFriend/newFriend",
							},
							{
								"id": "666666",
								"nickName": "仅聊天的朋友",
								"avatar": "../../static/listImg/only-talk.png"
							},
							{
								"id": "666666",
								"nickName": "群聊",
								"avatar": "../../static/listImg/group-chat.png"
							},
							{
								"id": "666666",
								"nickName": "标签",
								"avatar": "../../static/listImg/tap.png"
							},
							{
								"id": "666666",
								"nickName": "公众号",
								"avatar": "../../static/listImg/the-public.png"
							}
						]
						}
					]
			}
		},
		onLoad() {
			this.nickSort(this.userInfo.openid)
			uni.$on('updataFriendList', res => {
				this.nickSort(this.userInfo.openid)
			})
		},
		onShow() {
			
		},
		computed: {
		    ...mapState(['userInfo'])
		},
		onReady() {
		},
		mounted() {
			let pinyin = require('js-pinyin');
			pinyin.setOptions({checkPolyphone: false, charCase: 0});
		},
		methods: {
			bindClick: function (e){
				if (e.item.key === "↑") {
					const row = e.item.data
					let newApply = uni.getStorageSync(this.userInfo.openid + '_newFriend')
					newApply.forEach(item => {
						item.isRead = 0
					})
					uni.setStorageSync(this.userInfo.openid + '_newFriend', newApply)
					uni.navigateTo({
					    url: row.jumpPage
					});
					uni.$emit('setTabBarItem')
				} else {
					const row = e.item.data
					let newRow = {
								id: row.openid,
								img: row.avatar,
								name: row.nickName
							}
					uni.navigateTo({
					    url: '../personal/chatRoom/chatRoom?item=' + encodeURIComponent(JSON.stringify(newRow))
					});
				}
			},
			// 昵称排序
			nickSort: function (id) {
				userInfoApi.getFriendList({openid: id}).then(async res => {
					let friends = []
					let newArr = []
					await res.result.forEach(item => {
						if (item.isFriend === 1) {
							item.friends[0].isStar = item.isStar
							friends.push(item.friends[0])
						}
					})
					uni.setNavigationBarTitle({
					　　title: '通讯录(' + friends.length + ')'
					})
					await friends.forEach((item, index) => {
						friends[index].fisrt = pinyin.getCamelChars(item.nickName).substring(0, 1).toUpperCase()
						newArr.push(friends[index]);
					})
					await this.fisrtPin.forEach((item, index) => {
						let userJson = {}
						userJson.letter = item
						userJson.data = newArr.filter(i => {
							return this.fisrtPin[index] === i.fisrt
						})
						this.list.push(userJson)
					})
					let star = []
					this.list.forEach(item => {
						item.data.forEach(i => {
							if (i.isStar === 1) {
								star.push(i)
							}
						})
						if (item.letter === '☆') {
							item.data = star
						}
					})
				})
						
				
			}
		}
	}
</script>

<style>

</style>
