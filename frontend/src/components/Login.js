import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { handleUserLogin } from '../actions/authedUser'
import { Button, Form, Grid, Header, Image, Message, Segment, Dimmer, Loader } from 'semantic-ui-react'
import { handleInitialData } from '../actions/shared'
import { getToken } from '../utils/token'

class Login extends React.Component {

  state = {
    username : '',
    password : '',
    formComplete : false,
    showError : false,
    error: '',
    loading: true,
  }

  handleFormData = async (e) => {
    e.preventDefault()
    const { name, value } = e.target
    if (name === 'username') {
      await this.setState({
        username : value,
      })
    }
    else if (name === 'password') {
      await this.setState({
        password : value
      })
    }
    const {username, password} = this.state
    if (username !== '' && password !== '') {
      await this.setState({
        formComplete : true
      })
    }
    else {
      await this.setState({
        formComplete : false
      })
    }

  }

  handleFormSubmit = async(e) => {
    e.preventDefault()
    const { dispatch, prevLocation } = this.props
    console.log('login location', prevLocation);
    const username = this.state.username
    const password = this.state.password
    const remember = true
    this.setState({
      formComplete : false,
      error: '',
      showError: false,
    })
    await dispatch(handleUserLogin(username, password, remember))
    .then(async (res) => {
      if (res === true) {
        this.props.history.push(prevLocation)
      }
      else {
        this.setState({
          error: res.message,
          showError: true,
        })
      }
    })
    /*if ( await dispatch(handleUserLogin({username,password,})) ){
      this.props.history.push(prevLocation)
    }
    else {
      this.setState({showError:true})
    }*/

  }

  handleShowError = () => {
    this.setState({showError:false})
  }


  checkAutoFormComplete = async() => {
    const {username, password, formComplete} = this.state
    if (username !== '' && password !== '' && formComplete !== true) {
      await this.setState({
        formComplete : true
      })
    }
  }

  checkUserLoggedin = async() => {
    const { dispatch } = this.props
    const { prevLocation } = this.state
    if (getToken()) {
      await dispatch(handleInitialData())
      return this.props.history.push(prevLocation)
    }
    await this.setState({
      loading: false
    })
  }

  componentDidUpdate(){
    this.checkAutoFormComplete()
  }
  componentDidMount(){
    console.log('mounted');
    this.checkUserLoggedin()
  }

  render(){
    const { formComplete, username, password, showError, error, loading } = this.state
    if (loading) {
      return (
        <Segment style = {{width:'100%'}}>
          <Dimmer active style = {{width:'100%'}}>
            <Loader indeterminate  style = {{width:'100%'}}>Preparing Data</Loader>
          </Dimmer>
          <Image src='/shopn.jpg' style = {{width:'100%'}}/>
        </Segment>
      )
    }
    return (
      <Grid container textAlign='center' style={{ height: '100vh', width:'100vw', padding: 0,margin: 0}} verticalAlign='middle' columns={3} divided>

        <Grid.Row stretched style={{ height: '100vh',width: '100vw', opacity: 1 }}>
          <Grid.Column  width={4} style={{ height: '80vh'}}>
          </Grid.Column>
          <Grid.Column width={8}style={{ height: '80vh' }}>
            <Header as='h2' color='black' textAlign='center'>
              <Image src='/logo.png' /> Log-in to your account
            </Header>
            <Message
              negative
              hidden = {!showError}
              icon='ban'
              header='Login Failed'
              content={error}
            />
            <Form size='large'>
              <Segment stacked>
                <Form.Input
                  fluid icon='user'
                  iconPosition='left'
                  placeholder='Username'
                  name = 'username'
                  focus
                  value = {username}
                  onChange = {this.handleFormData}
                />
                <Form.Input
                  fluid
                  icon='lock'
                  name = 'password'
                  iconPosition='left'
                  placeholder='Password'
                  type='password'
                  value = {password}
                  onChange = {this.handleFormData}
                />
              <Button disabled = {!formComplete} color='teal' fluid size='large' onClick={this.handleFormSubmit}>
                  Login
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
          <Grid.Column  width={4} style={{ height: '80vh' }}></Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}


export default withRouter(connect()(Login))
