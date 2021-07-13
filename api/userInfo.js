let domain = 'http://10.10.20.128:8668'

function getBuddyList(params) {
	return requestInterface(domain + '/getBuddyList','POST',params)
}
function getVerifyBuddy(params) {
	return requestInterface(domain + '/getVerifyBuddy','POST',params)
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
	getBuddyList,
	getVerifyBuddy
}