import React, { Component } from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

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
    if (name === 'Admin') {
      return this.props.history.push('/Admin')
    }

  }

  componentDidMount(){
    const location = this.props.history.location.pathname
    if (location.includes('sales')) {
      this.setState({ activeItem: 'Sales' })
    }
    if (location.includes('financial')) {
      this.setState({ activeItem: 'Financial' })
    }
    if (location.includes('products')) {
      this.setState({ activeItem: 'Products' })
    }
    if (location.includes('admin')) {
      this.setState({ activeItem: 'Admin' })
    }

  }

  componentDidUpdate(){
    const location = this.props.history.location.pathname
    if (location.includes('sales')) {
      const { activeItem } = this.state
      if (activeItem !== 'Sales') {
        return this.setState({ activeItem: 'Sales' })
      }
    }
    if (location.includes('financial')) {
      const { activeItem } = this.state
      if (activeItem !== 'Financial') {
        return this.setState({ activeItem: 'Financial' })

      }
    }
    if (location.includes('products')) {
      const { activeItem } = this.state
      if (activeItem !== 'Products') {
        return this.setState({ activeItem: 'Products' })
      }
    }
    if (location.includes('admin')) {
      const { activeItem } = this.state
      if (activeItem !== 'Admin') {
        return this.setState({ activeItem: 'Admin' })
      }
    }

  }

  render() {
    const { activeItem } = this.state
    const { theme, lang, permissions } = this.props
    const myScript = {
      AR: {
        firstTab: 'المبيعات',
        secondTab: 'المالية',
        thirdTab: 'المنتجات',
        fourthTab: 'الادارة',
      },
      EN:{
        firstTab: 'Sales',
        secondTab: 'Financial',
        thirdTab: 'Products',
        fourthTab: 'Admin',
      }
    }
    return (
      <Menu inverted = {theme !== 'basic'? true : false} color={theme !== 'basic' ? theme : null} icon='labeled' compact vertical pointing >
        {
          permissions.includes('CREATE_ORDER') && permissions.includes('SEARCH_PRODUCTS_BY_ID')
          ?
          <Menu.Item
            name={myScript.EN.firstTab}
            active={activeItem === 'Sales'}
            onClick={this.handleItemClick}
          >
            <Icon inverted = {theme !== 'basic'? true : false} name='shopping cart' />
            {myScript[lang].firstTab}
          </Menu.Item>
          :null
        }
        {
          permissions.includes('GET_MONTH_SALES') || permissions.includes('GET_PERIOD_SALES') || permissions.includes('GET_TODAY_SALES')
          ?
          <Menu.Item
            name={myScript.EN.secondTab}
            active={activeItem === 'Financial'}
            onClick={this.handleItemClick}
          >
            <Icon inverted = {theme !== 'basic'? true : false} name='calculator' />
            {myScript[lang].secondTab}
          </Menu.Item>
          :null
        }
        {
          permissions.includes('CREATE_NEW_PRODUCT') || permissions.includes('GET_ALL_PRODUCTS')
          ?
          <Menu.Item
            name={myScript.EN.thirdTab}
            active={activeItem === 'Products'}
            onClick={this.handleItemClick}
          >
            <Icon inverted = {theme !== 'basic'? true : false} name='gem' />
            {myScript[lang].thirdTab}
          </Menu.Item>
          :null
        }
        {
          permissions.includes('CREATE_NEW_USER') || permissions.includes('DELETE_USER') || permissions.includes('EDIT_USER')
          ?
          <Menu.Item
            name={myScript.EN.fourthTab}
            active={activeItem === 'Admin'}
            onClick={this.handleItemClick}
          >
          <Icon.Group size = 'big'>
            <Icon inverted = {theme !== 'basic'? true : false} name='shield' />
            <Icon inverted = {theme !== 'basic'? true : false} corner='bottom right' name='setting' />
          </Icon.Group>
          <br/>
            {myScript[lang].fourthTab}
          </Menu.Item>
          :null
        }
      </Menu>
    )
  }
}

const mapStateToProps = ({authedUser}) => {
  const permissions = authedUser.permissions.map((permission) => permission.name)
  return {
    permissions: authedUser? permissions:[],
  };
}

export default withRouter(connect(mapStateToProps)(AppMenu))
