import React from 'react'
import { Link } from 'react-router-dom'
import './LoginButton.css'

export default class LoginButton extends React.Component{
  render(){
    return (
      <Link to='/login'>Log In</Link>
    )
  }
}