import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { handleSaveNewUser } from '../actions/users'

class SignUp extends React.Component {


  state = {
    id : '',
    name : '',
    password : '',
    passwordConfirm : '',
    formComplete : false,
    showError : false,
    passwordError : false
  }

  handleFormData = async (e) => {
    e.preventDefault()
    const value = e.target.value
    const inputName = e.target.name
    if (inputName === 'id') {
      await this.setState({
        id : value,
      })
    }
    else if (inputName === 'password') {
      await this.setState({
        password : value,
      })
    }
    else if (inputName === 'name') {
      await this.setState({
        name : value,
      })
    }
    else if (inputName === 'passwordConfirm') {
      await this.setState({
        passwordConfirm : value,
      })
    }

    const {id, name, password, passwordConfirm} = this.state
    if (id !== '' && name !== '' && password !== '' & passwordConfirm !== '') {
      if ( password === passwordConfirm ) {
        await this.setState({
          formComplete : true,
          passwordError : false,
          showError : false,
        })
      }
      else {
        await this.setState({
          formComplete : false,
          passwordError : true,
          showError : true
        })
      }
    }
    else {
      await this.setState({
        formComplete : false,
        passwordError : false,
        showError : false,
      })
    }

  }

  handleFormSubmit = async(e) => {
    e.preventDefault()
    const { dispatch } = this.props
    const userId = this.state.id
    const userPassword = this.state.password
    const name = this.state.name
    this.setState({
      formComplete : false
    })
    if ( await dispatch( handleSaveNewUser( userId, userPassword, name ) ) ){
      this.props.history.push(`/`)
    }
    else {
      this.setState({showError:true})
    }

  }

  handleShowError = () => {
    this.setState({showError:false})
  }

  render(){
    const { formComplete, id, name, password, showError, passwordError, passwordConfirm } = this.state
    const { error } = this.props
    return (
      <div className = "ui main text container segment">
        <div className="ui middle aligned center aligned grid">
          <div className="medium column">
            <h2 className="ui teal image header">
              <i className="icons">
                <i className="user icon"></i>
                <i className="bottom right corner add icon"></i>
              </i>
              <div className="content">
                 &nbsp;Sign Up to a new account!
              </div>
            </h2>
            <form className="ui small form">
              <div className="ui stacked segment">
                <div className="field">
                  <div className="ui left icon input">
                    <i className="user icon"></i>
                      <input
                      type="text"
                      name="id"
                      placeholder="Id"
                      value = {id}
                      onChange = {this.handleFormData}
                      />
                  </div>
                </div>
                <div className="field">
                  <div className="ui left icon input">
                    <i className="user icon"></i>
                      <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value = {name}
                      onChange = {this.handleFormData}
                      />
                  </div>
                </div>
                <div className="field">
                  <div className="ui left icon input">
                    <i className="lock icon"></i>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value = {password}
                      onChange = {this.handleFormData}
                      required
                      />
                  </div>
                </div>
                <div className="field">
                  <div className="ui left icon input">
                    <i className="lock icon"></i>
                      <input
                      type="password"
                      name="passwordConfirm"
                      placeholder="Confirm Password"
                      value = {passwordConfirm}
                      onChange = {this.handleFormData}
                      required
                      />
                  </div>
                </div>
                <div className= {
                    formComplete
                    ? "ui fluid large teal submit button"
                    : "ui fluid large teal submit disabled button"
                  }
                  onClick = {this.handleFormSubmit}
                  >Sign up and login
                </div>
              </div>


            </form>
            <div className={(showError)? "ui error message" : "ui error message hidden"}>
              <i className="close icon" onClick = {this.handleShowError}></i>
              <div className="header">
                Sorry there was errors!
              </div>
              <ul className="list">
                { error ? <li>{error}</li> : null }
                { passwordError ? <li>Password dosen't match</li> : null }
              </ul>
            </div>

            <div className="ui message">
              Already a user?
              <Link to = '/Log-in' >
                Log-in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({errors}) => {
  return {
    error : errors.signup_error? errors.signup_error : null,
  };
}

export default withRouter(connect(mapStateToProps)(SignUp))
