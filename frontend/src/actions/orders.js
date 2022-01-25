import { showLoading, hideLoading } from 'react-redux-loading'
import { addNewOrder, deleteOrder } from '../utils/api'

//handle orders action creator
export const RECEIVE_TODAY_ORDERS = 'RECEIVE_TODAY_ORDERS'
export const RECEIVE_MONTH_ORDERS = 'RECEIVE_MONTH_ORDERS'
export const RECEIVE_USER_TODAY_ORDERS = 'RECEIVE_USER_TODAY_ORDERS'
export const ADD_ORDER = 'ADD_ORDER'
export const DELETE_ORDER = 'DELETE_ORDER'
export const EDIT_ORDER = 'EDIT_ORDER'
export const RESET_ORDERS = 'RESET_ORDERS'

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

export const removeOrder = (orderId) => {
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
export const resetOrders = () => {
  return {
    type : RESET_ORDERS,
  };
}

export const handleAddOrder = (order) => {
  return (dispatch) => {
    dispatch(showLoading())
    let orderId = null
    return addNewOrder(order)
      .then((data) => {
        if (data.success === true) {
          const {order} = data
          orderId = order.id
          dispatch(addOrder(order))
          dispatch(hideLoading())
          return true;
        }
        else {
          dispatch(hideLoading())
          return data;
        }
      }).catch(err => {
        console.warn('Add Order Error: ' , err);
        dispatch(removeOrder(orderId))
        dispatch(hideLoading())
        return err;
      })
  };
}

export const handleDeleteOrder = (orderId) => {
  return (dispatch) => {
    dispatch(showLoading())
    return deleteOrder(orderId)
      .then((data) => {
        if (data.success === true) {
          dispatch(removeOrder(orderId))
          dispatch(hideLoading())
          return data;
        }
        else {
          dispatch(hideLoading())
          return data;
        }
      }).catch(err => {
        console.warn('Remove Order Error: ' , err);
        dispatch(hideLoading())
        return err;
      })
  };
}
