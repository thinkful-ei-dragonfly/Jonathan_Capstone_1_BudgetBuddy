import React from 'react'
import Footer from '../Footer/Footer'
import LandingPage from '../../routes/LandingPage/LandingPage'
import SignupPage from '../../routes/SignupPage/SignupPage'
import LoginPage from '../../routes/LoginPage/LoginPage'
import DeleteAccount from '../../routes/DeleteAccount/DeleteAccount'
import { Route } from 'react-router-dom'
import './App.css'
import UserPage from '../../routes/UserPage/UserPage'
import TransactionEntry from '../../routes/TransactionEntry/TransactionEntry'
import TokenService from '../../services/token-service'
import EditAccountPage from '../../routes/EditAccountPage/EditAccountPage'
import ChangeFirstName from '../../routes/ChangeFirstName/ChangeFirstName'


class App extends React.Component {

  renderMainRoutes(){
    const authorized = TokenService.hasAuthToken()
    let page
    let entry
    let edit
    let deletePage
    let changeFirstName
    
    if(authorized){
      page = UserPage
      entry = TransactionEntry
      edit = EditAccountPage
      deletePage = DeleteAccount
    }
    else{
      page = LandingPage
      entry = LandingPage
      edit = LandingPage
      deletePage = LandingPage
    }

    return (
      <>
      <Route
      exact
      key='/about'
      path='/about'
      component={LandingPage}
      />
      
      <Route
      exact
      path='/'
      component={page}
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
      component={page}
      />

      <Route
      exact
      key='/entry'
      path='/entry'
      component={entry}
      />

      <Route
      exact
      key='/edit_account'
      path='/edit_account'
      component={edit}
      />

      <Route 
      exact
      key='/delete_account'
      path='/delete_account'
      component={deletePage}/>
      </>
    )
  }
  render(){
  return (
    <div>
    {/* <Nav /> */}
    <main className ='App_main'>
      {this.renderMainRoutes()}
    </main>
    <Footer />
  </div>
  );
}
}

export default App;
