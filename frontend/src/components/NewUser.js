import React, { Component } from 'react'
import { Segment, Form, Header, Image, Message, Dimmer, Loader } from 'semantic-ui-react'
import bwipjs from 'bwip-js'
import { handleAddProduct } from '../actions/products'
import { connect } from 'react-redux'
import ProductView from './ProductView'

class NewProduct extends Component {
  state = {
    myScript: {
      EN: {
        name: 'Name',
        description: 'Description',
        buyingPrice: 'Buying Price',
        sellingPrice: 'Selling Price',
        quantity: 'Quantity',
        minimum: 'Minimum',
        maximum: 'Maximum',
        image: 'Image',
        btns:{
          submit: 'Submit',
          print: 'Print Barcode',
        },
        error: {
          name : "Product name can't be empty",
          description : "Product description can't be empty",
          sellingPrice: "Product selling price can't be empty",
          buyingPrice : "Product buying price can't be empty",
          quantity : "Product quantity can't be empty"
        }
      },
      AR: {
        name: 'اسم المنتج',
        description: 'الوصف',
        buyingPrice: 'سعر الشراء',
        sellingPrice: 'سعر البيع',
        quantity: 'الكمية',
        minimum: 'الحد الادنى',
        maximum: 'الحد الاقصى',
        image: 'صورة المنتج',
        btns:{
          submit: 'اضافة',
          print: 'طباعة الباركود',
        },
        error: {
          name : "يجب ادخال اسم المنتج",
          description : "يجب ادخال وصف للمنتج",
          sellingPrice: "يجب ادخال سعر بيع المنتج",
          buyingPrice : "يجب ادخال سعر شراء المنتج",
          quantity : "يجب ادخال كمية المنتج",
        }
      }
    },
    name: '',
    description: '',
    buyingPrice: '',
    sellingPrice: '',
    quantity: '',
    minimum: 0,
    maximum: '',
    image: '',
    newImage : '',
    barcodeImage: '',
    product: null,
    error: ''
  }

