import { saveNewUser, getAllUsers, editUser, removeUser } from '../utils/api'
import { showLoading, hideLoading } from 'react-redux-loading'
import { setAuthedUser, resetAuthedUser } from './authedUser'
//handle users action creator

export const RECEIVE_USERS = 'RECEIVE_USERS'
export const ADD_USER = 'ADD_USER'
export const EDIT_USER = 'EDIT_USER'
export const DELETE_USER = 'DELETE_USER'
export const RESET_USERS = 'RESET_USERS'

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

export const modifyUser = (user) => {
  return {
    type : EDIT_USER,
    user,
  };
}

export const deleteUser = (userId) => {
  return {
    type : DELETE_USER,
    userId,
  };
}

export const resetUsers = () => {
  return {
    type : RESET_USERS,
  };
}

export const handleGetAllUsers = () => {
  return (dispatch) => {
    dispatch(showLoading())
    return getAllUsers()
      .then((res) => {
        if (res.success) {
          dispatch(receiveUsers(res.users))
        }
        dispatch(hideLoading())
        return true;
      }).catch(err => {
        dispatch(resetUsers())
        dispatch(hideLoading())
        return false;
      })
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

export const handleEditUser = (user) => {
  return (dispatch) => {
    dispatch(showLoading())
    return editUser(user)
      .then((res) => {
        if (res.success) {
          const { editedUser } = res
          dispatch(modifyUser(editedUser))
        }
        dispatch(hideLoading())
        return true;
      }).catch(err => {
        dispatch(hideLoading())
        console.warn('user edit error: ', err);
        return false;
      })
  };
}

export const handleDeleteUser = (userId) => {
  return (dispatch) => {
    dispatch(showLoading())
    return removeUser(userId)
      .then((res) => {
        if (res.success) {
          dispatch(deleteUser(userId))
        }
        dispatch(hideLoading())
        return true;
      }).catch(err => {
        dispatch(resetAuthedUser())
        dispatch(hideLoading())
        return false;
      })
  };
}
