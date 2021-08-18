import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import Products from '../pages/Products'
import Categories from '../pages/Categories'
import Orders from '../pages/Orders'
import Login from '../pages/Login'
import Color from '../pages/Color'
import Size from '../pages/Size'
import Tag from '../pages/Tag'

const Routes = () => {
  return (<>
    
      {/* <Route path='/' exact component={Login} /> */}

      <Route path='/dashboard' component={Dashboard} />
      <Route path='/customers' component={Customers} />
      <Route path='/products' component={Products} />
      <Route path='/orders' component={Orders} />

      <Route path='/categories' component={Categories} />
      <Route path='/colors' component={Color} />
      <Route path='/sizes' component={Size} />

      <Route path='/tags' component={Tag} />
   </>
  )
}

export default Routes
