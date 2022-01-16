import { getPageProducts } from '../utils/api'
import { showLoading, hideLoading } from 'react-redux-loading'

//handle products action creator
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS'
export const ADD_PRODUCT = 'ADD_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const EDIT_PRODUCT = 'EDIT_PRODUCT'

export const receiveProducts = (data) => {
  return {
    type : RECEIVE_PRODUCTS,
    data,
  };
}

export const addProduct = (product) => {
  return {
    type : ADD_PRODUCT,
    product,
  };
}

export const deleteProduct = (productId) => {
  return {
    type : DELETE_PRODUCT,
    productId,
  };
}

export const editProduct = (product) => {
  return {
    type : EDIT_PRODUCT,
    product,
  };
}

export const handleReceiveProducts = (page) => {
  return async (dispatch) => {
    dispatch(showLoading())
    return getPageProducts(page).then(res => {
      if (res.success) {
        const { products, pages } = res
        dispatch(receiveProducts({products,pages}))
      }
      else {
        dispatch(receiveProducts({ products: [], pages:0 }))
      }
      dispatch(hideLoading())
    }).catch(err => {
      console.warn(err);
      return dispatch(hideLoading())

    })

  }
}
