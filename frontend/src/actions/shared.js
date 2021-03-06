import { getInitialData, getTodayOrders, getMonthOrders, getPageProducts, getUserTodayOrders, getAllUsers } from '../utils/api'
import { receiveProducts } from '../actions/products'
import { receiveMonthOrders, receiveTodayOrders, receiveUserTodayOrders } from '../actions/orders'
import { setAuthedUser} from '../actions/authedUser'
import { receiveUsers } from '../actions/users'
import { showLoading, hideLoading } from 'react-redux-loading'
import { removeToken } from '../utils/token'


export const handleInitialData = () => {
  return async (dispatch) => {
    dispatch(showLoading())
    return getInitialData()
      .then(async (res) => {
        if (res.success) {
          const { authed_user } = res
          const { users } = await getAllUsers().then(res => {
            if (res.success) {
              return res;
            }
            else {
              return {
                users: [],
              };
            }
          }).catch(err => {
            console.warn(err);
            return {
              users: [],
            };
          })

          const {products, pages} = await getPageProducts().then(res => {
            if (res.success) {
              return res;
            }
            else {
              return {
                products: [],
                pages:0,
              };
            }
          }).catch(err => {
            console.warn(err);
            return {
              products: [],
              pages:0,
            };
          })
          const monthSales =  await getMonthOrders().then(res => {
            if (res.success) {
              return res.orders;
            }
            else {
              console.warn('Month Sales Error: ',res);
              return [];
            }
          }).catch(err => {
            console.warn(err);
            return [];
          })
          const todaySales =  await getTodayOrders().then(res => {
            if (res.success) {
              return res.orders;
            }
            else {
              console.warn('Today Sales Error: ',res.message);
              return [];
            }
          }).catch(err => {
            console.warn(err);
            return [];
          })
          const userTodaySales =  await getUserTodayOrders().then(res => {
            if (res.success) {
              return res.orders;
            }
            else {
              console.warn('User Today Sales Error: ',res.message);
              return [];
            }
          }).catch(err => {
            console.warn(err);
            return [];
          })
          dispatch(setAuthedUser(authed_user))
          dispatch(receiveUsers(users))
          dispatch(receiveProducts({products,pages}))
          dispatch(receiveMonthOrders(monthSales))
          dispatch(receiveTodayOrders(todaySales))
          dispatch(receiveUserTodayOrders(userTodaySales))
        }
        else {
          console.warn(res);
          removeToken()
        }
        dispatch(hideLoading())
        return res;
      }).catch(err => {
        console.warn(err);
        removeToken()
        dispatch(hideLoading())
        return err;
      })
  };
}
export const handleInitialDataAfterLogin = () => {
  return async (dispatch) => {
    dispatch(showLoading())
    return getInitialData()
      .then(async (res) => {
        if (res.success) {
          const { users } = await getAllUsers().then(res => {
            if (res.success) {
              return res;
            }
            else {
              return {
                users: [],
              };
            }
          }).catch(err => {
            console.warn(err);
            return {
              users: [],
            };
          })

          const {products, pages} = await getPageProducts().then(res => {
            if (res.success) {
              return res;
            }
            else {
              return {
                products: [],
                pages:0,
              };
            }
          }).catch(err => {
            console.warn(err);
            return {
              products: [],
              pages:0,
            };
          })
          const monthSales =  await getMonthOrders().then(res => {
            if (res.success) {
              return res.orders;
            }
            else {
              console.warn('Month Sales Error: ',res);
              return [];
            }
          }).catch(err => {
            console.warn(err);
            return [];
          })
          const todaySales =  await getTodayOrders().then(res => {
            if (res.success) {
              return res.orders;
            }
            else {
              console.warn('Today Sales Error: ',res.message);
              return [];
            }
          }).catch(err => {
            console.warn(err);
            return [];
          })
          const userTodaySales =  await getUserTodayOrders().then(res => {
            if (res.success) {
              return res.orders;
            }
            else {
              console.warn('User Today Sales Error: ',res.message);
              return [];
            }
          }).catch(err => {
            console.warn(err);
            return [];
          })
          dispatch(receiveUsers(users))
          dispatch(receiveProducts({products,pages}))
          dispatch(receiveMonthOrders(monthSales))
          dispatch(receiveTodayOrders(todaySales))
          dispatch(receiveUserTodayOrders(userTodaySales))
        }
        else {
          console.warn(res);
          removeToken()
          return res;
        }
        dispatch(hideLoading())
      }).catch(err => {
        console.warn(err);
        removeToken()
        dispatch(hideLoading())
        return err;
      })
  };
}
