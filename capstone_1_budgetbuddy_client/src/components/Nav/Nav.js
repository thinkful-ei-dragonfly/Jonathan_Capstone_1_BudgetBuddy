import React from 'react'
import { Link } from 'react-router-dom'
import './Nav.css'

export default class Nav extends React.Component{
  render () {
    return (
      <nav role="navigation"><Link to='/signup'><button>Sign Up</button></Link>
            <Link to='/login'><button>Log In</button></Link></nav>
    )
  }
}