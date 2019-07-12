import React from 'react'
import MainHeader from '../../components/MainHeader/MainHeader'
import { Link } from 'react-router-dom'
import config from '../../config'
import { format } from 'date-fns'
import './UserPage.css'
import TokenService from '../../services/token-service'
import AuthApiService from '../../services/auth-api-service'
import TransactionTable from '../../components/TransactionTable/TransactionTable'


export default class UserPage extends React.Component {
  state = {
    transactions: [],
    categories: [],
    month: '',
    category: ''
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
        console.log(categories)
        this.setState({ transactions, categories })
      })
      .catch(error => {
        console.error({ error })
      })

  }
  convertCategory = category => {
    let word
    switch (category) {
      case 1:
        word = 'Gas'
        break
      case 2:
        word = 'Groceries'
        break
      case 3:
        word = 'Travel'
        break
      case 4:
        word = 'Dining'
        break
      case 5:
        word = 'Entertainment'
        break
      case 6:
        word = 'Fitness'
        break
      case 7:
        word = 'Work'
        break
      default:
        word = 'Other'
    }
    return word
  }

  handleMonthFilter = e => {
    this.setState({
      month: e.target.value
    })
  }

  handleCategoryFilter = e => {
    this.setState({
      category: e.target.value
    })
  }

  handleDeleteTransaction = e => {
    e.preventDefault()
    const id = this.state.transactions.id
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

    const headings = [
      'Date',
      'Title',
      'Amount',
      'Category',
    ]

    const rows = this.state.transactions.map(transaction => {
      return [format(transaction.date_added, 'MM-DD-YYYY'), transaction.title, `$${transaction.amount.toFixed(2)}`, this.convertCategory(transaction.category)]
    })

    const filteredRows = rows.filter(row => row[0].startsWith(this.state.month) && row[3].startsWith(this.state.category))

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
          <label htmlFor='month'>Month </label>
          <select onChange={this.handleMonthFilter} name="month">
            <option value="">Select Month</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <div>
            <label htmlFor='category'>Category </label>
            <select onChange={this.handleCategoryFilter} name="category">
              <option value="">Select Category </option>
              {this.state.categories.map(category => {
                return <option value={category.category}>{category.category}</option>
              })}
            </select>
          </div>

          <section>
            <TransactionTable headings={headings} rows={filteredRows} />
          </section>
          <Link to='entry'><button>New Transaction</button></Link>
        </main>
      </div>
    )
  }
}