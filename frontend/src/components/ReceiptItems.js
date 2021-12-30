import React, { Component } from 'react'
import { Table, Header, Input } from 'semantic-ui-react'
import { getProductById } from '../utils/api'
export default class ReceiptItems extends Component {
  state = {
    editQantity: false,
    quantity: 0,
    name: '',
    price:''
  }

  componentDidMount = async () => {
    const productId = this.props.item.product_id
    await getProductById(productId)
    .then(({sell_price, name}) => this.setState({
      price: sell_price,
      name: name,
    }))

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
    const { editQantity, quantity, name, price } = this.state

    return (
      <Table.Row>
        <Table.Cell singleLine>
          <Header as='h4'>
           {name}
          </Header>
        </Table.Cell>
          <Table.Cell singleLine onClick = {this.showQantityInput}>
            {
              editQantity
              ? <Input
                value = {quantity}
                onBlur = {this.handleQuantityChange}
                onKeyPress = {this.handleQuantityChange}
                onChange = {this.handleQuantityValue}
              />
              : item.qty
            }
          </Table.Cell>
          <Table.Cell singleLine>{price}</Table.Cell>
          <Table.Cell singleLine>{item.total_price}</Table.Cell>
      </Table.Row>
    )
  }
}
