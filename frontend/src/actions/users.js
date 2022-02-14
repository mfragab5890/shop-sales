import { addNewUser, getAllUsers, editUser, removeUser } from '../utils/api'
import { showLoading, hideLoading } from 'react-redux-loading'
import { resetAuthedUser } from './authedUser'
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

export const handleAddUser = (newUser) => {
  return (dispatch) => {
    dispatch(showLoading())
    return addNewUser(newUser)
      .then((res) => {
        if (res.success) {
          const { user } = res
          dispatch(addUser(user))
          dispatch(hideLoading())
          return res;
        }
        else {
          dispatch(hideLoading())
          return res;
        }
      }).catch(err => {
        console.warn('While Adding New user Error Raised: ', err );
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
        return res;
      }).catch(err => {
        dispatch(hideLoading())
        console.warn('user edit error: ', err);
        return err;
      })
  };
}

export const handleDeleteUser = (userId, authedId) => {
  return (dispatch) => {
    dispatch(showLoading())
    return removeUser(userId)
      .then((res) => {
        if (res.success) {
          dispatch(deleteUser(userId))
          if (userId === authedId) {
            dispatch(resetAuthedUser())
          }
        }
        dispatch(hideLoading())
        return true;
      }).catch(err => {
        dispatch(hideLoading())
        return false;
      })
  };
}
