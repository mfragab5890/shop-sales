import React, { Component } from 'react'
import { Grid, Image, Header, Table, Input, Button } from 'semantic-ui-react'
import { getProductById, addNewOrder } from '../utils/api'
import ReactToPrint from 'react-to-print';
import Cart from './Cart'

export default class NewOrder extends Component {
  state = {
    barcode : '',
    cartItems : [],
    cartIds : [],
    total : 0,
    totalCost : 0,
    totalQuantity: 0,
    results : []
  }

  onBarcodeChange = (e) => {
    const { value } = e.target
    this.setState({
      barcode: value
    })

  }

  formatProduct = (product, quantity = 1) => {
    const total = quantity * product.sell_price
    const totalCost = quantity * product.buy_price
    return {
      id : product.id,
      name: product.name,
      price: product.sell_price,
      cost: product.buy_price,
      quantity: quantity,
      total :  total,
      totalCost: totalCost

    };
  }

  updateTotal = () => {
    const { cartItems } = this.state
    let total = 0
    let totalCost = 0
    let totalQuantity = 0
    cartItems.map((item) => {
      total += item.total
      totalCost += item.totalCost
      totalQuantity += item.quantity
      return item;
    })
    this.setState({
      total : total,
      totalCost : totalCost,
      totalQuantity : totalQuantity,
    })
  }


  handleAddToCart = async (e) => {
    const { cartIds } = this.state

    if(e.key === 'Enter'){
      const id = Number(e.target.value)
      if(!cartIds.includes(id)){
        getProductById(id)
        .then(res => {
          if(res.error){
            return alert(res.message);
          }
          const product = this.formatProduct(res)
          this.setState((prevState) => {
          return {
            ...prevState,
            cartItems : prevState.cartItems.concat([product]),
            cartIds : prevState.cartIds.concat([product.id]),
            };
          })
        })
        .then(() => this.updateTotal())
        .then(() => this.setState({
          barcode: '',
        }))
      }
      else {
        let { cartItems } = this.state
        const itemIndex = cartItems.findIndex((item => item.id === id))
        cartItems[itemIndex].quantity += 1
        cartItems[itemIndex].total += cartItems[itemIndex].price
        cartItems[itemIndex].totalCost += cartItems[itemIndex].cost
        await this.setState({
          cartItems : cartItems,
          barcode : ''
        })
        await this.updateTotal()

      }

    }
  }

  handleEditQuantity = async (quantity, id) => {
    let { cartItems, cartIds } = this.state
    if (quantity === 0) {
      cartItems = cartItems.filter((item) => item.id !== id)
      cartIds = cartIds.filter((itemId) => itemId !== id)
      await this.setState({
        cartItems : cartItems,
        cartIds : cartIds
      })
    }
    else {
      const itemIndex = cartItems.findIndex((item => item.id === id))
      cartItems[itemIndex].quantity = quantity
      cartItems[itemIndex].total = cartItems[itemIndex].price * quantity
      cartItems[itemIndex].totalCost = cartItems[itemIndex].cost * quantity
      await this.setState({
        cartItems : cartItems,
        barcode : ''
      })
    }
    await this.updateTotal()

  }
  handleAddOrder = () => {
    const { cartItems, total, totalCost, totalQuantity } = this.state
    addNewOrder({
      cartItems,
      total,
      totalCost,
      totalQuantity
    })
  }

  componentDidMount(){
    this.inputRef.focus()
  }

  render() {

    const { theme, lang } = this.props
    const { barcode, cartItems, total, totalQuantity } = this.state
    const myScript = {
      EN:{
        item: 'Item',
        price: 'Price',
        quantity: 'Qty',
        total: 'Total',
        search:{
          barcode: 'Barcode',
          barcodePlaceholder: 'Search By Barcode',
          name: 'Name',
          namePlaceholder: 'Search By Name Or Description'
        },
        btns:{
          submit: 'Submit',
          print: 'Print Reciept',
        },
      },
      AR:{
        item: 'الصنف',
        price: 'السعر',
        quantity: 'الكمية',
        total: 'الاجمالي',
        search:{
          barcode: 'باركود',
          barcodePlaceholder: 'البحث بالباركود',
          name: 'الاسم',
          namePlaceholder: 'البحث بالاسم'
        },
        btns:{
          print: 'طباعة الايصال',
        },
      }
    }
    return (
      <Grid celled='internally'>
        <Grid.Row>
          <Grid.Column width={9}>
            <Input
              icon = 'search'
              label = {myScript[lang].search.barcode}
              placeholder = {myScript[lang].search.barcodePlaceholder}
              ref = {el => (this.inputRef = el)}
              value = {barcode}
              onChange = {this.onBarcodeChange}
              onKeyPress={this.handleAddToCart}
              type = {'number'}
            />
          </Grid.Column>
          <Grid.Column width={7}>
            <Input
              icon='search'
              label={myScript[lang].search.name}
              placeholder= {myScript[lang].search.namePlaceholder}
              floated = {'right'}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={9}>

            <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
          </Grid.Column>
          <Grid.Column width={7}>
            <Cart
              lang = {lang}
              theme = {theme}
              cartItems = {cartItems}
              total = {total}
              totalQuantity = {totalQuantity}
              ref = {(el) => this.cartRef = el}
              handleEditQuantity = { this.handleEditQuantity }
            />
            <ReactToPrint
              onBeforePrint = {() => {
                this.handleAddOrder();
              }}
              trigger={() => {
                return <Button color = {theme} attached='bottom' disabled = {total === 0? true : false}>{myScript[lang].btns.print}</Button>;
              }}
              content={() => this.cartRef }
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
