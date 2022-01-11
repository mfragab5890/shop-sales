//handle products action creator
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS'
export const ADD_PRODUCT = 'ADD_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const EDIT_PRODUCT = 'EDIT_PRODUCT'

export const receiveProducts = (products) => {
  return {
    type : RECEIVE_PRODUCTS,
    products,
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
