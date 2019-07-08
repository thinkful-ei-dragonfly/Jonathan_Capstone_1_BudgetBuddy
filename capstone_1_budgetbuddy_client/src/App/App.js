import React from 'react'
import Nav from '../Nav/Nav'
import LandingPage from '../LandingPage/LandingPage'
import SignupPage from '../SignupPage/SignupPage'
import LoginPage from '../LoginPage/LoginPage'
import { Route } from 'react-router-dom'
import './App.css'


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
      </>
    )
  }
  render(){
  return (
    <body>
    <Nav />
    <main className ='App_main'>
      {this.renderMainRoutes()}
    </main>
    <footer role="content-info">Footer</footer>
  </body>
  );
}
}

export default App;
