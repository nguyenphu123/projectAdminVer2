import ThemeReducer from './ThemeReducer'
import { combineReducers } from 'redux'
import LoginReducer from './LoginReducer'

const rootReducer = combineReducers({ ThemeReducer, LoginReducer })

export default rootReducer
