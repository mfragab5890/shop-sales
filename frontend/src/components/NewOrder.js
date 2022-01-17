import React, { Component } from 'react'
import { Grid, Image, Input, List, Message } from 'semantic-ui-react'
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
    })
  }

  handleAddOrder = () => {
    this.setState({
      printing: true,
    })
    const { cartItems, total, totalCost, totalQuantity } = this.state
    const { lang, dispatch } = this.props
    dispatch(handleAddOrder({
      cartItems,
      total,
      totalCost,
      totalQuantity
    })).then(res => console.log(res))

    const message = lang === 'EN'
      ? `Do You Want To Clear The Cart After Printing?`
      : `هل تريد افراغ محتويات الفاتورة بعد الطباعة؟`
    if (window.confirm(message)) {
      this.clearCart()
    }
    this.setState({
      printing:false,
    })
  }

  componentDidMount(){
    this.inputRef.focus()
  }

  render() {

    const { theme, lang } = this.props
    const { barcode, searchTerm, cartItems, total, totalQuantity, loading, results, noResults, printing } = this.state
    const myScript = {
      EN:{
        item: 'Item',
        price: 'Price',
        quantity: 'Qty',
        total: 'Total',
        description: 'Description',
        search:{
          barcode: 'Barcode',
          barcodePlaceholder: 'Search By Barcode',
          name: 'Name',
          namePlaceholder: 'Search By Name Or Description',
          noResults: 'Sorry There Are No Products Name or Description Match Or Contain your Search Term',
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
        description: 'الوصف',
        search:{
          barcode: 'باركود',
          barcodePlaceholder: 'البحث بالباركود',
          name: 'الاسم',
          namePlaceholder: 'البحث بالاسم',
          noResults: 'ناسف لا يوجداسم او وصف لمنتجات تطابق او تحتوي على كلمة البحث هذه',
        },
        btns:{
          print: 'طباعة الايصال',
        },
      }
    }
    return (
      <Grid stackable columns={2} celled='internally'>
        <Grid.Row>
          <Grid.Column width={8}>
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
          <Grid.Column width={8}>
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
        <Grid.Row>
          <Grid.Column width={8}>
            <CartToPrint
              lang = {lang}
              theme = {theme}
              cartItems = {cartItems}
              total = {total}
              totalQuantity = {totalQuantity}
              ref = {(el) => this.cartRef = el}
              handleEditQuantity = { this.handleEditQuantity }
              printing = {printing}
              handleAddOrder = {this.handleAddOrder}
              myScript = {myScript[lang].btns.print}
              />
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

export default connect()(NewOrder)
