import React from 'react'
import SignupButton from '../SignupButton/SignupButton'
import LoginButton from '../LoginButton/LoginButton'
import MainHeader from '../MainHeader/MainHeader'

export default class LandingPage extends React.Component {
  render() {
    return (
      <div>
        <MainHeader />
        <section>
          <header>
            <h3>A 21st Century Way to Manage Money</h3>
          </header>
          <p>[<em>placeholder for image</em>]</p>
          <p>BudgetBuddy helps you manage your finances. You can enter a purchase or deposit and BudgetBuddy will update your balance for you.</p>
        </section>
        <section>
          <header>
            <h3>Record your Deposits and Withdrawals</h3>
          </header>
          <p>[<em>placeholder for image</em>]</p>
          <p>The app allows you to enter data about your withdrawals and deposits. Once it receives that information, it updates your checkbook balance letting you know your current balance</p>
        </section>
        <section>
          <header>
            <h3>Keep Track of Your Finances</h3>
          </header>
          <p>[<em>placeholder for image</em>]</p>
          <p>The app provides you with a virtual balance book and updates after each entry. The app also allows you to set up recurring deposits and withdrawals!</p>
        </section>
        <section>
          <header>
            <h3>Start Saving Now!</h3>
          </header>
        </section>
        <SignupButton />
        <LoginButton />
      </div>

    )
  }
}