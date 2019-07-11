import React from 'react'
import MainHeader from '../../components/MainHeader/MainHeader'
import BudgetBuddyForm from '../../components/BudgetBuddyForm/BudgetBuddyForm'
import './TransactionEntry.css'
import AuthApiService from '../../services/auth-api-service'
import TokenService from '../../services/token-service'
import config from '../../config'

export default class TransactionEntry extends React.Component{
 state ={
   categories: []
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
    console.log(transaction)
    AuthApiService.postTransaction(transaction)
    .then(transaction => {
      this.props.history.push(`/home`)
    })
    .catch(error => {
      console.error({ error })
    })
  }
  render(){

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
                  <option value="1">Gas</option>
                  <option value="2">Groceries</option>
                  <option value="3">Travel</option>
                  <option value="4">Dining</option>
                  <option value="5">Entertainment</option>
                  <option value="6">Fitness</option>
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