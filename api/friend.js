let domain = 'http://10.10.20.128:8668'

function sendFriendApply(params) {
	return requestInterface(domain + '/sendFriendApply','POST',params)
}
function queryUserDetail(params) {
	return requestInterface(domain + '/queryUserDetail','POST',params)
}
function ApplyThroughFriend(params) {
	return requestInterface(domain + '/ApplyThroughFriend','POST',params)
}
function requestInterface(u,m,d) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: u,
			data: d,
			method: m,
			header: {
			           'token' : uni.getStorageSync('token'),
			         },
		}).then(data => {
			resolve(data[1].data);
		}).catch(err => {
			reject(err)
		})
	})
}
export default {
	sendFriendApply,
	queryUserDetail,
	ApplyThroughFriend
}