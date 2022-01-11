import { combineReducers } from 'redux'
import authedUser from './authedUser'
import users from './users'
import products from './products'
import orders from './orders'
import {loadingBarReducer} from 'react-redux-loading'

export default combineReducers({

  authedUser,
  users,
  products,
  orders,
  loadingBar: loadingBarReducer,

})
