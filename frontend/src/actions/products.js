import { getPageProducts, removeProduct, addNewProduct, editOldProduct } from '../utils/api'
import { showLoading, hideLoading } from 'react-redux-loading'

//handle products action creator
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS'
export const ADD_PRODUCT = 'ADD_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const EDIT_PRODUCT = 'EDIT_PRODUCT'
export const RESET_PRODUCTS = 'RESET_PRODUCTS'

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
export const resetProducts = () => {
  return {
    type : RESET_PRODUCTS,
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
      dispatch(hideLoading())
      return err;
    })

  }
}

export const handleAddProduct = (product, authedId) => {
  return async (dispatch) => {
    dispatch(showLoading())
    return addNewProduct(product, authedId).then(res => {
      if (res.success) {
        const { newProduct } = res
        dispatch(addProduct(newProduct))
      }
      dispatch(hideLoading())
      return res;
    }).catch(err => {
      console.warn(err);
      dispatch(hideLoading())
      return err;
    })
  }
}

export const handleEditProduct = (product, authedId) => {
  return async (dispatch) => {
    dispatch(showLoading())
    return editOldProduct(product,authedId).then(res => {
      if (res.success) {
        dispatch(editProduct(product))
      }
      dispatch(hideLoading())
      return res;
    }).catch(err => {
      console.warn(err);
      dispatch(hideLoading())
      return err;
    })

  }
}

export const handleDeleteProduct = (productId) => {
  return async (dispatch) => {
    dispatch(showLoading())
    return removeProduct(productId).then(res => {
      if (res.success) {
        dispatch(deleteProduct(productId))
      }
      dispatch(hideLoading())
      return res;
    }).catch(err => {
      console.warn(err);
      dispatch(hideLoading())
      return err;
    })

  }
}
