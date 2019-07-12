import config from '../config'
import TokenService from './token-service'

const AuthApiService = {
  postLogin(credentials) {
    return fetch(`${config.API_ENDPOINT}/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(credentials)
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },

  postUser(user) {
    return fetch(`${config.API_ENDPOINT}/users`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(user),
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(e => Promise.reject(e))
        return res.json()
      })
  },

  updateUser(user){
    return fetch(`${config.API_ENDPOINT}/users/${TokenService.getUserID()}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify(user),
    })
    .then(res => {
      if(!res.ok)
      return res.json().then(e => Promise.reject(e))
      return res.json()
    })
  },

  deleteUser(user_id){
    return fetch(`${config.API_ENDPOINT}/users/${user_id}`, {
      method: 'DELETE',
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
    .then(res => {
      if(!res.ok)
      return res.then(e => Promise.reject(e))
      return res
    })
    .catch(error => {
      console.error({ error })
    })
  },

  postTransaction(transaction) {
    return fetch(`${config.API_ENDPOINT}/transactions/user/${TokenService.getUserID()}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(transaction),
    })
    .then(res => {
      if(!res.ok)
      return res.json().then(e => Promise.reject(e))
      return res.json()
    })
  },

  deleteTransaction(id){
    return fetch(`${config.API_ENDPOINT}/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
    .then(res => {
      if(!res.ok)
      return res.json().then(e => Promise.reject(e))
      return res.json()
    })
  },
}

export default AuthApiService