import React, { Component } from 'react'
import { withRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Segment, Menu } from 'semantic-ui-react'
import NewProduct from './NewProduct'
import AllProducts from './AllProducts'
import Error from './Error'
import { connect } from 'react-redux'

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

  componentDidUpdate(){
    const location = this.props.history.location.pathname
    if (location.includes('new')) {
      const { activeItem } = this.state
      if (activeItem !== 'New Product') {
        return this.setState({ activeItem: 'New Product' })
      }
    }
    if (location.includes('all')) {
      const { activeItem } = this.state
      if (activeItem !== 'All Products') {
        return this.setState({ activeItem: 'All Products' })
      }
    }

  }

  render() {
    const { activeItem } = this.state
    const { theme, lang, permissions } = this.props
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
          {
            permissions.includes('CREATE_NEW_PRODUCT')
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
            permissions.includes('GET_ALL_PRODUCTS') && permissions.includes('SEARCH_PRODUCTS_BY_TERM')
            ?
            <Menu.Item
              name= {myScript.EN.secondTab}
              active={activeItem === myScript.EN.secondTab}
              onClick={this.handleItemClick}
            >
              {myScript[lang].secondTab}
            </Menu.Item>
            :null
          }


        </Menu>
        <Segment color={theme}>
          <Switch>
            <Route exact path='/products'>
              <Redirect to = '/products/new' />
            </Route>
            <Route exact path='/products/new'>
              {
                permissions.includes('CREATE_NEW_PRODUCT')
                ?<NewProduct theme = {theme} lang = {lang}/>
                :<Error message = "Sorry You Have No Authorization To View This Page" />
              }
            </Route>
            <Route exact path='/products/all'>
              {
                permissions.includes('GET_ALL_PRODUCTS') && permissions.includes('SEARCH_PRODUCTS_BY_TERM')
                ?<AllProducts theme = {theme} lang = {lang} />
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

export default withRouter(connect(mapStateToProps)(Products))
