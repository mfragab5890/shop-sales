import React, { Component } from 'react'
import { Segment, Card } from 'semantic-ui-react'
import { getAllProducts } from '../utils/api'
import ProductView from './ProductView'

export default class AllProducts extends Component {
  state = {
    page: 1,
  }

  componentDidMount = async () => {
  }

  onPageChange = () => {
    const { page } = this.state
    const products  = getAllProducts(page)
    this.setState({
      products: products
    })
  }

  render() {

    const { theme, lang, products } = this.props
    const { page } = this.state
    const myScript = {}
    return (
      <Segment>
        View All Products
        <Card.Group itemsPerRow={3}>
          {
            products.map((product) => <ProductView key = {product.id} product = {product} theme = {theme} lang = {lang}/>)
          }
        </Card.Group>
      </Segment>
    )
  }
}
