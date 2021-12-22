import React, { Component } from 'react'
import { Segment, Card } from 'semantic-ui-react'
import { getAllProducts } from '../utils/api'
import ProductView from './ProductView'

export default class AllProducts extends Component {
  state = {
    page: 1,
    products: []
  }

  componentDidMount = async () => {
    const products_obj  = await getAllProducts()
    const products = products_obj.products
    await this.setState({
      products: products
    })
  }

  onPageChange = () => {
    const { page } = this.state
    const products  = getAllProducts(page)
    this.setState({
      products: products
    })
  }

  render() {

    const { theme, lang } = this.props
    const { page, products } = this.state
    const myScript = {}
    return (
      <Segment>
        View All Products
        <Card.Group itemsPerRow={3}>
          {
            products.map((product) => <ProductView key = {product.id} product = {product} theme = {theme}/>)
          }
        </Card.Group>
      </Segment>
    )
  }
}
