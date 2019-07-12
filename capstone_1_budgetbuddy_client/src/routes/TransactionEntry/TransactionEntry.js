import React from 'react'
import MainHeader from '../../components/MainHeader/MainHeader'
import BudgetBuddyForm from '../../components/BudgetBuddyForm/BudgetBuddyForm'
import './TransactionEntry.css'
import AuthApiService from '../../services/auth-api-service'
import TokenService from '../../services/token-service'
import config from '../../config'

export default class TransactionEntry extends React.Component{
 state ={
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

  handleSubmit = e => {
    let amount = null
    if(e.target['type'].value === 'Withdrawal'){
      amount = (e.target['amount'].value) * -1
    }
    else{
      amount = (e.target['amount'].value)
    }

    e.preventDefault()
    const transaction = {
      title: e.target['title'].value,
      amount,
      user_id: TokenService.getUserID(),
      category: e.target['category'].value,
    }
    AuthApiService.postTransaction(transaction)
    .then(transaction => {
      this.props.history.push(`/home`)
    })
    .catch(error => {
      console.error({ error })
    })
  }
  render(){
    let categories = []
    if(this.state.categories.length > 0){
      categories = this.state.categories.map(category => <option value={category.id}>{category.category}</option>)
    }
    return(
      <div>
    <main role="main">
      <header>
        <MainHeader />
        <h2>Transaction</h2>
      </header>
      <section>
        <BudgetBuddyForm onSubmit={this.handleSubmit} className='signup-form'>
            <div>
              <label htmlFor="transaction-type">Deposit or Withdrawal?</label>
             <select name='type'>
               <option value="Deposit">Deposit</option>
               <option value="Withdrawal">Withdrawal</option>
               </select>
            </div>
              <div>
              <label htmlFor="title">Title</label>
              <input type="text" name='title' id='title' placeholder='Name For transaction'/>
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
             <input tyep="number" name='amount' it = 'amount' placeholder='10.00'/>
              </div>
              <div>
                <label htmlFor="category">Category</label>
                <select name="category">
                  {categories}
                </select>
              </div>
            <button type='submit'>Submit</button>
        </BudgetBuddyForm>
      </section>
    </main>
    </div>
    )
  }
}