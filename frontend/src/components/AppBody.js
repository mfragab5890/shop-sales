import React, { Component } from 'react'
import { Grid, Segment, Menu } from 'semantic-ui-react'
import AppMenu from './AppMenu'
import Sales from './Sales'

export default class AppBody extends Component {
  state = { activeItem: 'bio' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    const { activeItem } = this.state
    return (
      <Grid columns={2}>
        <Grid.Column floated='left' stretched width={3} style = {{padding:'14px 0px 0px 0px',}}>
          <AppMenu />
        </Grid.Column>
        <Grid.Column stretched width={13}>
          <Sales />
        </Grid.Column>
      </Grid>
    )
  }
}
