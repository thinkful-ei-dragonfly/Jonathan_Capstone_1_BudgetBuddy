import React from 'react'
import { Link } from 'react-router-dom'
import MainHeader from '../../components/MainHeader/MainHeader'
import ValidationError from '../../ValidationError/ValidationError'
import BudgetBuddyForm from '../../components/BudgetBuddyForm/BudgetBuddyForm'
import AuthApiService from '../../services/auth-api-service'
import config from '../../config'
import './SignupPage.css'

export default class SignupPage extends React.Component {
  constructor(props) {
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
      error: null,
      validationMessages: {
        first_name: '',
        last_name: '',
        email: '',
        user_password: ''
      }
    }
  }

  setFirstName(first_name) {
    this.setState({ first_name }, () => this.validateFirstName(first_name))
  }

  validateFirstName(first_name) {
    const fieldErrors = { ...this.state.validationMessages }
    let first_name_valid = true
    let hasError = false

    first_name = first_name.replace(/[\s-]/g, '')
    if (first_name === 0) {
      fieldErrors.first_name = 'First Name is required'
      first_name_valid = false
      hasError = true
    }
    else {
      fieldErrors.first_name = ''
      first_name_valid = true
      hasError = false
    }
    this.setState({ validationMessages: fieldErrors, first_name_valid: !hasError }, () => this.formValid())
  }

  setLastName(last_name) {
    this.setState({ last_name }, () => this.validateLastName(last_name))
  }

  validateLastName(last_name) {
    const fieldErrors = { ...this.state.validationMessages }
    let last_name_valid = true
    let hasError = false

    last_name = last_name.replace(/[\s-]/g, '')
    if (last_name === 0) {
      fieldErrors.last_name = 'Last Name is required'
      last_name_valid = false
      hasError = true
    }
    else {
      fieldErrors.last_name = ''
      last_name_valid = true
      hasError = false
    }
    this.setState({ validationMessages: fieldErrors, last_name_valid: !hasError }, () => this.formValid())
  }

  setEmail(email) {
    this.setState({ email }, () => this.validateEmail(email))
  }

  validateEmail(email) {
    const fieldErrors = { ...this.state.validationMessages }
    let email_valid = true
    let hasError = false

    if (!email.includes('@')) {
      fieldErrors.email = 'Must provide a valid email'
      email_valid = false
      hasError = true
    }
    else {
      fieldErrors.email = ''
      email_valid = true
      hasError = false
    }
    this.setState({ validationMessages: fieldErrors, email_valid: !hasError }, () => this.formValid())
  }

  setPassword(user_password) {
    this.setState({ user_password }, () => this.validatePassword(user_password))
  }

  validatePassword(user_password) {
    const fieldErrors = { ...this.state.validationMessages }
    let user_password_valid = true
    let hasError = false

    user_password = user_password.replace(/[\s-]/g, '')
    if (user_password < 7 || user_password === 0) {
      fieldErrors.user_password = 'Password must be at least 8 characters long'
      user_password_valid = false
      hasError = true
    }
    else {
      fieldErrors.user_password = ''
      user_password_valid = true
      hasError = false
    }
    this.setState({ validationMessages: fieldErrors, user_password_valid: !hasError }, () => this.formValid())
  }

  formValid() {
    this.setState({
      form_valid: this.state.first_name_valid && this.state.last_name_valid && this.state.email_valid && this.state.user_password_valid
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
    AuthApiService.postUser(user)
      .then(user => {
        this.props.history.push(`/login`)
      })
      .catch(res => {
        this.setState({
          error: res.error
        })
        // console.error({ error })
      })
  }
  render() {
    const { first_name_valid, last_name_valid, email_valid, user_password_valid, validationMessages } = this.state
    return (
      <div>
        <main role="main">
          <header>
            <MainHeader />
            <h2>Sign Up</h2>
          </header>
          <section>
            <BudgetBuddyForm onSubmit={this.handleSubmit} >
              <div className='field'>
                <label htmlFor="first-name">First name
              {!first_name_valid && (
                    <p className="error">{validationMessages.first_name}</p>)}</label>
                <input placeholder='First Name' type="text" name='first-name' id='first-name' onChange={e => this.setFirstName(e.target.value)} />
                <ValidationError hasError={!this.state.first_name_valid} message={this.state.validationMessages.first_name} />
              </div>
              <div className='field'>
                <label htmlFor="last-name">Last name
              {!last_name_valid && (
                    <p className="error">{validationMessages.last_name}</p>)}</label>
                <input type="text" name='last-name' id='last-name' placeholder='Last Name' onChange={e => this.setLastName(e.target.value)} />
                <ValidationError hasError={!this.state.last_name_valid} message={this.state.validationMessages.last_name} />
              </div>
              <div className='field'>
                <label htmlFor="username">Email
              {!email_valid && (
                    <p className="error">{validationMessages.email}</p>)}</label>
                <input type="text" name='email' id='email' onChange={e => this.setEmail(e.target.value)} />
                <p className="submission-error">{this.state.error}</p>
                <ValidationError hasError={!this.state.email_valid} message={this.state.validationMessages.email} />
              </div>
              <div className='field'>
                <label htmlFor="password">Password
              {!user_password_valid && (
                    <p className="error">{validationMessages.user_password}</p>)}</label>
                <input type="password" name='password' id='password' onChange={e => this.setPassword(e.target.value)} />
                <ValidationError hasError={!this.state.user_password_valid} message={this.state.validationMessages.user_password} />
              </div>
              <button type='submit' disabled={!this.state.form_valid}>Sign Up</button>
            </BudgetBuddyForm>
            <p>Already have an account?<Link to='/login'><button>Log in</button></Link>
            </p>
          </section>
        </main>
      </div>
    )
  }
}