const LoginReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_LOGIN':
      return {
        ...state,
        mode: action.payload
      }

    default:
      return state
  }
}

export default LoginReducer
