import React from 'react'
import MainHeader from '../../components/MainHeader/MainHeader'
import { Link } from 'react-router-dom'
import config from '../../config'

import './UserPage.css'
import TokenService from '../../services/token-service'
import TransactionEntry from '../TransactionEntry/TransactionEntry';
import AuthApiService from '../../services/auth-api-service';

export default class UserPage extends React.Component {
  state = {
    transactions: [],
    categories: []
  }

  componentDidMount() {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/transactions/user/${TokenService.getUserID()}`, {
        headers: {
          'authorization': `bearer ${TokenService.getAuthToken()}`,
        }
      }),
      fetch(`${config.API_ENDPOINT}/categories`)
    ])
      .then(([transactionsRes, categoriesRes]) => {
        if (!transactionsRes.ok)
          return transactionsRes.json().then(e => Promise.reject(e))
        if (!categoriesRes.ok)
          return categoriesRes.json().then(e => Promise.reject(e))

        return Promise.all([
          transactionsRes.json(),
          categoriesRes.json(),
        ])
      })
      .then(([transactions, categories]) => {
        this.setState({ transactions, categories })
      })
      .catch(error => {
        console.error({ error })
      })

  }


  handleDeleteTransaction = e => {
    e.preventDefault()
    const id = e.target['id'].value
    console.log(id)
    AuthApiService.deleteTransaction(id)
    .then(transaction => {
      this.props.history.push(`/home`)
    })
    .catch(error => {
      console.error({ error })
    })
    this.setState({
      notes: this.state.transactions.filter(transaction => transaction.id !== id)
    })
  }

  render() {
    let amountArray = []
    let reducer = () => { }
    let balance = null

    if (this.state.transactions.length > 0) {
      amountArray = this.state.transactions.map(transaction => transaction.amount)
      reducer = (acc, currVal) => acc + currVal
      balance = (amountArray.reduce(reducer)).toFixed(2)
      
    }
    return (
      <div>
        <main role="main">
          <header>
            <MainHeader />
            <p>Your Balance: ${balance} </p>
          </header>
          <label htmlFor='month'>Month</label>
          <select>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
          <section>
            <table className='transaction-list' >
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
              </tr>
              <tr>
                {this.state.transactions.map(transaction =>
                  <div onClick={this.handleDeleteTransaction} id={transaction.id}>
                    <td>{transaction.date_added}</td>
                    <td>{transaction.title}</td>
                    <td>${transaction.amount.toFixed(2)}</td>
                    <td>{transaction.category}</td>
                    <td><button>Delete</button></td>
                    <td><button>Edit</button></td>
                  </div>
                )}
              </tr>
            </table>
          </section>
          <Link to='entry'><button>New Transaction</button></Link>
        </main>
      </div>
    )
  }
}