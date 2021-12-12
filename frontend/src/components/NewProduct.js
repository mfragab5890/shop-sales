import React, { Component } from 'react'
import { Segment, Button, Form } from 'semantic-ui-react'
import bwipjs from 'bwip-js'

export default class NewProduct extends Component {
  state = {
    name:'',
    price:'',
    barcode:'',
  }

  onNameChange = (e) => {
    const value = e.target.value
    const { price } = this.state
    const newBarcode = value + '-P' + price
    this.setState({
      name : value,
      barcode : newBarcode,
    })
  }

  onPriceChange = (e) => {
    const value = e.target.value
    const { name } = this.state
    const newBarcode = name + '-P' + value
    this.setState({
      price : value,
      barcode : newBarcode,
    })
  }

  handleBarcodeGenerator = (value) => {
    try {
      // The return value is the canvas element
      let canvas = bwipjs.toCanvas('mycanvas', {
                bcid:        'code128',       // Barcode type
                text:        value,    // Text to encode
                scale:       2,               // 3x scaling factor
                height:      5,              // Bar height, in millimeters
                includetext: true,            // Show human-readable text
                textxalign:  'center',        // Always good to set this
            });
    } catch (e) {
        // `e` may be a string or Error object
    }
  }

  handleAddProduct = (e) => {
    e.preventDefault()
    const { name, price, barcode } = this.state
    this.handleBarcodeGenerator(barcode)

  }

  render() {

    const { theme, lang } = this.props
    const myScript = {}
    return (
      <Segment>
        Add New Product
        <Form>
          <Form.Field>
            <label>Name</label>
            <input placeholder='Product Name' value = {this.state.name} onChange = {this.onNameChange}/>
          </Form.Field>
          <Form.Field>
            <label>Price</label>
            <input placeholder='Product Price' value = {this.state.price} onChange = {this.onPriceChange}/>
          </Form.Field>
          <Form.Field>
            <label>Barcode Text</label>
            <input placeholder='Barcode Text' disabled value = {this.state.barcode}/>
          </Form.Field>
          <Button type='submit' onClick = {this.handleAddProduct}>Submit</Button>
        </Form>
        <canvas id="mycanvas"></canvas>
      </Segment>
    )
  }
}
