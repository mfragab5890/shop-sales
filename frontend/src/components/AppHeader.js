import React from 'react'
import { Header, Image, Segment, Grid } from 'semantic-ui-react'

const AppHeader = () => (
    <Grid textAlign='center' padded>
      <Grid.Row color='black'>
        <Grid.Column width={3}>
          <Image circular size = 'mini' src='/logo.png' centred/>
        </Grid.Column>
        <Grid.Column width={9}>
          <Header as='h2' inverted color='grey' textAlign='center' style = {{padding:4}}>
            Fiori Store
          </Header>
        </Grid.Column>
        <Grid.Column width={4}>
          <Header as='h4' inverted color='grey' floated = 'right' textAlign='center' style = {{padding:1}}>
            Logged in as Mostafa fouad
          </Header>
        </Grid.Column>
    </Grid.Row>
  </Grid>
)

export default AppHeader
