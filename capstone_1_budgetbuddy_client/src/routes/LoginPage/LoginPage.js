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
    console.log(window.location)
    document.location.assign('https://capstone1budgetbuddyclient.jmjonemoore.now.sh/home')
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