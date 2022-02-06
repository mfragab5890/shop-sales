import React, { Component } from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Segment, Menu } from 'semantic-ui-react'
import NewOrder from './NewOrder'
import UserSales from './UserSales'
import Error from './Error'
import { connect } from 'react-redux'

class Sales extends Component {
  state = { activeItem: 'New Order' }

  handleItemClick = async (e, { name }) => {
    await this.setState({ activeItem: name })
    if (name === 'New Order') {
      return this.props.history.push('/sales/new')
    }
    if (name === 'My Sales') {
      return this.props.history.push('/sales/mysales')
    }

  }

  componentDidMount(){
    const location = this.props.history.location.pathname
    if (location.includes('new')) {
      this.setState({ activeItem: 'New Order' })
    }
    if (location.includes('mysales')) {
      this.setState({ activeItem: 'My Sales' })
    }

  }

  componentDidUpdate(){
    const location = this.props.history.location.pathname
    if (location.includes('new')) {
      const { activeItem } = this.state
      if (activeItem !== 'New Order') {
        return this.setState({ activeItem: 'New Order' })
      }

    }
    if (location.includes('mysales')) {
      const { activeItem } = this.state
      if (activeItem !== 'My Sales') {
        return this.setState({ activeItem: 'My Sales' })
      }
    }

  }

  render() {
    const { activeItem } = this.state
    const { theme, lang, permissions } = this.props
    const myScript = {
      AR: {
        firstTab: 'فاتورة جديدة',
        secondTab: 'مبيعاتي',
      },
      EN:{
        firstTab: 'New Order',
        secondTab: 'My Sales',
      }
    }
    return (
      <Segment>

        <Menu inverted = {theme === 'black'? true : false} color={theme !== 'basic' ? theme : null} attached='top' pointing>
          {
            permissions.includes('CREATE_ORDER') && permissions.includes('SEARCH_PRODUCTS_BY_ID') && permissions.includes('SEARCH_PRODUCTS_BY_TERM')
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
            permissions.includes('GET_USER_TODAY_SALES')
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
            <Route exact path='/sales'>
              <Redirect to = '/sales/new' />
            </Route>
            <Route exact path='/sales/new'>
              {
                permissions.includes('CREATE_ORDER') && permissions.includes('SEARCH_PRODUCTS_BY_ID') && permissions.includes('SEARCH_PRODUCTS_BY_TERM')
                ?<NewOrder theme = {theme} lang = {lang}/>
                :<Error message = "Sorry You Have No Authorization To View This Page" />
              }
            </Route>
            <Route exact path='/sales/mysales'>
              {
                permissions.includes('GET_USER_TODAY_SALES')
                ?<UserSales theme = {theme} lang = {lang}/>
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

export default withRouter(connect(mapStateToProps)(Sales))
