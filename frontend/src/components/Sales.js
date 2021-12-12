import React, { Component } from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Segment, Menu } from 'semantic-ui-react'
import NewOrder from './NewOrder'
import UserSales from './UserSales'
import Error from './Error'

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

  render() {
    const { activeItem } = this.state
    const { theme, lang } = this.props
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

        <Menu inverted = {theme === 'black'? true : false} color={theme} attached='top' pointing>
          <Menu.Item
            name= {myScript.EN.firstTab}
            active={activeItem === myScript.EN.firstTab}
            onClick={this.handleItemClick}
          >
            {myScript[lang].firstTab}
          </Menu.Item>
          <Menu.Item
            name= {myScript.EN.secondTab}
            active={activeItem === myScript.EN.secondTab}
            onClick={this.handleItemClick}
          >
            {myScript[lang].secondTab}
          </Menu.Item>
        </Menu>

        <Segment color={theme}>
          <Switch>
            <Route exact path='/sales'>
              <Redirect to = '/sales/new' />
            </Route>
            <Route exact path='/sales/new'>
              <NewOrder theme = {theme} lang = {lang}/>
            </Route>
            <Route exact path='/sales/mysales'>
              <UserSales theme = {theme} lang = {lang}/>
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

export default withRouter(Sales)
