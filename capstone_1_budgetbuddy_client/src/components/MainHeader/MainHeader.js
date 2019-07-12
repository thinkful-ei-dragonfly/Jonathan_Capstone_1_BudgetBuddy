import React from 'react'
import { Link } from 'react-router-dom'
import TokenService from '../../services/token-service'
import SignupButton from '../SignupButton/SignupButton';
import LoginButton from '../LoginButton/LoginButton';

export default class MainHeader extends React.Component {
  handleLogoutClick = () => {
    TokenService.clearAuthToken()
    document.location.assign('https://capstone1budgetbuddyclient.jmjonemoore.now.sh/login')
  }
  renderLoginLink() {
    return (
      <div>
        {/* <nav role="navigation"> */}
        
          <SignupButton />
          <span className='Hyph'> - </span>
          
          <LoginButton />
          
        {/* </nav> */}
      </div>
    )
  }

  renderLogOutLink() {
    return (
      <div>
        {/* <nav role="navigation"> */}
          <Link to='/' onClick ={this.handleLogoutClick}>Logout</Link>
          <span className='Hyph'> - </span>
          <Link to='/edit_account'>Edit Account</Link>
        {/* </nav> */}
      </div>
    )
  }
  render(){
    return (
      <div>
      <header role="banner">
        <Link to='/'><h1>BudgetBuddy</h1></Link>
        {TokenService.hasAuthToken()
          ? this.renderLogOutLink()
          : this.renderLoginLink()
      }
      <Link to='/home'>Home</Link>
      </header>
      </div>
    )
  }
}