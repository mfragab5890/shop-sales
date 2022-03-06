import React, { Component } from 'react'
import { Table, Header, Input } from 'semantic-ui-react'
import { getProductById } from '../utils/api'
export default class ReceiptItems extends Component {
  state = {
    editQantity: false,
    quantity: 0,
    name: '',
  }

  componentDidMount = async () => {
    const id = this.props.item.product_id
    if (id !== 'discount') {
      await getProductById(id)
      .then(({name}) => this.setState({
        name: name,
      }))
    }
    else {
      const { lang } = this.props
      const name = lang === 'EN' ? 'Discount' : 'خصم'
      return this.setState({
        name: name,
      });
    }


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
    const { value } = e.target
    if (e.key === 'Enter' || e.type === 'blur') {
      await this.setState({
              editQantity : false,
              quantity : value,
            })
      await handleEditQuantity(Number(quantity), item.id)

    }
  }
  render() {

    const { item } = this.props
    const { editQantity, quantity, name } = this.state

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
          <Table.Cell singleLine>{item.total_price/item.qty}</Table.Cell>
          <Table.Cell singleLine>{item.total_price}</Table.Cell>
      </Table.Row>
    )
  }
}
