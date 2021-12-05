import React from 'react'
import { getHomeData } from '../utils/api'
import './App.css';

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
      <div className="App">
        {homeData.message}
      </div>
    );
  }

}

export default App;
