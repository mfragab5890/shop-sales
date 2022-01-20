import React, { Component, Fragment } from 'react'
import 'semantic-ui-css/semantic.min.css'
import LoadingBar from 'react-redux-loading'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter} from 'react-router-dom'
import Main from './Main'
import Login from './Login'
import SignUp from './SignUp'

class App extends Component {
  state = {
    prevLocation: '',
  }

  componentDidMount = async () => {
    const { pathname } = this.props.location
    const { prevLocation } = this.state
    if ( prevLocation !== pathname ) {
      await this.setState({
        prevLocation : pathname,
      })
    }

  }

  render(){
    const { prevLocation } = this.state
    const { authedUser } = this.props
    if (!authedUser && authedUser!=="" &&authedUser!== undefined) {
      return (
        <Fragment>
          <LoadingBar />
          <Route exact path='/sign-up' render ={() => (
              <SignUp prevLocation = {prevLocation} />
            )}
          />
          <Route exact path='/log-in' render ={() => (
              <Login prevLocation = {prevLocation} />
            )}
          />
        <Redirect to='/log-in' />
        </Fragment>
      );
    }
    else {
      return <Main/>
    }
  }

}

const mapStateToProps = ({authedUser}) => {
  return {
    authedUser,
    loading : authedUser === null
  };
}

export default withRouter(connect(mapStateToProps)(App))
