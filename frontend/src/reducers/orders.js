import { RECEIVE_ORDERS, EDIT_ORDER, ADD_ORDER, DELETE_ORDER } from '../actions/orders'

const orders = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_ORDERS: {
      return {
        ...state,
        ...action.orders
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
