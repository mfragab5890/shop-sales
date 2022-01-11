import { saveNewUser } from '../utils/api'
import { showLoading, hideLoading } from 'react-redux-loading'
import { setAuthedUser, resetAuthedUser } from './authedUser'
//handle users action creator

export const RECEIVE_USERS = 'RECEIVE_USERS'
export const ADD_USER = 'ADD_USER'
export const ADD_QUESTION = 'ADD_QUESTION'
export const ADD_ANSWER = 'ADD_ANSWER'

export const receiveUsers = (users) => {
  return {
    type : RECEIVE_USERS,
    users,
  };
}

export const addUser = (user) => {
  return {
    type : ADD_USER,
    user,
  };
}

export const handleSaveNewUser = (user ) => {
  return (dispatch) => {
    dispatch(showLoading())
    return saveNewUser(user)
      .then((authedUser) => {
        dispatch(addUser(authedUser))
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
