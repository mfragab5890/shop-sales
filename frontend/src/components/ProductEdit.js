import React, { Component } from 'react'
import { Segment, Form, Header, Image, Message, Dimmer, Loader, Button, Icon } from 'semantic-ui-react'
import { handleEditProduct } from '../actions/products'
import { connect } from 'react-redux'

class ProductEdit extends Component {
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
    error: '',
    editedProduct: null,
    message: null,
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

  handleProductEdit = (e) => {
    e.preventDefault()
    const { name, description, buyingPrice, sellingPrice, quantity, minimum, maximum, image } = this.state
    const { lang, dispatch, authedId, product } = this.props

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

    let oldImage = product.image
    .replace("b'", "data:image/jpg;base64,")
    .slice(0, -1)

    let editedProduct = {}

    if (image === oldImage || image === '/logo.png') {
      editedProduct = {
        id: product.id,
        name,
        description,
        buyingPrice,
        sellingPrice,
        quantity,
        minimum,
        maximum,
      }
    }
    else {
      editedProduct = {
        id: product.id,
        name,
        description,
        buyingPrice,
        sellingPrice,
        quantity,
        minimum,
        maximum,
        image: image.split(',')[1]
      }
    }

    dispatch(handleEditProduct(editedProduct, authedId)).then((value) => {
      this.setState({
        message: {
          success: value.success,
          text: value.mesage,
        }
      })
    })

  }
  componentDidMount = async () => {
    const { product } = this.props
    const image = product.image !== ''
                   ?
                     product.image
                     .replace("b'", "data:image/jpg;base64,")
                     .slice(0, -1)
                   : '/logo.png'
    await this.setState({
      name: product.name,
      description : product.description,
      sellingPrice : product.sell_price,
      buyingPrice : product.buy_price,
      quantity : product.qty,
      minimum : product.mini,
      maximum : product.maxi,
      image: image,
    })
  }

  render() {
    const { theme, lang, loadingBar } = this.props

    const {
      myScript,
      error,
      sellingPrice,
      name,
      description,
      buyingPrice,
      quantity,
      minimum,
      maximum,
      image,
      message,
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
          {lang === 'EN'? `Edit Product: ${name}`  : `تعديل المنتج : ${name}`}
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
            <Image
              size = 'small'
              centered
              src={image}
            />
          </Form.Field>
          <Form.Field>
            {
              message
              ?(
                message.success
                ?
                  <Message
                    success
                    header='Action Completed'
                    content={message.text}
                  />
                :
                <Message
                  error
                  header='Action Forbidden'
                  content={message.text}
                />
              )

              :null
            }
            {
              error !== ''
              ?
                <Message
                  error
                  header='Action Forbidden'
                  content={error}
                />
              : null
            }
            <Button fluid color='green' onClick={this.handleProductEdit}>
              <Icon name='edit' /> {myScript[lang].btns.edit}
            </Button>
          </Form.Field>


        </Form>
      </Segment>
    )
  }
}

const mapStateToProps = ({authedUser, loadingBar}) => {
  const authedId = authedUser.id
  return {
    loadingBar: loadingBar.default === 1? true : false,
    authedId,
  };
}

export default connect(mapStateToProps)(ProductEdit)
