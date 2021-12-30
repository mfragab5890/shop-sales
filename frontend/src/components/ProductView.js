import React, { Component } from 'react'
import { Segment, Image, Card, Button, Accordion, Icon } from 'semantic-ui-react'
import bwipjs from 'bwip-js'
import ReactToPrint from 'react-to-print';

export default class ProductView extends Component {
  state = {
    barcodeImage : '',
    activeIndex: 1
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
      let canvas = await bwipjs.toCanvas((name.replace(/\s/g, '') +'_'+ id), {
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

  componentDidMount = async () => {
    const { id } = this.props.product
    await this.handleBarcodeGenerator(id)
    await this.setState({
      barcodeImage : this.canavasRef.toDataURL()
    })
  }

  render() {

    const { product, theme, lang } = this.props
    const { barcodeImage, activeIndex } = this.state
    const myScript = {
      EN: {
        btns:{
          print: 'Print Barcode',
        },
        details: 'Product Details'
      },
      AR: {
        btns:{
          print: 'طباعة الباركود',
        },
        details: 'بيانات المنتج'
      },

    }
    let image = product.image
                  .replace("b'", "data:image/jpg;base64,")
                  .slice(0, -1)
    return (
      <Card color={theme}>
        <Card.Content>
          <Card.Header>
            {product.name}
            <Image
              floated='right'
              size='mini'
              src={image? image : '/logo.png'}
            />
          </Card.Header>
          <Card.Meta>{product.id}</Card.Meta>

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
              <Card.Description>
                Description: {product.description}
              </Card.Description>
              <Card.Description>
                Quantity: {product.qty}
              </Card.Description>
              <Card.Description>
                Selling Price: {product.sell_price}
              </Card.Description>
              <Card.Description>
                Sold: {product.sold}
              </Card.Description>
              <Segment centered textAlign = 'center'>
                <canvas id={product.name.replace(/\s/g, '') +'_'+ product.id} style={{padding:'3px', margin: '3px', display: 'none'}}  ref={el => (this.canavasRef = el)} />
                <img src={barcodeImage} className="ui centered spaced image" ref={el => (this.barcodeRef = el)}/>
                <ReactToPrint
                  trigger={() => {
                    return <Button color = {theme} icon='print' attached='bottom'></Button>;
                  }}
                  content={() => this.barcodeRef}
                />
              </Segment>
            </Accordion.Content>
          </Accordion>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            <Button basic color='green'>
              Edit
            </Button>
            <Button basic color='red'>
              Delete
            </Button>
          </div>
        </Card.Content>
      </Card>

    )
  }
}
