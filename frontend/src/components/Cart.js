import React, { Component } from 'react'
import { Table, Image } from 'semantic-ui-react'
import CartItem from './CartItem'

export default class Cart extends Component {
  state = {
  }

  componentDidMount(){
  }

  render() {

    const { theme, lang, cartItems, total, totalQuantity, handleEditQuantity } = this.props
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
           { cartItems.length >= 1
             && cartItems.map((item) => {
               return(
                 <CartItem
                  item = {item}
                  key = {item.id}
                  handleEditQuantity = {handleEditQuantity}
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
