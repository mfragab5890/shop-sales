import React, { Component } from 'react'
import { Segment, Card, Input, Pagination, Message, Header } from 'semantic-ui-react'
import { getAllProducts, searchProducts } from '../utils/api'
import ProductView from './ProductView'

export default class AllProducts extends Component {
  state = {
    page: 1,
    searchTerm: '',
    loading: false,
    products:[],
    pages:0,
    results: [],
    noResults: false
  }

  componentDidMount(){
    const { pages, products } = this.props
    this.setState({
      products: products,
      pages: pages
    })
  }
  onSearchTermChange = (e) => {
    const { value } = e.target
    if (value === '') {
      return this.setState((prevState) => {
              return {
                searchTerm: value,
                loading: false,
                typing: clearTimeout(prevState.typing),
                results: []
              };
            })
    }
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
    const results = await searchProducts(searchTerm)
    if (results.products.length < 1) {
      return await this.setState({
        loading: false,
        results: [],
        noResults: true
      });
    }
    await this.setState({
      loading: false,
      results: results.products,
      noResults: false
    })
  }

  handlePaginationChange = async (e, { activePage }) => {
    const results  = await getAllProducts(activePage)
    await this.setState({
      products: results.products,
      page: activePage
    })
  }

  render() {

    const { theme, lang } = this.props
    const { page, searchTerm, loading, results, products, pages, noResults } = this.state
    const myScript = {
      EN: {
        header: 'Viewing All Products',
        results: 'Viewing Results for: ',
        noResults: {
          header: 'Sorry This Search Returned No Results',
          message: 'Please try again using diffrent search term'
        },
      },
      AR: {
        header: 'مشاهدة جميع المنتجات',
        results: 'يتم عرض نتائج البحث لكلمة: ',
        noResults: {
          header: 'عفوا لا يوجد نتائج بحث',
          message: 'يرجى المحاولة مرة اخرى باستخدام كلمة بحث مختلفة'
        },
      }

    }
    return (
      <Segment>
        <Segment inverted>
          <Input
            icon='search'
            fluid
            inverted
            loading = {loading}
            value = {searchTerm}
            onChange = {this.onSearchTermChange}
            placeholder= {'Search'}
            floated = {'right'}
          />
          <Header>
            {!noResults && results.length<1 ? myScript[lang].header : `${myScript[lang].results}${searchTerm}`}
          </Header>
        </Segment>
        <Pagination
          activePage={page}
          onPageChange={this.handlePaginationChange}
          totalPages={pages}
          disabled = {pages < 2 || results.length > 0 ? true : false}
        />
        {
          noResults
          ? (
            <Message warning>
              <Message.Header>{myScript[lang].noResults.header}</Message.Header>
              <p>
                {myScript[lang].noResults.message}
              </p>
            </Message>
          )
          : (
            <Card.Group itemsPerRow={3}>
              {
                results.length > 0
                ? results.map((product) => <ProductView key = {product.id} product = {product} theme = {theme} lang = {lang}/>)
                : products.map((product) => <ProductView key = {product.id} product = {product} theme = {theme} lang = {lang}/>)
              }
            </Card.Group>
          )
        }
        <Pagination
          activePage={page}
          onPageChange={this.handlePaginationChange}
          totalPages={pages}
          disabled = {pages < 2 || results.length > 0 ? true : false}
        />
      </Segment>
    )
  }
}
