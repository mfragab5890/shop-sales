import React, { Component, Fragment } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Segment, Dimmer, Loader, Image} from 'semantic-ui-react'
import LoadingBar from 'react-redux-loading'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter} from 'react-router-dom'
import Main from './Main'
import Login from './Login'
import { checkServer } from '../utils/api'
import Error from './Error'

class App extends Component {
  state = {
    prevLocation: '',
    runServerCheck:false,
    serverCheck: false,
  }

  componentDidMount = async () => {
    const { pathname } = this.props.location
    const { prevLocation } = this.state
    const serverCheck = await checkServer().then(res => res.success)
    if ( prevLocation !== pathname ) {
      await this.setState({
        prevLocation : pathname,
        runServerCheck : true,
        serverCheck : serverCheck,
      })
    }
    else {
      await this.setState({
        runServerCheck : true,
        serverCheck : serverCheck,
      })
    }
  }

  render(){
    const { prevLocation, runServerCheck, serverCheck } = this.state
    const { authedUser } = this.props
    if (!serverCheck && runServerCheck) {
      return <Error message = "Sorry the server is not running please check your API server and reload the page" />;
    }
    if (!runServerCheck) {
      return (
        <Segment style = {{width:'100%', height:'100%'}}>
          <Dimmer active style = {{width:'100%'}}>
            <Loader indeterminate  style = {{width:'100%'}}>Checking Server Please Wait</Loader>
          </Dimmer>
          <Image src='/shopn.jpg' style = {{width:'100%'}}/>
        </Segment>
      )
    }
    if (!authedUser && authedUser!=="" &&authedUser!== undefined) {
      return (
        <Fragment>
          <LoadingBar />
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
  };
}

export default withRouter(connect(mapStateToProps)(App))
