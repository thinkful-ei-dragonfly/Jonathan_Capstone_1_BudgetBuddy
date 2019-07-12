import React from 'react'
import { Link } from 'react-router-dom'
import TokenService from '../../services/token-service'

export default class MainHeader extends React.Component {
  handleLogoutClick = () => {
    TokenService.clearAuthToken()
    document.location.assign('http://localhost:3000/')
  }
  renderLoginLink() {
    return (
      <div>
        {/* <nav role="navigation"> */}
          <Link to='/signup'><button>Sign Up</button></Link>

          <Link to='/login'><button>Log In</button></Link>
        {/* </nav> */}
      </div>
    )
  }

  renderLogOutLink() {
    return (
      <div>
        {/* <nav role="navigation"> */}
          <button onClick ={this.handleLogoutClick}>Logout</button>
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
      </header>
      </div>
    )
  }
}