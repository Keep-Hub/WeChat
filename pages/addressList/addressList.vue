<template>
	<view>
		<uni-indexed-list :options="list" :showSelect="false" @click="bindClick()"></uni-indexed-list>
	</view>
</template>

<script>
	import userInfoApi from '../../api/userInfo.js'
	import pinyin from '../../node_modules/js-pinyin/index'
	import uniIndexedList from "@/components/uni-indexed-list/uni-indexed-list.vue"
	export default {
		components: {
			 uniIndexedList
			 },
		data() { 
			return {
				userInfo: {},
				fisrtPin: ["☆", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z", "#"],
				list: [{
						"letter": "↑",
						"data": [
							{
								"id": "666666",
								"nickName": "新的朋友",
								"img": "../../static/listImg/new.png"
							},
							{
								"id": "666666",
								"nickName": "仅聊天的朋友",
								"img": "../../static/listImg/only-talk.png"
							},
							{
								"id": "666666",
								"nickName": "群聊",
								"img": "../../static/listImg/group-chat.png"
							},
							{
								"id": "666666",
								"nickName": "标签",
								"img": "../../static/listImg/tap.png"
							},
							{
								"id": "666666",
								"nickName": "公众号",
								"img": "../../static/listImg/the-public.png"
							}
						]
						}
					]
			}
		},
		onLoad(option) {
		},
		onReady() {
			uni.setNavigationBarTitle({
			　　title: '通讯录(' + 12 + ')'
			})
			uni.setTabBarBadge({
				index: 1,
				text: '99+'
			})
		},
		mounted() {
			let pinyin = require('js-pinyin');
			pinyin.setOptions({checkPolyphone: false, charCase: 0});
			uni.getStorage({
				key: 'userInfo',
				success: (res) => {
					this.userInfo = res.data
					this.nickSort(res.data._id)
				}
			})
		},
		methods: {
			bindClick: function (){
				uni.navigateTo({
				    url: '../personal/chatRoom/chatRoom'
				});
			},
			// 昵称排序
			nickSort: function (id) {
				userInfoApi.getBuddyList({_id: id}).then(res => {
					let newArr = []
					res.result.forEach((item, index) => {
						res.result[index].fisrt = pinyin.getCamelChars(item.nickName).substring(0, 1).toUpperCase()
						newArr.push(res.result[index]);
					})
					this.fisrtPin.forEach((item, index) => {
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
