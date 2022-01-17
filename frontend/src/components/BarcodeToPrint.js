import React, { Component, Fragment } from "react";
import ReactToPrint from 'react-to-print';
import { Button } from 'semantic-ui-react'

class CartToPrint extends Component {
  render() {
    const { theme, barcodeImage } = this.props
    return (
      <Fragment>
        <div ref={el => (this.barcodeRef = el)}>
          <img alt = 'barcode' src={barcodeImage} className="ui centered spaced image" />
          <br/>
          <br/>
          <img alt = 'barcode' src={barcodeImage} className="ui centered spaced image" />
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
