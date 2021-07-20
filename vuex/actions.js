export const getLoginToken = ({commit}, params) => {
  commit('hasLogin', params)
}
export const getUserInfo = ({commit}, params) => {
  commit('getUserInfo', params)
}
export const quitLogin = ({commit}, params) => {
  commit('quitLogin', params)
}
export const getChatList = ({commit}, params) => {
  commit('getChatList', params)
}
export const getAllBadge = ({commit}, params) => {
  commit('getAllBadge', params)
}