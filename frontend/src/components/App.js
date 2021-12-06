import React from 'react'
import { getHomeData } from '../utils/api'
import 'semantic-ui-css/semantic.min.css'
import { Container } from 'semantic-ui-react'
import AppHeader from './AppHeader'
import AppBody from './AppBody'
import AppFooter from './AppFooter'

class App extends React.Component {
  state = {
    homeData: {}
  }
  componentDidMount(){
    let homeData = null
    getHomeData()
    .then(data => {
      console.log(data);
      homeData = data
      return this.setState({
        homeData: homeData
      });
    })
    .catch(err => {console.log(err);})
    console.log(homeData)
  }
  render(){
    const { homeData } = this.state
    console.log( 'this is state', homeData);
    return (
      <Container fluid>
        <AppHeader data = {homeData}/>
        <AppBody />
        <AppFooter />
      </Container>
    );
  }

}

export default App;
