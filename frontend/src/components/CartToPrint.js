import React, { Component, Fragment } from "react";
import ReactToPrint from 'react-to-print';
import Cart from './Cart'
import { Button } from 'semantic-ui-react'

class CartToPrint extends Component {
  render() {
    const { theme, lang, cartItems, total, totalQuantity, printing, handleAddOrder, handleEditQuantity, myScript, discountAmount } = this.props
    return (
      <Fragment>
        <Cart
          lang = {lang}
          theme = {theme}
          discountAmount = {discountAmount}
          cartItems = {cartItems}
          total = {total}
          totalQuantity = {totalQuantity}
          ref = {(el) => this.cartRef = el}
          handleEditQuantity = { handleEditQuantity }
        />
        <ReactToPrint
          onBeforePrint = {handleAddOrder}
          trigger={() => {
            return <Button color = {theme !== 'basic'? theme : 'black'} attached='bottom' disabled = {totalQuantity === 0 || printing === true? true : false}>{myScript}</Button>;
          }}
          content={() => this.cartRef }
        />
      </Fragment>
    )
  }
}
export default CartToPrint;
