import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import Products from '../pages/Products'
import Categories from '../pages/Categories'
import Orders from '../pages/Orders'
import Login from '../pages/Login'

const Routes = () => {
  return (
    <Switch>
      <Route path='/' exact component={Login} />

      <Route path='/dashboard' component={Dashboard} />
      <Route path='/customers' component={Customers} />
      <Route path='/products' component={Products} />
      <Route path='/orders' component={Orders} />

      <Route path='/categories' component={Categories} />
    </Switch>
  )
}

export default Routes
