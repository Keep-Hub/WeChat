<template>
	<view class="content">
	<view class="main">
		<view v-for="i in arr">
			{{i}}
		</view>
	</view>
	<input type="text" v-model="cont" class="cont" />
	<button type="default" @tap="send">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cont: '',
				arr: [123,666,666]
			}
		},
		onLoad() {

		},
		methods: {
			send: function () {
				this.arr.push(this.cont)
				this.cont = ''
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}
.main{
	border: 1px solid #007AFF;
	width: 300px;
	min-height: 200px;
}
	.cont {
		border: 1px solid #007AFF;
		margin-top: 20px;
	}
</style>
