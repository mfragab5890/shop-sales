import React, { Component } from 'react'
import { Grid, Segment } from 'semantic-ui-react'
import AppMenu from './AppMenu'

export default class AppBody extends Component {
  render() {
    return (
      <Grid>
        <Grid.Column width={3}>
          <AppMenu />
        </Grid.Column>
        <Grid.Column stretched width={13}>
          <Segment>
          This is an stretched grid column. This segment will always match the
          tab height.
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}
