import React, { Component } from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import Error from './Error'
import { Segment, Menu } from 'semantic-ui-react'
import SalesToday from './SalesToday'
import SalesMonth from './SalesMonth'

class Financial extends Component {
  state = { activeItem: 'Today Sales' }

  handleItemClick = async (e, { name }) => {
    await this.setState({ activeItem: name })
    if (name === 'Today Sales') {
      return this.props.history.push('/financial/today')
    }
    if (name === 'Month Sales') {
      return this.props.history.push('/financial/month')
    }

  }

  componentDidMount(){
    const location = this.props.history.location.pathname
    if (location.includes('today')) {
      this.setState({ activeItem: 'Today Sales' })
    }
    if (location.includes('month')) {
      this.setState({ activeItem: 'Month Sales' })
    }

  }

  render() {
    const { activeItem } = this.state
    const { theme, lang } = this.props
    const myScript = {
      AR: {
        firstTab: 'مبيعات اليوم',
        secondTab: 'مبيعات الشهر',
      },
      EN:{
        firstTab: 'Today Sales',
        secondTab: 'Month Sales',
      }
    }
    return (
      <Segment>

        <Menu inverted = {theme === 'black'? true : false} color={theme} attached='top' pointing>
          <Menu.Item
            name= {myScript.EN.firstTab}
            active= {activeItem === myScript.EN.firstTab}
            onClick={this.handleItemClick}
          >
            {myScript[lang].firstTab}
          </Menu.Item>
          <Menu.Item
            name= {myScript.EN.secondTab}
            active= {activeItem === myScript.EN.secondTab}
            onClick={this.handleItemClick}
          >
            {myScript[lang].secondTab}
          </Menu.Item>
        </Menu>

        <Segment color={theme}>
          <Switch>
            <Route exact path='/financial'>
              <Redirect to = '/financial/today' />
            </Route>
            <Route exact path='/financial/today'>
              <SalesToday theme = {theme} lang = {lang}/>
            </Route>
            <Route exact path='/financial/month'>
              <SalesMonth theme = {theme} lang = {lang}/>
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

export default withRouter(Financial)
