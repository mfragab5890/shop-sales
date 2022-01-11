import { RECEIVE_USERS, ADD_USER, ADD_ANSWER, ADD_QUESTION } from '../actions/users'

const users = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_USERS:
      return {
        ...state,
        ...action.users
      };
    case ADD_USER:
      const {user} = action
      return {
        ...state,
        [user.id] : { ...user },
      };
    case ADD_QUESTION:
      const {question} = action
      return {
        ...state,
        [question.author] : {
          ...state[question.author],
          questions : state[question.author].questions.concat(question.id),
        },
      };
    case ADD_ANSWER:
    const {qId, answer, authedUser} = action.info
    return{
      ...state,
      [authedUser] : {
        ...state[authedUser],
        answers : {
          ...state[authedUser].answers,
          [qId] : answer,
        }
      }
    }
    default:
      return state;
  }
}

export default users
