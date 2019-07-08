import React from 'react'
import './LoginPage.css'

export default class LoginPage extends React.Component{
  render(){
    return (
      <div>
        <body>
    <nav role="navigation">Nav</nav>
    <main role="main">
      <header>
        <h1>BudgetBuddy</h1>
        <h2>Log In</h2>
      </header>
      <section>
        <form class='signup-form'>
            <div>
              <label for="user-name">Username</label>
              <input placeholder='Username' type="text" name='user-name' id='user-name' />
            </div>
            <div>
              <label for="password">Password</label>
              <input type="text" name='password' id='last-name' placeholder='password' />
            </div>
            <button type='submit'>Log In</button>
        </form>
      </section>
    </main>
  </body>
      </div>
    )
  }
}