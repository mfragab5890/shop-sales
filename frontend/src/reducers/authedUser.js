import {SET_AUTHED_USER, RESET_AUTHED_USER} from '../actions/authedUser'

const authedUser = (state = null, action) => {
  switch (action.type) {
    case SET_AUTHED_USER:
      return action.authedUser;
    case RESET_AUTHED_USER:
      return null;
    default:
      return state;
  }
}

export default authedUser
