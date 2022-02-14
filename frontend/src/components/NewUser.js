import React, { Component } from 'react'
import { Segment, Form, Header, Image, Message, Dimmer, Loader, Icon, Button } from 'semantic-ui-react'
import { handleAddUser } from '../actions/users'
import { connect } from 'react-redux'

class NewUser extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    formComplete: false,
    passwordView: false,
    passwordMatch: false,
    message: '',
    error: '',
    myScript: {
      EN: {
        username: 'Username',
        email: 'Email',
        password: 'Password Edit',
        confirmPassword: 'Confirm Password'

      },
      AR: {
        username: 'اسم المستخدم',
        email: 'الإميل',
        password: 'كلمة السر',
        confirmPassword: 'تأكيد كلمة السر'
      },
    },
  }

  handleFormData = async (e) => {
    e.preventDefault()
    const { name, value } = e.target
    if (name === 'username') {
      await this.setState({
        username : value,
      })
    }
    if (name === 'email') {
      await this.setState({
        email : value,
      })
    }
    else if (name === 'password') {
      await this.setState({
        password : value
      })
    }
    else if (name === 'confirmPassword') {
      await this.setState({
        confirmPassword : value
      })
    }
    const {username, password, email, confirmPassword} = this.state
    if (username !== '' && email !== '' && password !== '' && confirmPassword !== '') {
      await this.setState({
        formComplete : true
      })
    }
    else {
      await this.setState({
        formComplete : false
      })
    }
    if (password === confirmPassword && password !== '') {
      await this.setState({
        passwordMatch : true
      })
    }
    else {
      await this.setState({
        passwordMatch : false,
      })
    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
    const {
      username,
      email,
      password,
      confirmPassword,
    } = this.state
    const { lang, dispatch } = this.props
    let message = ''
    if (username === '') {
      message = lang === 'EN' ? 'Username Can Not Be Empty' : 'يجب ادخال اسم المستخدم'
      return this.setState({
        error: message
      });
    }
    if (email === '') {
      message = lang === 'EN' ? 'Email Can Not Be Empty' : 'يجب ادخال الإميل'
      return this.setState({
        error: message
      });
    }
    if (!email.includes("@")) {
      message = lang === 'EN' ? 'Email Must Be Valid' : 'يجب إدخال الإميل الصحيح'
      return this.setState({
        error: message
      });
    }
    if (password !== '' && confirmPassword !== '' && password !== confirmPassword) {
      message = lang === 'EN' ? 'Password & Confirmation Do Not Match' : 'كلمة السر الجديدة لا تطابق التاكيد لكلمة السر'
      return this.setState({
        error: message
      });
    }
    if (password === '' || confirmPassword === '') {
      message = lang === 'EN' ? 'You Must Enter Password And Confirm Password' : 'يجب إدخال كلمة السر و تاكبد كلمة السر'
      return this.setState({
        error: message
      });
    }

    const newUser = {
      username,
      email,
      password,
    }
    dispatch(handleAddUser(newUser)).then(res => {
      if (res.success) {
        return this.setState({
          message: res.message,
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          formComplete: false,
          passwordView: false,
          passwordMatch: false,
          error: ''
        });
      }
      else {
        return this.setState({
          error: res.message,
          message: ''
        });
      }
    })
  }

  togglePasswordView = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        passwordView : !prevState.passwordView,
      };
    })
  }

  componentDidMount=async () => {

  }

  render() {
    const { theme, lang, loadingBar } = this.props
    const {
      username,
      email,
      password,
      confirmPassword,
      passwordView,
      passwordMatch,
      formComplete,
      message,
      error,
      myScript
    } = this.state

    if (loadingBar) {
      return (
        <Segment style = {{width:'100%', height:'100%'}}>
          <Dimmer active style = {{width:'100%'}}>
            <Loader indeterminate  style = {{width:'100%'}}>Checking User Authorization</Loader>
          </Dimmer>
          <Image src='/shopn.jpg' style = {{width:'100%'}}/>
        </Segment>
      )
    }
    return (
      <Segment>
        <Header as='h1' color={theme} textAlign='center' >
          {lang === 'EN'? 'Add New User' : 'إضافة مستخدم جديد'}
        </Header>
        {
          message !== ''
          ?<Message positive>
            <Message.Header>User Added</Message.Header>
            <p>
              {message}
            </p>
          </Message>
          :null
        }
        {
          error !== ''
          ?<Message negative>
            <Message.Header>An Error Occured!</Message.Header>
            <p>
              {error}
            </p>
          </Message>
          :null
        }

        <Form size='large'>
          <Segment stacked>
            <Form.Input
              label = {myScript[lang].username}
              fluid icon='user'
              iconPosition='left'
              placeholder='Username'
              name = 'username'
              focus
              type = 'text'
              value = {username}
              onChange = {this.handleFormData}
            />
            <Form.Input
              label = {myScript[lang].email}
              fluid icon='mail outline'
              iconPosition='left'
              placeholder='Email'
              name = 'email'
              type = 'email'
              value = {email}
              onChange = {this.handleFormData}
            />
            <Form.Input
              label = {myScript[lang].password}
              fluid
              icon='lock'
              name = 'password'
              iconPosition='left'
              placeholder='Password'
              type= {passwordView ? 'text' : 'password'}
              value = {password}
              onChange = {this.handleFormData}
              action={{
                color: passwordView ? 'grey' : 'black',
                icon: passwordView ? 'eye slash outline' : 'eye',
                onClick:this.togglePasswordView
              }}
            />
            <Form.Input
              label = {myScript[lang].confirmPassword}
              fluid
              icon='lock'
              name = 'confirmPassword'
              iconPosition='left'
              placeholder='Password Confirmation'
              type= {passwordView ? 'text' : 'password'}
              value = {confirmPassword}
              onChange = {this.handleFormData}
              action={{
                color: passwordView ? 'grey' : 'black',
                icon: passwordView ? 'eye slash outline' : 'eye',
                onClick:this.togglePasswordView
              }}
            />
            {
              passwordMatch
              ?<Icon name ='thumbs up outline' color = 'green'/>
              : password !== '' && confirmPassword !== ''
              && <Icon name ='x' color = 'red'/>
            }
            <Button disabled = {!formComplete || !passwordMatch} color='teal' fluid size='large' onClick={this.handleFormSubmit}>
              {lang === 'EN'? 'Add User' : 'إضافة المستخدم'}
            </Button>
          </Segment>
        </Form>

      </Segment>
    )
  }
}

const mapStateToProps = ({loadingBar}) => {
  return {
    loadingBar: loadingBar.default === 1? true : false,
  };
}

export default connect(mapStateToProps)(NewUser)
