import React from 'react'
import { Header, Image, Grid, Dropdown } from 'semantic-ui-react'
import { removeToken } from '../utils/token'
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


export default class AppHeader extends React.Component {

  handleThemeChange = (e, { value }) => {
    const { onThemeChange } = this.props
    onThemeChange(value)
  }

  handleLangChange = (e, { value }) => {
    const { onLangChange } = this.props
    onLangChange(value)
  }

  render(){
    const { theme, lang } = this.props
    return (
      <div>
        <Grid centered columns = {3} textAlign='center' verticalAlign='middle' inverted>
          <Grid.Row centered stretched color={theme}>
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
                <span onClick = {(e) => {
                    console.log(e);
                    removeToken()}}>{lang === 'EN' ? 'Logged in as': 'المستخدم' } Mostafa fouad</span>
              </Header>

            </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
    );
  }

}
