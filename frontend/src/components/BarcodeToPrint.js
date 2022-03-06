import React, { Component, Fragment } from "react";
import ReactToPrint from 'react-to-print';
import { Button, Header } from 'semantic-ui-react'

class CartToPrint extends Component {
  render() {
    const { theme, barcodeImage, price, lang } = this.props
    const priceLabel = lang === 'EN' ? 'Price' : 'السعر'
    return (
      <Fragment>
        <div ref={el => (this.barcodeRef = el)}>
          <img alt = 'barcode' src={barcodeImage} className="ui centered spaced image" />
          <Header as= 'h6' attached='bottom' textAlign='center'>{priceLabel} : {price}</Header>
          <img alt = 'barcode' src={barcodeImage} className="ui centered spaced image" />
          <Header as= 'h6'  attached='bottom' textAlign='center'>{priceLabel} : {price}</Header>
        </div>
        <ReactToPrint
          trigger={() => {
            return <Button color = {theme} icon='print' attached='bottom'></Button>;
          }}
          content={() => this.barcodeRef}
        />
      </Fragment>
    )
  }
}
export default CartToPrint;
