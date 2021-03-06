import React, { Component } from 'react'
import { Grid, Image, Input, List, Message, Dimmer, Loader, Segment, Dropdown, Button } from 'semantic-ui-react'
import { getProductById, searchProducts } from '../utils/api'
import { handleAddOrder } from '../actions/orders'
import CartToPrint from './CartToPrint'
import { connect } from 'react-redux'

class NewOrder extends Component {
  state = {
    barcode : '',
    searchTerm : '',
    typing : 0,
    loading : false,
    cartItems : [],
    cartIds : [],
    total : 0,
    totalCost : 0,
    totalQuantity: 0,
    results : [],
    noResults: false,
    printing: false,
    discount: 0,
    discountType: 1,
    discountAmount: 0
  }

  onBarcodeChange = (e) => {
    const { value } = e.target
    this.setState({
      barcode: value
    })
  }

  onSearchTermChange = (e) => {
    const { value } = e.target
    this.setState((prevState) => {
      return {
        searchTerm: value,
        loading: true,
        typing: clearTimeout(prevState.typing)
      };
    })
    this.setState({
      typing: setTimeout(() => this.handleProductsSearch(value), 500)
    })
  }

  handleProductsSearch = async (searchTerm) => {
    if (searchTerm === '') {
      return await this.setState({
        loading: false,
        results: [],
        noResults: false,
      });
    }
    const results = await searchProducts(searchTerm)
    if (results.products.length === 0) {
      return  this.setState({
        loading: false,
        results: [],
        noResults: true,
      })
    }
    await this.setState({
      loading: false,
      results: results.products,
      noResults: false,
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

  handleResultAddToCart = async (result) => {
    const { cartIds } = this.state
    const id = Number(result.id)
    if(!cartIds.includes(id)){
        const product = this.formatProduct(result)
        await this.setState((prevState) => {
        return {
          ...prevState,
          cartItems : prevState.cartItems.concat([product]),
          cartIds : prevState.cartIds.concat([product.id]),
          };
        })
      await this.updateTotal()
      await this.setState({
        barcode: '',
      })
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

  clearCart = async () => {
    await this.setState({
      cartItems : [],
      cartIds : [],
      total : 0,
      totalCost : 0,
      totalQuantity: 0,
      discount: 0,
      discountType: 1,
      discountAmount: 0,
    })
  }

  handleAddOrder = () => {
    this.setState({
      printing: true,
    })
    const { cartItems, total, totalCost, totalQuantity } = this.state
    const { lang, dispatch, authedId } = this.props
    dispatch(handleAddOrder({
      cartItems,
      total,
      totalCost,
      totalQuantity,
      created_by:authedId,
    }))

    const message = lang === 'EN'
      ? `Do You Want To Clear The Cart After Printing?`
      : `???? ???????? ?????????? ?????????????? ???????????????? ?????? ????????????????`
    if (window.confirm(message)) {
      this.clearCart()
    }
    this.setState({
      printing:false,
    })
  }

  onDiscountTypeChange = (e,{value}) => {
    this.setState({
      discountType: value,
    })
  }

  onDiscountChange = (e, {value}) => {
    this.setState({
      discount: value,
    })
  }

  handleAddDiscount = (e) => {
    const { key } = e
    if (key === 'Enter') {
      const { discount, discountType, total } = this.state
      let newTotal = 0
      let discountAmount = 0
      if (total !== 0) {

        if (discountType === 1) {
          newTotal = total * (1-(discount/100))
        }

        else {
          newTotal = total- discount
        }

        discountAmount = total - newTotal

        return this.setState({
          total: newTotal,
          discountAmount: discountAmount,
          discount: 0,
        });
      }
    }
  }
  confirmClearCart = () => {
    const { lang } = this.props
    const message = lang === 'EN'
      ? `Do You Want To Clear The Cart?`
      : `???? ???????? ?????????? ?????????????? ??????????????????`
    if (window.confirm(message)) {
      this.clearCart()
    }
  }

  componentDidMount(){
    this.inputRef.focus()
  }

  render() {

    const { theme, lang, loadingBar } = this.props
    const { barcode, searchTerm, cartItems, total, totalQuantity, loading, results, noResults, printing, discount, discountType, discountAmount } = this.state
    const myScript = {
      EN:{
        item: 'Item',
        price: 'Price',
        quantity: 'Qty',
        total: 'Total',
        description: 'Description',
        discount: 'Discount',
        discountTypes: {
          name: 'Discount Type',
          percentage: 'Percentage',
          amount: 'Cash Back'
        },
        search:{
          barcode: 'Barcode',
          barcodePlaceholder: 'Search By Barcode',
          name: 'Name',
          namePlaceholder: 'Search By Name Or Description',
          noResults: 'Sorry There Are No Products Name or Description Match Or Contain your Search Term',
        },
        btns:{
          print: 'Print Reciept',
          clear: 'Clear Cart'
        },
      },
      AR:{
        item: '??????????',
        price: '??????????',
        quantity: '????????????',
        total: '????????????????',
        description: '??????????',
        discount: '??????',
        discountTypes: {
          name: '?????? ??????????',
          percentage: '????????',
          amount: '????????'
        },
        search:{
          barcode: '????????????',
          barcodePlaceholder: '?????????? ??????????????????',
          name: '??????????',
          namePlaceholder: '?????????? ????????????',
          noResults: '???????? ???? ?????????????? ???? ?????? ?????????????? ?????????? ???? ?????????? ?????? ???????? ?????????? ??????',
        },
        btns:{
          print: '?????????? ??????????????',
          clear: '?????? ????????????????'
        },
      }
    }
    const discountOptions = [
      { key: 1, text: myScript[lang].discountTypes.percentage, value: 1, icon: 'percent' },
      { key: 2, text: myScript[lang].discountTypes.amount, value: 2, icon: 'pound' },
    ]

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
      <Grid stackable celled='internally'>
        <Grid.Row columns={2}>
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
              loading = {loading}
              label={myScript[lang].search.name}
              value = {searchTerm}
              onChange = {this.onSearchTermChange}
              placeholder= {myScript[lang].search.namePlaceholder}
              floated = {'right'}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column width={9}>
            <Grid.Row>
              <CartToPrint
                lang = {lang}
                theme = {theme}
                discountAmount = {discountAmount}
                cartItems = {cartItems}
                total = {total}
                totalQuantity = {totalQuantity}
                ref = {(el) => this.cartRef = el}
                handleEditQuantity = { this.handleEditQuantity }
                printing = {printing}
                handleAddOrder = {this.handleAddOrder}
                myScript = {myScript[lang].btns.print}
              />
            </Grid.Row>
            <Grid.Row stretched>

              <Segment >
                <Button icon = 'eraser' label = {myScript[lang].btns.clear} floated='right' onClick = {this.confirmClearCart}/>
                <Dropdown
                  inline
                  button
                   className='icon'
                  text= { discountType === 1 ? myScript[lang].discountTypes.percentage : myScript[lang].discountTypes.amount }
                  icon= { discountType === 1 ? 'percent' : 'pound' }
                  onChange={this.onDiscountTypeChange}
                  value = {discountType}
                  options={discountOptions}
                  direction = 'left'
                  disabled = {total === 0 ? true : false}
                />
                <Input
                  label = {myScript[lang].discount}
                  placeholder = {myScript[lang].discount}
                  value = {discount}
                  onChange = {this.onDiscountChange}
                  onKeyPress={this.handleAddDiscount}
                  type = {'number'}
                  disabled = {total === 0 ? true : false}
                  color = 'grey'
                />
              </Segment>
            </Grid.Row>

          </Grid.Column>
          <Grid.Column width={8}>
            {
              !noResults
              ?<List>
                  {
                    results.map((product) => {
                      const image = product.image.replace("b'", "data:image/jpg;base64,")
                                    .slice(0, -1)
                      return (
                          <List.Item key = {product.id} style={{ cursor: 'cell' }} onClick = {() => this.handleResultAddToCart(product)}>
                            <Image avatar src={image.length > 0? image : '/logo.png'} />
                            <List.Content>
                              <List.Header as='h3'>{product.id} | {product.name}</List.Header>
                              <List.Description>
                                {myScript[lang].description} : {product.description} | {myScript[lang].price} : {product.sell_price}
                              </List.Description>
                            </List.Content>
                          </List.Item>
                        );
                    })
                  }
                </List>
              :<Message
                success = {false}
                content= {myScript[lang].search.noResults}
              />
            }

          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = ({authedUser, loadingBar}) => {
  return {
    loadingBar: loadingBar.default === 1? true : false,
    authedId: authedUser.id,
  };
}

export default connect(mapStateToProps)(NewOrder)
