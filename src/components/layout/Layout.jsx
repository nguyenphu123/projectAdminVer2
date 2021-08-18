import React, { useEffect, useState } from 'react'

import './layout.css'

import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import Routes from '../Routes'

import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import 'semantic-ui-css/semantic.min.css'
import Login from '../../pages/Login'

import ThemeAction from '../../redux/actions/ThemeAction'
import LoginAction from '../../redux/actions/LoginAction'

const Layout = () => {
  const themeReducer = useSelector(state => state.ThemeReducer)
  const loginReducer = useSelector(state => state.LoginReducer)
  console.log(loginReducer)
  console.log(localStorage.getItem('isLoggedin'))

  const dispatch = useDispatch()
  const [isLoggedin, setIsLoggedin] = useState(false)
  useEffect(() => {
    const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')

    const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')

    dispatch(ThemeAction.setMode(themeClass))

    dispatch(ThemeAction.setColor(colorClass))
  }, [dispatch])

  return (
    <BrowserRouter>
      <Route
        render={props => (
          <Switch>
            <Route path='/' exact component={Login} />

            <div
              className={`layout ${themeReducer.mode} ${themeReducer.color}`}
            >
              <Sidebar {...props} />
              <div className='layout__content'>
                <TopNav />
                <div className='layout__content-main'>
                  <Routes />
                </div>
              </div>
            </div>
          </Switch>
        )}
      />
    </BrowserRouter>
  )
}

export default Layout
