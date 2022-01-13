import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { handleUserLogin } from '../actions/authedUser'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { login, getHomeData } from '../utils/api'
import { setToken, removeToken } from '../utils/token'

class Login extends React.Component {

  state = {
    username : '',
    password : '',
    formComplete : false,
    showError : false,
    error: '',
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
    const username = this.state.username
    const password = this.state.password
    const remember = true
    this.setState({
      formComplete : false
    })
    login(username, password, remember).then(res => {
      console.log(res);
      getHomeData().then(res => console.log(res))
      if (res.success === true) {
        this.setState({
          error: '',
          showError: false,
        })
        setToken(res.token)
        this.props.history.push(prevLocation)
      }
      else {
        this.setState({
          error: res.message,
          showError: true,
        })
        removeToken()
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
  componentDidUpdate(){
    this.checkAutoFormComplete()
  }

  render(){
    const { formComplete, username, password, showError, error } = this.state
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

const mapStateToProps = ({users, errors}, {prevLocation}) => {
  return {
    error : errors.login_error? errors.login_error : null,
    userIds : Object.keys(users),
    prevLocation
  };
}

export default withRouter(connect()(Login))
