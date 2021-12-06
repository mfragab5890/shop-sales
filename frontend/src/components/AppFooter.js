import React from 'react'
import { Header, Image, Segment } from 'semantic-ui-react'

const AppHeader = () => (
  <Segment inverted color = "#264143" size = "mini">
    <Header as='h2' >
      <Image avatar size = 'big' src='/logo.png' /> Fiori
    </Header>
  </Segment>
)

export default AppHeader
