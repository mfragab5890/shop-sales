import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'

export default class AppMenu extends Component {
  state = { activeItem: 'sales' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu inverted icon='labeled' compact vertical pointing >
        <Menu.Item
          name='sales'
          active={activeItem === 'sales'}
          onClick={this.handleItemClick}
        >
          <Icon name='shopping cart' />
          Sales
        </Menu.Item>

        <Menu.Item
          name='financial'
          active={activeItem === 'financial'}
          onClick={this.handleItemClick}
        >
          <Icon name='calculator' />
          Financial
        </Menu.Item>

        <Menu.Item
          name='products'
          active={activeItem === 'products'}
          onClick={this.handleItemClick}
        >
          <Icon name='gem' />
          Products
        </Menu.Item>
      </Menu>
    )
  }
}
