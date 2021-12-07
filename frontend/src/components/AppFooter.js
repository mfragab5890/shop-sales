import React from 'react'
import { Header, Image, Segment, Grid } from 'semantic-ui-react'

const AppFooter = () => (
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

            Powerd by MFT
          </Header>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </segment>
)

export default AppFooter
