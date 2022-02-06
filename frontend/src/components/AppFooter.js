import React from 'react'
import { Header, Image, Grid } from 'semantic-ui-react'

const AppFooter = (props) => {
  const { theme } = props
  return (
    <div>
      <Grid centered columns = {3} textAlign='center' verticalAlign='middle'>
        <Grid.Row centered stretched color={theme !== 'basic' ? theme : null}>
          <Grid.Column width={3} >
            <Image circular size = 'mini' src='/logo.png' centered />
          </Grid.Column>
          <Grid.Column width={9}>
            <Header as='h1' inverted = {theme === 'black'? true : false} color={theme !== 'basic'? 'grey' : 'black'} textAlign='center' >
              Fiori Store
            </Header>
          </Grid.Column>
          <Grid.Column width={4}>
            <Header as='h3' inverted = {theme === 'black'? true : false} color={'grey'} floated = 'right' textAlign='center' >
              Powerd by MFT
            </Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default AppFooter
