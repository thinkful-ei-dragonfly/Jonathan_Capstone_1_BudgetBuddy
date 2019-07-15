import React from 'react'
import { Link } from 'react-router-dom'
import TokenService from '../../services/token-service'
import SignupButton from '../SignupButton/SignupButton'
import LoginButton from '../LoginButton/LoginButton'
import './Footer.css'

export default class Footer extends React.Component{
  handleLogoutClick = () => {
    TokenService.clearAuthToken()
    // document.location.assign('https://capstone1budgetbuddyclient.jmjonemoore.now.sh/')
    document.location.assign('http://localhost:3000/')
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
    return(
      <div>
        <footer role="content-info">
          <Link to='/about'>About</Link>
          <span className='Hyph'> - </span>
        {TokenService.hasAuthToken()
          ? this.renderLogOutLink()
          : this.renderLoginLink()
      }
    </footer>
      </div>
    )
  }
}