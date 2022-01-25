import {
  RECEIVE_TODAY_ORDERS,
  RECEIVE_MONTH_ORDERS,
  RECEIVE_USER_TODAY_ORDERS,
  EDIT_ORDER,
  ADD_ORDER,
  DELETE_ORDER,
  RESET_ORDERS
} from '../actions/orders'

const orders = (state = {monthSales: [], todaySales : [], userTodaySales : []}, action) => {
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

      return {
        ...state,
        monthSales: [order].concat(state.monthSales),
        todaySales: [order].concat(state.todaySales),
        userTodaySales: [order].concat(state.userTodaySales),
      }
    }
    case DELETE_ORDER: {
      const {orderId} = action
      return {
        ...state,
        monthSales: state.monthSales.filter((order) => order.id !== orderId),
        todaySales: state.todaySales.filter((order) => order.id !== orderId),
        userTodaySales: state.userTodaySales.filter((order) => order.id !== orderId),
      }
    }
    case EDIT_ORDER: {
      const {order} = action
      const monthSales = state.monthSales.map((item) => {
        if (item.id === order.id) {
          return order;
        }
        else {
          return item;
        }
      })
      const todaySales = state.todaySales.map((item) => {
        if (item.id === order.id) {
          return order;
        }
        else {
          return item;
        }
      })
      const userTodaySales = state.userTodaySales.map((item) => {
        if (item.id === order.id) {
          return order;
        }
        else {
          return item;
        }
      })
      return {
        ...state,
        monthSales,
        todaySales,
        userTodaySales,
      }
    }
    case RESET_ORDERS: {
      return {
      monthSales: [],
      todaySales : [],
      userTodaySales : [],
      };
    }
    default: {
      return state;
    }
  }
}

export default orders
