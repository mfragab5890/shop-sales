import { login, logout } from '../utils/api'
import { showLoading, hideLoading } from 'react-redux-loading'

export const SET_AUTHED_USER = 'SET_AUTHED_USER'
export const RESET_AUTHED_USER = 'RESET_AUTHED_USER'

export const setAuthedUser = (authedUser) => {
  return {
    type : SET_AUTHED_USER,
    authedUser,
  };
}

export const resetAuthedUser = () => {
  return { type : RESET_AUTHED_USER, };
}

export const handleUserLogin = (username,password) => {
  return (dispatch) => {
    dispatch(showLoading())
    return login(username, password)
      .then((authedUser) => {
        dispatch(setAuthedUser(authedUser))
        dispatch(hideLoading())
        return true;
      }).catch(err => {
        dispatch(resetAuthedUser())
        dispatch(hideLoading())
        return false;
      })
  };
}

export const handleUserLogout = () => {
  return (dispatch) => {
    dispatch(showLoading())
    return logout().then((res) => {
      dispatch(resetAuthedUser())
      dispatch(hideLoading())
      return res;
    })
  };
}
