import React from 'react'
import { Link } from 'react-router-dom'

export default class MainHeader extends React.Component {
  render(){
    return (
      <div>
      <header role="banner">
        <Link to='/'><h1>BudgetBuddy</h1></Link>
      </header>
      </div>
    )
  }
}