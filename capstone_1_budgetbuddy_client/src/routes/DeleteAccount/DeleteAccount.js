import React from 'react'
import MainHeader from '../../components/MainHeader/MainHeader'
import DeleteForm from '../../components/DeleteForm/DeleteForm'
import './DeleteAccount.css'

export default class DeleteAccount extends React.Component{
  handleDeleteSuccess = () => {
    document.location.assign('https://capstone1budgetbuddyclient.jmjonemoore.now.sh/home')
  }
  render(){
  return(
    <div>
       <main role="main">
      <header>
        <MainHeader />
        <h2>Delete Account</h2>
      </header>
      <section>
       <DeleteForm onDeleteSuccess={this.handleDeleteSuccess}/>
      </section>
    </main>
    </div>
  )
}
}