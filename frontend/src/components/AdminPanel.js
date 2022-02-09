import React, { Component } from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Segment, Menu } from 'semantic-ui-react'
import Error from './Error'
import { connect } from 'react-redux'
import AllUsers from './AllUsers'
import NewUser from './NewUser'

class AdminPanel extends Component {
  state = { activeItem: 'Users' }

  handleItemClick = async (e, { name }) => {
    await this.setState({ activeItem: name })
    if (name === 'Users') {
      return this.props.history.push('/admin/users')
    }
    if (name === 'New User') {
      return this.props.history.push('/admin/user/new')
    }

  }

  componentDidMount(){
    const location = this.props.history.location.pathname
    if (location.includes('users')) {
      this.setState({ activeItem: 'Users' })
    }
    if (location.includes('new')) {
      this.setState({ activeItem: 'New User' })
    }

  }

  componentDidUpdate(){
    const location = this.props.history.location.pathname
    const { activeItem } = this.state
    if (location.includes('users')) {
      if (activeItem !== 'Users') {
        return this.setState({ activeItem: 'Users' })
      }

    }
    if (location.includes('new')) {
      if (activeItem !== 'New User') {
        return this.setState({ activeItem: 'New User' })
      }
    }

  }

  render() {
    const { activeItem } = this.state
    const { theme, lang, permissions } = this.props
    const myScript = {
      AR: {
        firstTab: 'جميع المستخدمين',
        secondTab: 'مستخدم جديد',
      },
      EN:{
        firstTab: 'Users',
        secondTab: 'New User',
      }
    }
    return (
      <Segment>

        <Menu inverted = {theme === 'black'? true : false} color={theme !== 'basic' ? theme : null} attached='top' pointing>
          {
            permissions.includes('GET_ALL_USERS') && permissions.includes('DELETE_USER') && permissions.includes('EDIT_USER')
            ?
            <Menu.Item
              name= {myScript.EN.firstTab}
              active={activeItem === myScript.EN.firstTab}
              onClick={this.handleItemClick}
            >
              {myScript[lang].firstTab}
            </Menu.Item>
            :null
          }
          {
            permissions.includes('CREATE_NEW_USER')
            ?
            <Menu.Item
              name= {myScript.EN.secondTab}
              active={activeItem === myScript.EN.secondTab}
              onClick={this.handleItemClick}
            >
              {myScript[lang].secondTab}
            </Menu.Item>
            : null
          }
        </Menu>

        <Segment color={theme !== 'basic' ? theme : null}>
          <Switch>
            <Route exact path='/admin'>
              <Redirect to = '/admin/users' />
            </Route>
            <Route exact path='/admin/users'>
              {
                permissions.includes('GET_ALL_USERS') && permissions.includes('DELETE_USER')
                ?<AllUsers theme = {theme} lang = {lang}/>
                :<Error message = "Sorry You Have No Authorization To View This Page" />
              }
            </Route>
            <Route exact path='/admin/user/new'>
              {
                permissions.includes('CREATE_NEW_USER')
                ?<NewUser theme = {theme} lang = {lang}/>
                :<Error message = "Sorry You Have No Authorization To View This Page" />
              }
            </Route>
            <Route path="*">
              <Error message = {'No Such page Please Go Back Or Navigate Using Menus'}/>
            </Route>
          </Switch>
        </Segment>

      </Segment>
    )
  }
}

const mapStateToProps = ({authedUser}) => {
  const permissions = authedUser.permissions.map((permission) => permission.name)
  return {
    permissions: authedUser? permissions:[],
  };
}

export default withRouter(connect(mapStateToProps)(AdminPanel))
