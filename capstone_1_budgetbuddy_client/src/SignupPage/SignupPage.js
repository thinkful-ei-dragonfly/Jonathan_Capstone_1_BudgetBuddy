import React from 'react'
import { Link } from 'react-router-dom'
import './SignupPage.css'

export default class SignupPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      user_password: '',
      first_name_valid: false,
      last_name_valid: false,
      email_valid: false,
      user_password_valid: false,
      form_valid: false,
      hasError: false,
      validationMessages: {
        first_name: '',
        last_name: '',
        email: '',
        user_password: ''
      }
    }
  }

  setFirstName(first_name){
    this.setState({ first_name }, () => this.validateFirstName(first_name))
  }

  validateFirstName(first_name){
    const fieldErrors = { ...this.state.validationMessages }
    let first_name_valid = true
    let hasError = false

    first_name = first_name.replace(/[\s-]/g, '')
    if(first_name === 0){
      fieldErrors.first_name = 'First Name is required'
      first_name_valid = false
      hasError = true
    }
    else{
      fieldErrors.first_name = ''
      first_name_valid = true
      hasError = false
    }
    this.setState({ validationMessages: fieldErrors, first_name_valid: !hasError })
  }
  render(){
    return(
      <div>
        <body>
    <nav role="navigation">Nav</nav>
    <main role="main">
      <header>
        <h1>BudgetBuddy</h1>
        <h2>Sign Up</h2>
      </header>
      <section>
        <form class='signup-form'>
            <div>
              <label for="first-name">First name</label>
              <input placeholder='First Name' type="text" name='first-name' id='first-name' />
            </div>
            <div>
              <label for="last-name">Last name</label>
              <input type="text" name='last-name' id='last-name' placeholder='Last Name' />
            </div>
            <div>
              <label for="username">Email</label>
              <input type="text" name='username' id='username' />
            </div>
            <div>
              <label for="password">Password</label>
              <input type="password" name='password' id='password' />
            </div>
            <button type='submit'>Sign Up</button>
        </form>
        <p>Already have an account?<Link to='/login'><button>Log in</button></Link>
        </p>
      </section>
    </main>
  </body>
        </div>
    )
  }
}