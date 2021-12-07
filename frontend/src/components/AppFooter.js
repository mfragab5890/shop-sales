import React from 'react'
import { Header, Image, Segment } from 'semantic-ui-react'

const AppHeader = () => (
  <Segment centered inverted color = "#264143" size = "mini">
    <Header as='h2' >
      <Image avatar size = 'mini' src='/logo.png' centered /> Fiori
    </Header>
  </Segment>
)

export default AppHeader
