import React, { Component } from 'react'
import { Segment, Button, Form, Header, Card, Image } from 'semantic-ui-react'
import bwipjs from 'bwip-js'
import { addNewProduct } from '../utils/api'
import ReactToPrint from 'react-to-print';

export default class NewProduct extends Component {
  state = {
    name: '',
    description: '',
    buyingPrice: '',
    sellingPrice: '',
    quantity: '',
    barcode: '',
    minimum: 0,
    maximum: '',
    image: '',
    newImage : '',
    barcodeImage: '',
  }

  onNameChange = async (e) => {
    const value = e.target.value
    const { sellingPrice } = this.state
    const newBarcode = value + '-P' + sellingPrice
    await this.setState({
      name : value,
      barcode : newBarcode,
    })
    if (sellingPrice !== '' && value !== '') {
      const { barcode } = this.state
      await this.handleBarcodeGenerator(barcode)
    }
  }
  onDesChange = (e) => {
    const value = e.target.value
    this.setState({
    description : value,
    })
  }
  onBuyPriceChange = (e) => {
    const value = e.target.value
    this.setState({
      buyingPrice : value,
    })
  }

  onQuantityChange = (e) => {
    const value = e.target.value
    const { maximum } = this.state
    if (maximum === '') {
      this.setState({
        quantity : value,
        maximum : value,
      })
    }
    else {
      this.setState({
        quantity : value,
      })
    }

  }

  onMaxChange = (e) => {
    const value = e.target.value
    this.setState({
      maximum : value,
    })
  }

  onMinChange = (e) => {
    const value = e.target.value
    this.setState({
      minimum : value,
    })
  }

  onImageChange = async (e) => {
    const value = e.target.files[0]
    let reader = new FileReader();
    let image = ''
    reader.onload = (e) => {
      image = e.target.result
      this.setState({image: image})
    }
    reader.readAsDataURL(value)
  }


  onSellPriceChange = async (e) => {
    const value = e.target.value
    const { name } = this.state
    const newBarcode = name + '-P' + value
    await this.setState({
      sellingPrice : value,
      barcode : newBarcode,
    })
    if (name !== '' && value !== '') {
      const { barcode } = this.state
      await this.handleBarcodeGenerator('31')
    }

  }

  handleBarcodeGenerator = async (value) => {
    try {
      // The return value is the canvas element
      let canvas = await bwipjs.toCanvas('mycanvas', {
                bcid:        'code128',       // Barcode type
                text:        value,    // Text to encode
                scale:       2,               // 2x scaling factor
                height:      10,              // Bar height, in millimeters
                includetext: true,            // Show human-readable text
                textxalign:  'center',        // Always good to set this
            });
    } catch (e) {
        // `e` may be a string or Error object
    }
    await this.setState({
      barcodeImage : this.canavasRef.toDataURL()
    })
  }

  handleAddProduct = (e) => {
    e.preventDefault()
    const { name, description, buyingPrice, sellingPrice, quantity, barcode, minimum, maximum, image } = this.state
    const newProduct = {
      name,
      description,
      buyingPrice,
      sellingPrice,
      quantity,
      barcode,
      minimum,
      maximum,
      image: image.split(',')[1]
    }

    addNewProduct(newProduct).then(async (value) => {
      let newImage = value.newProduct.image
      newImage = await newImage.replace("b'", "data:image/jpg;base64,")
      newImage = await newImage.slice(0, -1)
      this.setState({
        newImage: newImage
      })

    })
    .then(() => {
      this.setState({
        name: '',
        description: '',
        buyingPrice: '',
        sellingPrice: '',
        quantity: '',
        barcode: '',
        minimum: 0,
        maximum: '',
        image: '',
        barcodeImage: '',
      })
    })
  }

