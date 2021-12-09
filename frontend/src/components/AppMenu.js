import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'

class AppMenu extends Component {
  state = { activeItem: 'Sales' }

  handleItemClick = async (e, { name }) => {
    await this.setState({ activeItem: name })
    if (name === 'Sales') {
      return this.props.history.push('/sales')
    }
    if (name === 'Financial') {
      return this.props.history.push('/financial')
    }
    if (name === 'Products') {
      return this.props.history.push('/products')
    }

  }

  render() {
    const { activeItem } = this.state
    const { theme, lang } = this.props
    const myScript = {
      AR: {
        firstTab: 'المبيعات',
        secondTab: 'المالية',
        thirdTab: 'المنتجات'
      },
      EN:{
        firstTab: 'Sales',
        secondTab: 'Financial',
        thirdTab: 'Products'
      }
    }
    return (
      <Menu inverted = {theme !== 'basic'? true : false} color = {theme} icon='labeled' compact vertical pointing >
        <Menu.Item
          name={myScript.EN.firstTab}
          active={activeItem === 'Sales'}
          onClick={this.handleItemClick}
        >
          <Icon name='shopping cart' />
          {myScript[lang].firstTab}
        </Menu.Item>

        <Menu.Item
          name={myScript.EN.secondTab}
          active={activeItem === 'Financial'}
          onClick={this.handleItemClick}
        >
          <Icon name='calculator' />
          {myScript[lang].secondTab}
        </Menu.Item>

        <Menu.Item
          name={myScript.EN.thirdTab}
          active={activeItem === 'Products'}
          onClick={this.handleItemClick}
        >
          <Icon name='gem' />
          {myScript[lang].thirdTab}
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(AppMenu)
