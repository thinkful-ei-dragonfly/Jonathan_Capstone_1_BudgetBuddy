import React from 'react'
import { Link } from 'react-router-dom'
import config from '../config'
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

  setLastName(last_name){
    this.setState({ last_name }, () => this.validateLastName(last_name))
  }

  validateLastName(last_name){
    const fieldErrors = { ...this.state.validationMessages }
    let last_name_valid = true
    let hasError = false

    last_name = last_name.replace(/[\s-]/g, '')
    if(last_name === 0){
      fieldErrors.last_name = 'Last Name is required'
      last_name_valid = false
      hasError = true
    }
    else{
      fieldErrors.last_name = ''
      last_name_valid = true
      hasError = false
    }
    this.setState({ validationMessages: fieldErrors, last_name_valid: !hasError })
    }

    setEmail(email){
      this.setState({ email }, () => this.validateEmail(email))
    }

    validateEmail(email){
      const fieldErrors = { ...this.state.validationMessages }
      let email_valid = true
      let hasError = false

      email = email.replace(/[\s-]/g, '')
      if(email === 0){
        fieldErrors.email = 'Email is required'
        email_valid = false
        hasError = true
      }
      else{
        fieldErrors.email = ''
        email_valid = true
        hasError = false
      }
      this.setState({ validationMessages: fieldErrors, email_valid: !hasError })
    }

    setPassword(user_password){
      this.setState({ user_password }, () => this.validatePassword(user_password))
    }

    validatePassword(user_password){
      const fieldErrors = { ...this.state.validationMessages }
      let user_password_valid = true
      let hasError = false

      user_password = user_password.replace(/[\s-]/g, '')
      if(user_password < 7 || user_password === 0){
        fieldErrors.user_password = 'Password must be at least 8 characters long'
        user_password_valid = false
        hasError = true
      }
      else{
        fieldErrors.user_passwerd = ''
        user_password_valid = true
        hasError = false
      }
      this.setState({ validationMessages: fieldErrors, user_password_valid: !hasError })
    }

    formValid(){
      this.setState({
        formValid: this.state.first_name_valid && this.state.last_name_valid && this.state.email_valid && this.state.user_password_valid
      })
    }

    handleSubmit = e => {
      e.preventDefault()
      const user = {
        first_name: e.target['first-name'].value,
        last_name: e.target['last-name'].value,
        email: e.target['email'].value,
        user_password: e.target['password'].value
      }
      console.log(user)
      fetch(`${config.API_ENDPOINT}/users`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify(user),
      })
      .then(res => {
        if(!res.ok)
        return res.json().then(e => Promise.reject(e))
        return res.json()
      })
      .catch(error => {
        console.error({ error })
      })
    }
  render(){
    return(
      <div>
    <nav role="navigation">Nav</nav>
    <main role="main">
      <header>
        <h1>BudgetBuddy</h1>
        <h2>Sign Up</h2>
      </header>
      <section>
        <form onSubmit={this.handleSubmit} className='signup-form'>
            <div>
              <label htmlFor="first-name">First name</label>
              <input placeholder='First Name' type="text" name='first-name' id='first-name' />
            </div>
            <div>
              <label htmlFor="last-name">Last name</label>
              <input type="text" name='last-name' id='last-name' placeholder='Last Name' />
            </div>
            <div>
              <label htmlFor="username">Email</label>
              <input type="text" name='email' id='username' />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" name='password' id='password' />
            </div>
            <button type='submit'>Sign Up</button>
        </form>
        <p>Already have an account?<Link to='/login'><button>Log in</button></Link>
        </p>
      </section>
    </main>
        </div>
    )
  }
}