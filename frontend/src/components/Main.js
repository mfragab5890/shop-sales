import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Container, Segment, Dimmer, Loader, Image } from 'semantic-ui-react'
import AppHeader from './AppHeader'
import AppBody from './AppBody'
import AppFooter from './AppFooter'
import LoadingBar from 'react-redux-loading'
import { connect } from 'react-redux'
import { withRouter} from 'react-router-dom'

class Main extends Component {
  state = {
    theme: 'black',
    lang: 'AR',
    prevLocation: '',
    loading: false,
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
  
  render(){
    const { theme, lang } = this.state
    const { loading } = this.props
    if (loading) {
      return (
        <Segment style = {{width:'100%'}}>
          <Dimmer active style = {{width:'100%'}}>
            <Loader indeterminate  style = {{width:'100%'}}>Checking User Authorization</Loader>
          </Dimmer>
          <Image src='/shopn.jpg' style = {{width:'100%'}}/>
        </Segment>
      )
    }
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

const mapStateToProps = ({loadingBar}) => {
  return {
    loading: loadingBar.default === 1? true : false
  };
}

export default withRouter(connect(mapStateToProps)(Main))
