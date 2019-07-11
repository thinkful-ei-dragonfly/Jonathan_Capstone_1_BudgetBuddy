import React from 'react'
import Nav from '../Nav/Nav'
import LandingPage from '../../routes/LandingPage/LandingPage'
import SignupPage from '../../routes/SignupPage/SignupPage'
import LoginPage from '../../routes/LoginPage/LoginPage'
import { Route } from 'react-router-dom'
import './App.css'
import UserPage from '../../routes/UserPage/UserPage'
import TransactionEntry from '../../routes/TransactionEntry/TransactionEntry'


class App extends React.Component {

  renderMainRoutes(){
    return (
      <>
      <Route
      exact
      path='/'
      component={LandingPage}
      />

      <Route
      exact
      key='/signup'
      path='/signup'
      component={SignupPage}
      />

      <Route
      exact
      key='/login'
      path='/login'
      component={LoginPage}
      />

      <Route
      exact
      key='/home'
      path='/home'
      component={UserPage}
      />

      <Route
      exact
      key='/entry'
      path='/entry'
      component={TransactionEntry}
      />
      </>
    )
  }
  render(){
  return (
    <div>
    <Nav />
    <main className ='App_main'>
      {this.renderMainRoutes()}
    </main>
    <footer role="content-info">Footer</footer>
  </div>
  );
}
}

export default App;
