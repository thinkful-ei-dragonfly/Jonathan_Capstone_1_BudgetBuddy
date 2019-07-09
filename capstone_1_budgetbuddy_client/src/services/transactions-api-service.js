import TokenService from '../services/token-service'
import config from '../config'

const TransactionApiService = {
  getTransactions(userId) {
    return fetch(`${config.API_ENDPOINT}/transactions/user/${userId}`, {
      headers: {
        'authorization': `basic ${TokenService.getAuthToken()}`,
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },
  postTransaction(userId, transaction) {
    return fetch(`${config.API_ENDPOINT}/transactions/user/${userId}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `basic ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify({
        transaction
      }),
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },

  updateTransaction(userId, transaction){
    return fetch(`${config.API_ENDPOINT}/transactions/user/${userId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `basic ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify({
        transaction
      })
    })
    .then(res =>
      (!res.ok)
      ? res.json().then(e => Promise.reject(e))
      : res.json())
  }
}

export default TransactionApiService