  render() {

    const { theme, lang } = this.props
    const myScript = {
      EN: {
        name: 'Name',
        description: 'Description',
        buyingPrice: 'Buying Price',
        sellingPrice: 'Selling Price',
        quantity: 'Quantity',
        barcode: 'Barcode Text',
        minimum: 'Minimum',
        maximum: 'Maximum',
        image: 'Image',
        btns:{
          submit: 'Submit',
          print: 'Print Barcode',
        },
      },
      AR: {
        name: 'اسم المنتج',
        description: 'الوصف',
        buyingPrice: 'سعر الشراء',
        sellingPrice: 'سعر البيع',
        quantity: 'الكمية',
        barcode: 'الكود',
        minimum: 'الحد الادنى',
        maximum: 'الحد الاقصى',
        image: 'صورة المنتج',
        btns:{
          submit: 'اضافة',
          print: 'طباعة الباركود',
        },
      }
    }
    const {sellingPrice, name, barcodeImage} = this.state

    return (
      <Segment>
        <Header as='h1' color={theme} textAlign='center' >
          {lang === 'EN'? 'Add New Product' : 'اضافة منتج جديد'}
        </Header>

        <Form>
          <Form.Field
            required
            control='input'
            type='text'
            label = {myScript[lang].name}
            placeholder='Product Name'
            value = {this.state.name}
            onChange = {this.onNameChange}
          />
          <Form.Field
            required
            control='input'
            type='text'
            label = {myScript[lang].description}
            placeholder='description'
            value = {this.state.description}
            onChange = {this.onDesChange}
          />
          <Form.Field
            required
            control='input'
            type='number'
            min = {0}
            label = {myScript[lang].buyingPrice}
            placeholder='Product buying Price'
            value = {this.state.buyingPrice}
            onChange = {this.onBuyPriceChange}
          />
          <Form.Field
            required
            control='input'
            type='number'
            min = {0}
            label = {myScript[lang].sellingPrice}
            placeholder='Product Selling Price'
            value = {this.state.sellingPrice}
            onChange = {this.onSellPriceChange}
          />
          <Form.Field
            required
            control='input'
            type='number'
            min = {0}
            label = {myScript[lang].quantity}
            placeholder='Current Quantity'
            value = {this.state.quantity}
            onChange = {this.onQuantityChange}
          />
          <Form.Field
            control='input'
            type='number'
            min = {0}
            label = {myScript[lang].minimum}
            placeholder='Minimum Stock Quantity'
            value = {this.state.minimum}
            onChange = {this.onMinChange}
          />
          <Form.Field
            control='input'
            type='number'
            min = {0}
            label = {myScript[lang].maximum}
            placeholder= 'Maximum Stock Quantity'
            value = {this.state.maximum}
            onChange = {this.onMaxChange}
          />
          <Form.Field
            control='input'
            type='file'
            label = {myScript[lang].image}
            placeholder= 'Product Image'
            onChange = {this.onImageChange}
            accept="image/*"
          />
        {
          this.state.image !== ''
          ?(<Image src={this.state.image} size='small' centered />)
        :null
        }
          <Form.Field required>
            <label>{myScript[lang].barcode}</label>
            <input placeholder='Barcode Text' disabled value = {this.state.barcode}/>
          </Form.Field>
          <Form.Field>
            {
              sellingPrice !== '' && name !== ''
              ?  <Card centered>
                  <canvas style={{padding:'3px', margin: '3px', display: 'none'}} id="mycanvas" ref={el => (this.canavasRef = el)} />
                  <img src={barcodeImage} className="ui centered spaced medium image" ref={el => (this.barcodeRef = el)}/>
                  <ReactToPrint
                    trigger={() => {
                      return <Button color = {theme} attached='bottom'>{myScript[lang].btns.print}</Button>;
                    }}
                    content={() => this.barcodeRef}
                  />
                </Card>
              : null
            }
          </Form.Field>
          <Button attached='bottom' type='submit' onClick = {this.handleAddProduct}>{myScript[lang].btns.submit}</Button>
        </Form>

        {
          this.state.newImage !== ''
          ?(<Image src={this.state.newImage} size='medium' centered />)
        :null
        }
      </Segment>
    )
  }
}
