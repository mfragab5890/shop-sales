import React, { Component, Fragment } from 'react'
import { getHomeData, getAllProducts } from '../utils/api'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'
import AppHeader from './AppHeader'
import AppBody from './AppBody'
import AppFooter from './AppFooter'
import LoadingBar from 'react-redux-loading'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter, Switch } from 'react-router-dom'
import { getToken } from '../utils/token'

class Main extends Component {
  state = {
    homeData: {},
    products: [],
    pages:0,
    theme: 'black',
    lang: 'AR',
  }

  handleThemeChange = (theme) => {
    const colors = [
      'basic',
      'black',
      'red',
      'blue',
      'purple',
      'orange',
      'yellow',
      'pink',
      'green',
      'teal',
      ]
    if (colors.includes(theme)) {
      this.setState({
        theme: theme
      })
    }
  }
  handleLangChange = (lang) => {
    const langs = [ 'AR', 'EN' ]
    if (langs.includes(lang)) {
      this.setState({
        lang: lang
      })
    }

  }
  componentDidMount = async () => {
    let homeData = null
    getHomeData()
    .then(data => {
      homeData = data
      console.log(homeData);
      return this.setState({
        homeData: homeData,
        authedUser: getToken(),
      });
    })
    .catch(err => {console.log(err);})
    const products_obj  = await getAllProducts()
    const products = products_obj.products
    const pages = products_obj.pages
    await this.setState({
      products: products,
      pages: pages
    })
  }

  render(){
    const { homeData, theme, lang, products, pages } = this.state
    return (
      <Container fluid>
        <LoadingBar />
        <AppHeader
          data = {homeData}
          theme = {theme}
          lang = {lang}
          onLangChange = {this.handleLangChange}
          onThemeChange = {this.handleThemeChange}
          />
        <AppBody
          theme = {theme}
          lang = {lang}
          products = { products }
          pages = {pages}
          />
        <AppFooter
          theme = {theme}
          lang = {lang}
          />
      </Container>
    );
  }
}

export default withRouter(connect()(Main))
