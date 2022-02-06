import React from 'react'
import { Header, Image, Grid, Dropdown } from 'semantic-ui-react'
import { handleUserLogout } from '../actions/authedUser'
import { connect } from 'react-redux'

const themeOptions = [
  {
    key: 'basic',
    text: 'basic',
    value: 'basic',
    label: { empty: true, circular: true },
  },
  {
    key: 'black',
    text: 'black',
    value: 'black',
    label: { color: 'black', empty: true, circular: true },
  },
  {
    key: 'red',
    text: 'red',
    value: 'red',
    label: { color: 'red', empty: true, circular: true },
  },
  {
    key: 'blue',
    text: 'blue',
    value: 'blue',
    label: { color: 'blue', empty: true, circular: true },
  },
  {
    key: 'purple',
    text: 'purple',
    value: 'purple',
    label: { color: 'purple', empty: true, circular: true },
  },
  {
    key: 'orange',
    text: 'orange',
    value: 'orange',
    label: { color: 'orange', empty: true, circular: true },
  },
  {
    key: 'yellow',
    text: 'yellow',
    value: 'yellow',
    label: { color: 'yellow', empty: true, circular: true },
  },
  {
    key: 'pink',
    text: 'pink',
    value: 'pink',
    label: { color: 'pink', empty: true, circular: true },
  },
  {
    key: 'green',
    text: 'green',
    value: 'green',
    label: { color: 'green', empty: true, circular: true },
  },
  {
    key: 'teal',
    text: 'teal',
    value: 'teal',
    label: { color: 'teal', empty: true, circular: true },
  },
]

const langOptions = [
  {
    key: 'AR',
    text: 'AR',
    value: 'AR',
  },
  {
    key: 'EN',
    text: 'EN',
    value: 'EN',
  },
]

class AppHeader extends React.Component {

  handleThemeChange = (e, { value }) => {
    const { onThemeChange } = this.props
    onThemeChange(value)
  }

  handleLangChange = (e, { value }) => {
    const { onLangChange } = this.props
    onLangChange(value)
  }

  logout = () => {
    const { dispatch } = this.props
    dispatch(handleUserLogout())
  }

  render(){
    const { theme, lang, username } = this.props
    return (
      <div>
        <Grid centered columns = {3} textAlign='center' verticalAlign='middle' inverted>
          <Grid.Row centered stretched color={theme !== 'basic' ? theme : null}>
            <Grid.Column width={3} >
              <Image circular size = 'mini' src='/logo.png' centered />
            </Grid.Column>
            <Grid.Column width={9}>
              <Header as='h1' inverted = {theme === 'black'? true : false} color={theme !== 'basic'? null : 'black'} textAlign='center' >
                Fiori Store
              </Header>
            </Grid.Column>
            <Grid.Column width={4}>
              <Header as='h4' inverted = {theme === 'black'? true : false} color={theme !== 'basic'? null : 'black'} floated = 'right' textAlign='center' >
                <Dropdown  multiple icon='settings'>
                  <Dropdown.Menu>
                    <Dropdown.Divider />
                    <Dropdown.Header icon='theme' content='Theme' />
                    <Dropdown.Menu scrolling style = {{height:180, overflowX: 'auto'}}>
                      {themeOptions.map((option) => (
                        <Dropdown.Item key={option.value} {...option} onClick = {this.handleThemeChange}/>
                      ))}
                    </Dropdown.Menu>
                    <Dropdown.Divider />
                    <Dropdown.Header icon='settings' content='Lang' />
                    <Dropdown.Menu scrolling>
                      {langOptions.map((option) => (
                        <Dropdown.Item key={option.value} {...option} onClick = {this.handleLangChange}/>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown  multiple icon='user'>
                  <Dropdown.Menu>
                    <Dropdown.Menu scrolling style = {{height:'100%', overflowX: 'auto', overflowY: 'auto'}}>
                      <Dropdown.Header content={lang === 'EN' ? `Logged In As: ${username}`: `المستخدم : ${username}` } />
                      {
                        lang === 'EN'
                        ? <Dropdown.Item key={'logout'} text={'Log Out'} onClick = {this.logout}/>
                      : <Dropdown.Item key={'logout'} text={'تسجيل الخروج'} onClick = {this.logout}/>
                      }
                    </Dropdown.Menu>
                  </Dropdown.Menu>
                </Dropdown>
              </Header>
            </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
    );
  }
}

const mapStateToProps = ({authedUser}) => {
  return {
    username:authedUser.username,
  };
}

export default connect(mapStateToProps)(AppHeader)
