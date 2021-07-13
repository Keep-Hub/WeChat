let domain = 'http://10.10.20.128:8668'

function register(params) {
	return requestInterface(domain + '/register','POST',params)
}
function login(params) {
	return requestInterface(domain + '/login','POST',params)
}
function checkCode(params) {
	return requestInterface(domain + '/checkCode','GET',params)
}
function mail(params) {
	return requestInterface(domain + '/mail','POST',params)
}
function testToken(params) {
	return requestInterface(domain + '/testToken','POST',params)
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
	register,
	login,
	mail,
	checkCode,
	testToken
}