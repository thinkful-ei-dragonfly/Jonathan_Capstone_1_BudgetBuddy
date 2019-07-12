import React from 'react'
import './LoginPage.css'
import MainHeader from '../../components/MainHeader/MainHeader'
import LoginForm from '../../components/LoginForm/LoginForm'

export default class LoginPage extends React.Component{
  static defaultProps = {
    location: {},
    history: {
      push: () => {},
    },
  }

  handleLoginSuccess = () => {
    document.location.assign('http://localhost:3000/home')
  }
  render(){
    return (
      <div>
    <main role="main">
      <header>
        <MainHeader />
        <h2>Log In</h2>
      </header>
      <section>
       <LoginForm onLoginSuccess={this.handleLoginSuccess}/>
      </section>
    </main>
      </div>
    )
  }
}