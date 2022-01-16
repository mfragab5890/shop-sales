import {
  RECEIVE_TODAY_ORDERS,
  RECEIVE_MONTH_ORDERS,
  RECEIVE_USER_TODAY_ORDERS,
  EDIT_ORDER,
  ADD_ORDER,
  DELETE_ORDER
} from '../actions/orders'

const orders = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_MONTH_ORDERS: {
      const { monthSales } = action
      return {
        ...state,
        monthSales,
      };
    }
    case RECEIVE_TODAY_ORDERS: {
      const { todaySales } = action
      return {
        ...state,
        todaySales,
      };
    }
    case RECEIVE_USER_TODAY_ORDERS: {
      const { userTodaySales } = action
      return {
        ...state,
        userTodaySales
      };
    }
    case ADD_ORDER: {
      const {order} = action
      return state
    }
    case DELETE_ORDER: {
      const {orderId} = action
      return state
    }
    case EDIT_ORDER: {
      const {order} = action
      return state
    }
    default: {
      return state;
    }
  }
}

export default orders
