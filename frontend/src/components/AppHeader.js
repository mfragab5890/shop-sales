import React from 'react'
import { Header, Image, Segment, Grid, Button, Dropdown, Input } from 'semantic-ui-react'

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
const AppHeader = () => (
  <segment>
    <Grid centered columns = {3} textAlign='center' verticalAlign='middle'>
      <Grid.Row centered stretched color='black'>
        <Grid.Column width={3} >
          <Image circular size = 'mini' src='/logo.png' centred />
        </Grid.Column>
        <Grid.Column width={9}>
          <Header as='h1' inverted color='grey' textAlign='center' >
            Fiori Store
          </Header>
        </Grid.Column>
        <Grid.Column width={4}>
          <Header as='h4' inverted color='grey' floated = 'right' textAlign='center' >
            <Dropdown  multiple icon='settings'>
              <Dropdown.Menu>
                <Dropdown.Divider />
                <Dropdown.Header icon='theme' content='Theme' />
                <Dropdown.Menu scrolling style = {{height:180}}>
                  {themeOptions.map((option) => (
                    <Dropdown.Item key={option.value} {...option} />
                  ))}
                </Dropdown.Menu>
                <Dropdown.Divider />
                <Dropdown.Header icon='settings' content='Lang' />
                <Dropdown.Menu scrolling>
                  {langOptions.map((option) => (
                    <Dropdown.Item key={option.value} {...option} />
                  ))}
                </Dropdown.Menu>
              </Dropdown.Menu>
            </Dropdown>
            Logged in as Mostafa fouad
          </Header>

        </Grid.Column>
    </Grid.Row>
  </Grid>
  </segment>

)

export default AppHeader
