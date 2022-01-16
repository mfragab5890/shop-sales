//handle orders action creator
export const RECEIVE_TODAY_ORDERS = 'RECEIVE_TODAY_ORDERS'
export const RECEIVE_MONTH_ORDERS = 'RECEIVE_MONTH_ORDERS'
export const RECEIVE_USER_TODAY_ORDERS = 'RECEIVE_USER_TODAY_ORDERS'
export const ADD_ORDER = 'ADD_ORDER'
export const DELETE_ORDER = 'DELETE_ORDER'
export const EDIT_ORDER = 'EDIT_ORDER'

export const receiveMonthOrders = (monthSales) => {
  return {
    type : RECEIVE_MONTH_ORDERS,
    monthSales,
  };
}

export const receiveTodayOrders = (todaySales) => {
  return {
    type : RECEIVE_TODAY_ORDERS,
    todaySales,
  };
}

export const receiveUserTodayOrders = (userTodaySales) => {
  return {
    type : RECEIVE_USER_TODAY_ORDERS,
    userTodaySales,
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
