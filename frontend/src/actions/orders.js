//handle orders action creator
export const RECEIVE_ORDERS = 'RECEIVE_ORDERS'
export const ADD_ORDER = 'ADD_ORDER'
export const DELETE_ORDER = 'DELETE_ORDER'
export const EDIT_ORDER = 'EDIT_ORDER'

export const receiveOrders = (orders) => {
  return {
    type : RECEIVE_ORDERS,
    orders,
  };
}

export const addOrder = (order) => {
  return {
    type : ADD_ORDER,
    order,
  };
}

export const deleteOrder = (orderId) => {
  return {
    type : DELETE_ORDER,
    orderId,
  };
}

export const editOrder = (order) => {
  return {
    type : EDIT_ORDER,
    order,
  };
}
