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

  }

  render() {
    const { activeItem } = this.state
    const { theme, lang, permissions } = this.props
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
        {
          permissions.includes('CREATE_ORDER') && permissions.includes('SEARCH_PRODUCTS_BY_ID')
          ?
          <Menu.Item
            name={myScript.EN.firstTab}
            active={activeItem === 'Sales'}
            onClick={this.handleItemClick}
          >
            <Icon name='shopping cart' />
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
            <Icon name='calculator' />
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
            <Icon name='gem' />
            {myScript[lang].thirdTab}
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
