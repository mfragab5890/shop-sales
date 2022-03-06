import React, { Component } from 'react'
import { Table, Header, Input } from 'semantic-ui-react'

export default class CartItems extends Component {
  state = {
    editQantity: false,
    quantity: 0,
  }

  componentDidMount(){
  }

  showQantityInput = () => {
    const { quantity } = this.props.item
    this.setState({
      quantity : quantity,
      editQantity : true,
    })
  }

  handleQuantityValue = async (e) => {
    const { value } = e.target
    if (e.type === 'change') {
      await this.setState({
        quantity : value,

      })
    }
  }

  handleQuantityChange = async (e) => {
    const { handleEditQuantity, item } = this.props
    const { quantity } = this.state
    if (e.key === 'Enter' || e.type === 'blur') {
      await this.setState({
              editQantity : false,
            })
      await handleEditQuantity(Number(quantity), item.id)

    }
  }
  render() {

    const { item } = this.props
    const { editQantity, quantity } = this.state

    return (
      <Table.Row>
        <Table.Cell singleLine>
          <Header as='h4'>
           {item.name}
          </Header>
        </Table.Cell>
          <Table.Cell singleLine onClick = {this.showQantityInput}>
            {
              editQantity && (item.name !== 'Discount' ||  item.name !== 'خصم') 
              ? <Input
                value = {quantity}
                onBlur = {this.handleQuantityChange}
                onKeyPress = {this.handleQuantityChange}
                onChange = {this.handleQuantityValue}
              />
              : item.quantity
            }
          </Table.Cell>
          <Table.Cell singleLine>{item.price}</Table.Cell>
          <Table.Cell singleLine>{item.total}</Table.Cell>
      </Table.Row>
    )
  }
}
