import { login, logout } from '../utils/api'
import { showLoading, hideLoading } from 'react-redux-loading'
import { removeToken } from '../utils/token'
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

export const handleUserLogin = (username,password,remember=false) => {
  return (dispatch) => {
    dispatch(showLoading())
    return login(username, password, remember)
      .then((data) => {
        if (data.success === true) {
          const {authed_user} = data
          dispatch(setAuthedUser(authed_user))
          dispatch(hideLoading())
          return true;
        }
        else {
          dispatch(hideLoading())
          return data;
        }
      }).catch(err => {
        console.warn('Login Error: ' , err);
        removeToken()
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
      removeToken()
      dispatch(resetAuthedUser())
      dispatch(hideLoading())
      return res;
    })
  };
}
