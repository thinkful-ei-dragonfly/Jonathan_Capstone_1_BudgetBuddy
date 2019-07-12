import React from 'react'
import { Link } from 'react-router-dom'
import './SignupButton.css'

export default class SignupButton extends React.Component {
  render(){
    return (
    <Link to='/signup'>Sign Up</Link>
    )
  }
}