import React from 'react'
import MainHeader from '../../components/MainHeader/MainHeader'

export default class NotFoundPage extends React.Component {
  render() {
    return (
      <div>
        <MainHeader />
        <section>
          <header>
            <h3>Sorry! Page Not Found.</h3>
            </header>
        </section>
      </div>

    )
  }
}