import { RECEIVE_PRODUCTS, EDIT_PRODUCT, ADD_PRODUCT, DELETE_PRODUCT, RESET_PRODUCTS } from '../actions/products'

const products = (state = {products:[], pages:0 }, action) => {
  switch (action.type) {
    case RECEIVE_PRODUCTS: {
      return {
        ...state,
        ...action.data,
      };
    }
    case ADD_PRODUCT: {
      const {product} = action
      return {
        ...state,
        products: [product].concat(state.products),
      }
    }
    case DELETE_PRODUCT: {
      const {productId} = action
      return {
        ...state,
        products: state.products.filter((item) => item.id !== productId),
      }
    }
    case EDIT_PRODUCT: {
      const {product} = action
      const products= state.products.map((item) => {
        if (item.id === product.id) {
          return product;
        }
        else {
          return item;
        }
      })
      return {
        ...state,
        products
      }
    }
    case RESET_PRODUCTS: {
      return {
        products:[],
        pages:0,
      };
    }
    default: {
      return state;
    }
  }
}

export default products
