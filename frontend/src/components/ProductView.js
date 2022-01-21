import React, { Component } from 'react'
import { Segment, Image, Card, Button, Accordion, Icon, Message, List } from 'semantic-ui-react'
import bwipjs from 'bwip-js'
import { handleDeleteProduct } from '../actions/products'
import { connect } from 'react-redux'
import BarcodeToPrint from './BarcodeToPrint'

class ProductView extends Component {
  state = {
    barcodeImage : '',
    activeIndex: 1,
    message: '',
    success: true,
  }

  handleDetailsClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handleBarcodeGenerator = async (value) => {
    let newValue = value.toString()
    if (newValue.length === 1) {
      newValue = '0' + newValue
    }
    const { id, name } = this.props.product
    try {
      // The return value is the canvas element
      await bwipjs.toCanvas((name.replace(/\s/g, '') +'_'+ id), {
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

  handleRemoveProduct = async (productId) => {
    const { lang, dispatch, confirmDelete } = this.props
    const message = lang === 'EN'
      ? `Are You Sure You Want To Delete Product Number ${productId}`
      : `هل انت متاكد انك تريد حذف المنتج رقم ${productId}`
    if (window.confirm(message)) {
      await dispatch(handleDeleteProduct(productId)).then(async (res) => {
        if (res.success === true) {
          await confirmDelete(productId, res.message)
        }
        else {
          await this.setState({
            message: res.message,
            success: false
          })
        }

        setTimeout(() => this.setState({
          message: ''
        }), 5000)
      })
    }
  }

  componentDidMount = async () => {
    const { id } = this.props.product
    await this.handleBarcodeGenerator(id)
    await this.setState({
      barcodeImage : this.canavasRef.toDataURL()
    })
  }

  render() {

    const { product, theme, lang } = this.props
    const { barcodeImage, activeIndex, message, success } = this.state
    const myScript = {
      EN: {
        description: 'Description',
        quantity: 'Quantity',
        sellPrice: 'Selling Price',
        sold: 'Sold',
        btns:{
          print: 'Print Barcode',
          edit: 'Edit',
          remove: 'Remove',
        },
        details: 'Product Details'
      },
      AR: {
        description: 'الوصف',
        quantity: 'الكمية',
        sellPrice: 'سعر البيع',
        sold: 'المبيعات',
        btns:{
          print: 'طباعة الباركود',
          edit: 'تعديل',
          remove: 'حذف',
        },
        details: 'بيانات المنتج'
      },

    }
    let image = product.image
                  .replace("b'", "data:image/jpg;base64,")
                  .slice(0, -1)
    return (
      <Card color={theme}>
        {
          message !== '' &&
          <Message
            success = {success}
            warning = {!success}
            header={'success: ' + success}
            content= {message}
          />
        }
        <Card.Content>
          <Card.Header>
            {product.name}
            <Image
              floated='right'
              size='mini'
              src={image? image : '/logo.png'}
            />
          </Card.Header>
          <Card.Meta>{product.id} | {product.created_on}</Card.Meta>

        </Card.Content>
        <Card.Content>
          <Accordion>
            <Accordion.Title
              active={activeIndex === 0}
              index={0}
              onClick={this.handleDetailsClick}
            >
              <Icon name='dropdown' />
              {myScript[lang].details}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === 0}>
              <List divided relaxed>
                <List.Item>
                  <List.Icon name='newspaper outline' size='large' verticalAlign='middle' />
                  <List.Content>
                    <List.Header as='a'>{myScript[lang].description}</List.Header>
                    <List.Description as='a'>{product.description}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name='hashtag' size='large' verticalAlign='middle' />
                  <List.Content>
                    <List.Header as='a'>{myScript[lang].quantity}</List.Header>
                    <List.Description as='a'>{product.qty}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name='pound' size='large' verticalAlign='middle' />
                  <List.Content>
                    <List.Header as='a'>{myScript[lang].sellPrice}</List.Header>
                    <List.Description as='a'>{product.sell_price}</List.Description>
                  </List.Content>
                </List.Item>
                <List.Item>
                  <List.Icon name='chart line' size='large' verticalAlign='middle' />
                  <List.Content>
                    <List.Header as='a'>{myScript[lang].sold}</List.Header>
                    <List.Description as='a'>{product.sold}</List.Description>
                  </List.Content>
                </List.Item>
              </List>
              <Segment textAlign = 'center'>
                <canvas id={product.name.replace(/\s/g, '') +'_'+ product.id} style={{padding:'3px', margin: '3px', display: 'none'}}  ref={el => (this.canavasRef = el)} />
                <BarcodeToPrint
                  theme = {theme}
                  barcodeImage = {barcodeImage}
                />
              </Segment>
            </Accordion.Content>
          </Accordion>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            <Button basic color='green'>
              {myScript[lang].btns.edit}
            </Button>
            <Button basic color='red' onClick = {() => this.handleRemoveProduct(product.id)}>
              {myScript[lang].btns.remove}
            </Button>
          </div>
        </Card.Content>
      </Card>

    )
  }
}

export default connect()(ProductView)
