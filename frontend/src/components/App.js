import React, { Component, Fragment } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Segment, Image, Dimmer, Loader } from 'semantic-ui-react'
import LoadingBar from 'react-redux-loading'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter} from 'react-router-dom'
import { getToken } from '../utils/token'
import { handleInitialData } from '../actions/shared'
import Main from './Main'
import Login from './Login'
import SignUp from './SignUp'

class App extends Component {
  state = {
    prevLocation: '',
    loading: false
  }

  componentDidMount = async () => {
    const { prevLocation } = this.state
    const { pathname } = this.props.location
    const { dispatch } = this.props
    if ( prevLocation !== pathname ) {
      await this.setState({
        prevLocation : pathname,
        loading: true
      })
    }
    if (getToken()) {
      await dispatch(handleInitialData())
      await this.setState({
        loading: false,
      })
      return this.props.history.push(prevLocation)
    }
    await this.setState({
      loading: false
    })
  }

  render(){
    const { prevLocation, loading} = this.state
    const { authedUser } = this.props
    if (loading) {
      return (
        <Segment>
          <Dimmer active>
            <Loader indeterminate>Preparing Data</Loader>
          </Dimmer>
          <Image src='/shopn.jpg' />
        </Segment>
      )
    }
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
