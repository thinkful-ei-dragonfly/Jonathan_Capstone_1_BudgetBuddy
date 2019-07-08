import React from 'react'
import './Nav.css'

export default class Nav extends React.Component{
  render () {
    return (
      <nav role="navigation"><button>Sign Up</button>
            <button>Log In</button></nav>
    )
  }
}