import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'

export default class NewProduct extends Component {

  render() {

    const { theme, lang } = this.props
    const myScript = {}
    return (
      <Segment>
        Add New Product
      </Segment>
    )
  }
}
