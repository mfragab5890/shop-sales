import React, { Component } from 'react'
import { Grid, Segment, Menu } from 'semantic-ui-react'
import AppMenu from './AppMenu'

export default class AppBody extends Component {
  state = { activeItem: 'bio' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    const { activeItem } = this.state
    return (
      <Grid>
        <Grid.Column stretched width={3}>
          <AppMenu />
        </Grid.Column>
        <Grid.Column stretched width={13}>
          <Segment>
            <Menu attached='top' pointing>
            <Menu.Item
              name='bio'
              active={activeItem === 'bio'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='photos'
              active={activeItem === 'photos'}
              onClick={this.handleItemClick}
            />
          </Menu>

          <Segment>
            This is an stretched grid column. This segment will always match the
            tab height.
          </Segment>



          </Segment>

        </Grid.Column>
      </Grid>
    )
  }
}
