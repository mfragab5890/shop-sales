import React, { Component } from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Segment, Menu } from 'semantic-ui-react'
import NewProduct from './NewProduct'
import AllProducts from './AllProducts'
import Error from './Error'

class Products extends Component {
  state = { activeItem: 'New Product' }

  handleItemClick = async (e, { name }) => {
    await this.setState({ activeItem: name })
    if (name === 'New Product') {
      return this.props.history.push('/products/new')
    }
    if (name === 'All Products') {
      return this.props.history.push('/products/all')
    }

  }

  componentDidMount(){
    const location = this.props.history.location.pathname
    if (location.includes('new')) {
      this.setState({ activeItem: 'New Product' })
    }
    if (location.includes('all')) {
      this.setState({ activeItem: 'All Products' })
    }

  }

  render() {
    const { activeItem } = this.state
    const { theme, lang } = this.props
    const myScript = {
      AR: {
        firstTab: 'منتج جديد',
        secondTab: 'جميع المنتجات',
      },
      EN:{
        firstTab: 'New Product',
        secondTab: 'All Products',
      }
    }
    return (
      <Segment>
        <Menu inverted = {theme === 'black'? true : false} color={theme !== 'basic' ? theme : null} attached='top' pointing>
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
            <Route exact path='/products'>
              <Redirect to = '/products/new' />
            </Route>
            <Route exact path='/products/new'>
              <NewProduct theme = {theme} lang = {lang}/>
            </Route>
            <Route exact path='/products/all'>
              <AllProducts theme = {theme} lang = {lang}/>
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

export default withRouter(Products)
