import React from 'react'
import MainHeader from '../../components/MainHeader/MainHeader'
import config from '../../config'
import './UserPage.css'

export default class UserPage extends React.Component {
  getCategories = () => {
    return fetch(`${config.API_ENDPOINT}/categories`)
    .then(res => 
      (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json())
  }

  render() {
    const categories = this.getCategories()
    console.log(categories)
    return (
      <div>
      <main role="main">
        <header>
          <MainHeader />
          <p>Your Balance: </p>
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

          <table className='transaction-list'>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
            </tr>
          </table>
        </section>
        <button>New Transaction</button>
      </main>
      </div>
    )
  }
}