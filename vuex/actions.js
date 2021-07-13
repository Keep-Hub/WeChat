export const getLoginToken = ({commit}, params) => {
  commit('hasLogin', params)
}
export const getUserInfo = ({commit}, params) => {
  commit('getUserInfo', params)
}