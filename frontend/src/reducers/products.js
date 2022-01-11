import { RECEIVE_PRODUCTS, EDIT_PRODUCT, ADD_PRODUCT, DELETE_PRODUCT } from '../actions/products'

const products = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_PRODUCTS: {
      return {
        ...state,
        ...action.products
      };
    }
    case ADD_PRODUCT: {
      const {product} = action
      return state
    }
    case DELETE_PRODUCT: {
      const {productId} = action
      return state
    }
    case EDIT_PRODUCT: {
      const {product} = action
      return state
    }
    default: {
      return state;
    }
  }
}

export default products
