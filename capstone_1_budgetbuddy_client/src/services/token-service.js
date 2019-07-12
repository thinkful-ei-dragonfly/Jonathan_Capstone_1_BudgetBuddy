import config from '../config'

const TokenService = {
  saveAuthToken(token, id) {
    window.localStorage.setItem(config.TOKEN_KEY, token)
    
    window.localStorage.setItem('user_id', id)
  },
  getAuthToken() {
    return window.localStorage.getItem(config.TOKEN_KEY)
  },
  clearAuthToken() {
    window.localStorage.removeItem(config.TOKEN_KEY)
    window.localStorage.removeItem('user_id')
  },
  hasAuthToken() {
    return !!TokenService.getAuthToken()
  },
  makeBasicAuthToken(userName, password) {
    return window.btoa(`${userName}:${password}`)
  },

  getUserID(){
    return window.localStorage.getItem('user_id')
  }
}

export default TokenService