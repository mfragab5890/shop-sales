import React, { Component } from 'react'
import { Segment, Card, Input, Pagination, Message, Header } from 'semantic-ui-react'
import ProductView from './ProductView'
import { connect } from 'react-redux'
import { handleReceiveProducts } from '../actions/products'
import { searchProducts } from '../utils/api'

class AllProducts extends Component {
  state = {
    page: 1,
    searchTerm: '',
    loading: false,
    results: [],
    noResults: false,
    deleted: ''
  }

  onSearchTermChange = (e) => {
    const { value } = e.target
    if (value === '') {
      return this.setState((prevState) => {
              return {
                searchTerm: value,
                loading: false,
                typing: clearTimeout(prevState.typing),
                results: [],
                noResults: false,
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
    if (searchTerm === '') {
      return await this.setState({
        loading: false,
        results: [],
        noResults: false
      });
    }
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
    const { dispatch } = this.props
    const results  = await dispatch(handleReceiveProducts(activePage))
    await this.setState({
      products: results.products,
      page: activePage
    })
  }

  confirmDelete = (productId,message) => {
    this.setState({
      deleted: message + '-ID: ' + productId ,
    })
    setTimeout(() => this.setState({
      deleted: ''
    }), 3000)
  }

  render() {

    const { theme, lang, products, pages } = this.props
    const { page, searchTerm, loading, results, noResults, deleted } = this.state
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
        {
          deleted !== '' &&
          <Message success>
            <Message.Header>{deleted}</Message.Header>
          </Message>
        }
        <Pagination
          activePage={page}
          onPageChange={this.handlePaginationChange}
          totalPages={pages}
          disabled = {pages < 2 || results.length > 0 ? true : false}
        />
        <br/>
        <br/>

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
                ? results.map((product) =>
                    <ProductView
                      key = {product.id}
                      product = {product}
                      theme = {theme}
                      lang = {lang}
                      confirmDelete = {this.confirmDelete}
                    />
                  )
                : products.map((product) =>
                    <ProductView
                      key = {product.id}
                      product = {product}
                      theme = {theme}
                      lang = {lang}
                      confirmDelete = {this.confirmDelete}
                    />
                  )
              }
            </Card.Group>
          )
        }
        <br/>
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

const mapStateToProps = ({products}) => {
  return {
    ...products
  };
}

export default connect(mapStateToProps)(AllProducts)
