import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'
import AppHeader from './AppHeader'
import AppBody from './AppBody'
import AppFooter from './AppFooter'
import LoadingBar from 'react-redux-loading'
import { connect } from 'react-redux'
import { withRouter} from 'react-router-dom'
import { handleInitialData } from '../actions/shared'
import { getToken } from '../utils/token'

class Main extends Component {
  state = {
    theme: 'black',
    lang: 'AR',
    prevLocation: '',
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
    const { prevLocation } = this.state
    const { pathname } = this.props.location
    const { dispatch, productsLength } = this.props
    if ( prevLocation !== pathname ) {
      await this.setState({
        prevLocation : pathname
      })
    }
    if (productsLength === 0) {
      if (getToken()) {
        await dispatch(handleInitialData())
        this.props.history.push(prevLocation)
      }
    }
  }

  render(){
    const { theme, lang } = this.state
    return (
      <Container fluid>
        <LoadingBar />
        <AppHeader
          theme = {theme}
          lang = {lang}
          onLangChange = {this.handleLangChange}
          onThemeChange = {this.handleThemeChange}
          />
        <AppBody
          theme = {theme}
          lang = {lang}
          />
        <AppFooter
          theme = {theme}
          lang = {lang}
          />
      </Container>
    );
  }
}

const mapStateToProps = ({products}) => {
  console.log(products);
  return {
    productsLength: products.products.length
  };
}

export default withRouter(connect(mapStateToProps)(Main))
