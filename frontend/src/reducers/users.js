import { RECEIVE_USERS, ADD_USER, EDIT_USER, DELETE_USER, RESET_USERS } from '../actions/users'

const users = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_USERS: {
      const { users } = action
      return users
    }
    case ADD_USER: {
      const {user} = action
      return state.concat([user])
    }
    case DELETE_USER: {
      const {userId} = action
      return state.filter((item) => item.id !== userId)
    }
    case EDIT_USER: {
      const {user} = action
      return state.map((item) => {
        if (item.id === user.id) {
          return user;
        }
        else {
          return item;
        }
      })
    }
    case RESET_USERS: {
      return []
    }
    default: {
      return state;
    }
  }
}

export default users
