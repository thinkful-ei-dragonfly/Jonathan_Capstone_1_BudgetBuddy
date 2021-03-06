import React from 'react'
import AuthApiService from '../../services/auth-api-service'
import TokenService from '../../services/token-service'
import BudgetBuddyForm from '../BudgetBuddyForm/BudgetBuddyForm'

export default class LoginForm extends React.Component{
  static defaultProps = {
    onDeleteSuccess: () => {}
  }

  state = { error: null }

  handleSubmitJwtAuth = e => {
    e.preventDefault()
    this.setState({ error: null })
    const { email, user_password } = e.target

    AuthApiService.postLogin({
      email: email.value,
      user_password: user_password.value
    })
    .then(res => {
      AuthApiService.deleteUser(res.user_id)
      this.props.onDeleteSuccess()
      TokenService.clearAuthToken()
    })
    // .then(res => {
    //   email.value = ''
    //   user_password.value = ''
    //   TokenService.saveAuthToken(res.authToken, res.user_id)
    //   this.props.onLoginSuccess()
    // })
    .catch(res => {
      this.setState({
        error: res.error
      })
    })
  }

  render(){
    return(
      <div>
      <BudgetBuddyForm onSubmit={this.handleSubmitJwtAuth}>
            <div>
              <label htmlFor="email">Email</label>
              <input placeholder='Username' type="text" name='email' id='email' />
            </div>
            <div>
              <label htmlFor="user_password">Password</label>
              <input type="password" name='user_password' id='user_password' placeholder='password' />
              <p className="submission-error">{this.state.error}</p>
            </div>
            <button type='submit'>Delete Account</button>
            <p>*Deleting your account will delete all of your data.</p>
        </BudgetBuddyForm>
      </div>
    )
  }
}