  onNameChange = async (e) => {
    const value = e.target.value
    await this.setState({
      name : value,
    })
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
    if (maximum === '' || maximum < value) {
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
    const { files } = e.target
    const file = files[0]
    let reader = new FileReader();
    let image = ''
    reader.onload = (e) => {
      image = e.target.result
      this.setState({
        image: image,
      })
    }
    reader.readAsDataURL(file)
  }


  onSellPriceChange = async (e) => {
    const value = e.target.value
    await this.setState({
      sellingPrice : value,
    })
  }

  handleBarcodeGenerator = async (value) => {
    const newValue = value.toString()
    try {
      // The return value is the canvas element
      await bwipjs.toCanvas('mycanvas', {
                bcid:        'code128',       // Barcode type
                text:        newValue,    // Text to encode
                scale:       2,               // 2x scaling factor
                height:      10,              // Bar height, in millimeters
                includetext: true,            // Show human-readable text
                textxalign:  'center',        // Always good to set this
            });
      await this.setState({
        barcodeImage : this.canavasRef.toDataURL()
      })
    } catch (e) {
        // `e` may be a string or Error object
    }

  }

  handleNewProduct = async (e) => {
    e.preventDefault()
    const { name, description, buyingPrice, sellingPrice, quantity, minimum, maximum, image } = this.state
    const { lang, dispatch, authedId } = this.props
    if (name === '') {
      const error = this.state.myScript[lang].error.name
      return this.setState({
        error: error
      });
    }
    if (description === '') {
      const error = this.state.myScript[lang].error.description
      return this.setState({
        error: error
      });
    }
    if (buyingPrice === '') {
      const error = this.state.myScript[lang].error.buyingPrice
      return this.setState({
        error: error
      });
    }
    if (sellingPrice === '') {
      const error = this.state.myScript[lang].error.sellingPrice
      return this.setState({
        error: error
      });
    }
    if (quantity === '') {
      const error = this.state.myScript[lang].error.quantity
      return this.setState({
        error: error
      });
    }
    const newProduct = {
      name,
      description,
      buyingPrice,
      sellingPrice,
      quantity,
      minimum,
      maximum,
      image: image.split(',')[1],
      created_by: authedId,
    }
    await dispatch(handleAddProduct(newProduct, authedId)).then(async (value) => {
      await this.setState({
        product: value.newProduct,
      })
      await this.handleBarcodeGenerator(value.newProduct.id)
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
        minimum: 0,
        maximum: '',
        image: '',
      })
    })
  }

  componentDidMount=async () => {
    this.handleBarcodeGenerator(31)
    await this.setState({
      barcodeImage : this.canavasRef.toDataURL()
    })
  }

  render() {
    const { theme, lang, loadingBar } = this.props
    const {
      product,
      myScript,
      error,
      sellingPrice,
      name,
      description,
      buyingPrice,
      quantity,
      minimum,
      maximum,
     } = this.state
    if (loadingBar) {
      return (
        <Segment style = {{width:'100%', height:'100%'}}>
          <Dimmer active style = {{width:'100%'}}>
            <Loader indeterminate  style = {{width:'100%'}}>Checking User Authorization</Loader>
          </Dimmer>
          <Image src='/shopn.jpg' style = {{width:'100%'}}/>
        </Segment>
      )
    }
    return (
      <Segment>
        <Header as='h1' color={theme} textAlign='center' >
          {lang === 'EN'? 'Add New Product' : 'اضافة منتج جديد'}
        </Header>

        <Form error = {error ? true : false}>
          <Form.Field
            required
            control='input'
            type='text'
            label = {myScript[lang].name}
            placeholder='Product Name'
            value = {name}
            onChange = {this.onNameChange}
          />
          <Form.Field
            required
            control='input'
            type='text'
            label = {myScript[lang].description}
            placeholder='description'
            value = {description}
            onChange = {this.onDesChange}
          />
          <Form.Field
            required
            control='input'
            type='number'
            min = {0}
            label = {myScript[lang].buyingPrice}
            placeholder='Product buying Price'
            value = {buyingPrice}
            onChange = {this.onBuyPriceChange}
          />
          <Form.Field
            required
            control='input'
            type='number'
            min = {0}
            label = {myScript[lang].sellingPrice}
            placeholder='Product Selling Price'
            value = {sellingPrice}
            onChange = {this.onSellPriceChange}
          />
          <Form.Field
            required
            control='input'
            type='number'
            min = {0}
            label = {myScript[lang].quantity}
            placeholder='Current Quantity'
            value = {quantity}
            onChange = {this.onQuantityChange}
          />
          <Form.Field
            control='input'
            type='number'
            min = {0}
            label = {myScript[lang].minimum}
            placeholder='Minimum Stock Quantity'
            value = {minimum}
            onChange = {this.onMinChange}
          />
          <Form.Field
            control='input'
            type='number'
            min = {0}
            label = {myScript[lang].maximum}
            placeholder= 'Maximum Stock Quantity'
            value = {maximum}
            onChange = {this.onMaxChange}
          />
          <Form.Field
            control='input'
            type='file'
            label = {myScript[lang].image}
            placeholder= 'Product Image'
            onChange = {this.onImageChange}
            accept = "image/*"
          />
          <Form.Field>
            {
              this.state.image !== ''
              ?(<Image src={this.state.image} size='small' centered />)
              :null
            }
          </Form.Field>
          <Form.Button
            content={myScript[lang].btns.submit}
            attached='bottom'
            onClick = {this.handleNewProduct}
          />
            <Message
              error
              header='Action Forbidden'
              content={error}
            />
        </Form>
        <canvas id="mycanvas" style={{padding:'3px', margin: '3px', display: 'none'}}  ref={el => (this.canavasRef = el)} />
        {
          product &&
          <Segment textAlign = 'center'>
            <ProductView theme = {theme} lang = {lang} product = {product}/>
          </Segment>
        }
      </Segment>
    )
  }
}

const mapStateToProps = ({authedUser, loadingBar}) => {
  return {
    loadingBar: loadingBar.default === 1? true : false,
    authedId: authedUser.id,
  };
}

export default connect(mapStateToProps)(NewProduct)
