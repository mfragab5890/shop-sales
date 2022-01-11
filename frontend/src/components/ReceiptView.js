import React, { Component } from 'react'
import { Table, Image } from 'semantic-ui-react'
import ReceiptItems from './ReceiptItems'

export default class ReceiptView extends Component {
  state = {
    cartItems: [],
    total: 0,
    totalQuantity: 0,
  }

  componentDidMount(){
    const { total, totalQuantity, cartItems } = this.props
    this.setState({
      cartItems: cartItems,
      total: total,
      totalQuantity: totalQuantity
    })
  }

  updateTotal = () => {
    const { cartItems } = this.state
    let total = 0
    let totalCost = 0
    let totalQuantity = 0
    cartItems.map((item) => {
      total += item.total
      totalCost += item.totalCost
      totalQuantity += item.quantity
      return item;
    })
    this.setState({
      total : total,
      totalCost : totalCost,
      totalQuantity : totalQuantity,
    })
  }

  handleQuantityChange = (quantity, itemId) => {
    let { cartItems } = this.state
    if (quantity === 0) {
      cartItems = cartItems.filter((item) => item.id !== itemId)
      this.setState({
        cartItems : cartItems,
      })
    }
    else {
      const itemIndex = cartItems.findIndex((item => item.id === itemId))
      cartItems[itemIndex].quantity = quantity
      cartItems[itemIndex].total = cartItems[itemIndex].price * quantity
      cartItems[itemIndex].totalCost = cartItems[itemIndex].cost * quantity
      this.setState({
        cartItems : cartItems,
      })
    }
    this.updateTotal()

  }

  render() {

    const { lang } = this.props
    const { total, totalQuantity, cartItems } = this.state
    const myScript = {
      EN:{
        item: 'Item',
        price: 'Price',
        quantity: 'Qty',
        total: 'Total',
        totalQuantity: 'items'
      },
      AR:{
        item: 'الصنف',
        price: 'السعر',
        quantity: 'الكمية',
        total: 'الاجمالي',
        totalQuantity: 'الاصناف'
      }
    }

    return (
      <div>
        <Image circular size = 'tiny' src='/logoN.jpeg' centered />
        <Table padded stackable>
          <Table.Header>
            <Table.Row>
             <Table.HeaderCell singleLine>{ myScript[lang].item }</Table.HeaderCell>
             <Table.HeaderCell singleLine>{ myScript[lang].quantity }</Table.HeaderCell>
             <Table.HeaderCell singleLine>{ myScript[lang].price }</Table.HeaderCell>
             <Table.HeaderCell singleLine>{ myScript[lang].total }</Table.HeaderCell>
           </Table.Row>
         </Table.Header>
         <Table.Body>
           { cartItems.length > 0
             && cartItems.map((item) => {
               return(
                 <ReceiptItems
                  item = {item}
                  key = {item.id}
                  handleEditQuantity = {this.handleQuantityChange}
                 />
               )
             })


           }
        </Table.Body>
        <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell singleLine textAlign='center' colSpan='2'>
            { myScript[lang].total }: {total}
          </Table.HeaderCell>
          <Table.HeaderCell singleLine textAlign='center' colSpan='2'>
            { myScript[lang].totalQuantity }: {totalQuantity}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
      </Table>
      </div>

    )
  }
}
