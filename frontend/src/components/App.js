import React, { Component, Fragment } from 'react'
import 'semantic-ui-css/semantic.min.css'
import LoadingBar from 'react-redux-loading'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter, Switch } from 'react-router-dom'
import Main from './Main'
import Login from './Login'
import SignUp from './SignUp'
import { getToken } from '../utils/token'

class App extends Component {
  state = {
    homeData: {},
    products: [],
    prevLocation: '',
    pages:0,
    theme: 'black',
    lang: 'AR',
    authedUser: null,
  }

  componentDidMount = async () => {
    const { prevLocation } = this.state
    const { pathname } = this.props.location
    if ( prevLocation !== pathname ) {
      await this.setState({
        prevLocation : pathname
      })
    }
  }

  render(){
    const { homeData, theme, lang, products, pages, prevLocation,authedUser } = this.state
    console.log(authedUser);
    if (!authedUser && authedUser!=="" &&authedUser!== undefined) {
      return (
        <Fragment>
          <LoadingBar />
          <Route exact path='/sign-up' render ={() => (
              <SignUp prevLocation = {prevLocation} />
            )}
          />
          <Route exact path='/log-in' render ={() => (
              <Login prevLocation = {prevLocation}/>
            )}
          />
        <Redirect to='/log-in' />
        </Fragment>
      );
    }
    else {
      return (
        <Main.js/>
      );
    }
  }

}

export default withRouter(connect()(App))
