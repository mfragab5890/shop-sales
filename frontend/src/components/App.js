import React from 'react'
import { getHomeData, getAllProducts } from '../utils/api'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'
import AppHeader from './AppHeader'
import AppBody from './AppBody'
import AppFooter from './AppFooter'

class App extends React.Component {
  state = {
    homeData: {},
    products: [],
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
      return this.setState({
        homeData: homeData
      });
    })
    .catch(err => {console.log(err);})
    const products_obj  = await getAllProducts()
    const products = products_obj.products
    await this.setState({
      products: products
    })
  }
  render(){
    const { homeData, theme, lang, products } = this.state
    return (
      <Container fluid>
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
          />
        <AppFooter
          theme = {theme}
          lang = {lang}
          />
      </Container>
    );
  }

}

export default App;
