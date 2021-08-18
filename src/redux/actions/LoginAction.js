const setLogin = mode => {
  console.log(mode)

  return {
    type: 'SET_LOGIN',
    payload: mode
  }
}

const getLogin = () => {
  return {
    type: 'GET_LOGIN'
  }
}

const LoginAction = {
  setLogin,
  getLogin
}

export default LoginAction
