import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import axios from 'axios'

import Chart from 'react-apexcharts'

import { useSelector } from 'react-redux'

import StatusCard from '../components/status-card/StatusCard'

import MyTable from '../components/table/Table'

import Badge from '../components/badge/Badge'

import statusCards from '../assets/JsonData/status-card-data.json'
import {
  Divider,
  Grid,
  Image,
  Header,
  Label,
  Icon,
  Segment,
  Tab,
  Dropdown,
  Button,
  Form
} from 'semantic-ui-react'
import Table from 'antd/lib/table'
import 'antd/lib/table/style/css'
import { Input } from 'antd'

const Search = Input.Search

function Dashboard () {
  const themeReducer = useSelector(state => state.ThemeReducer.mode)
  const [shippingOrders, setShippingOrders] = useState([])
  const [orders, setOrders] = useState([])

  useEffect(() => {
    axios({
      method: 'GET',
      url: '/api/order-management/orders'
    }).then(res => {
      console.log(res)
      console.log(res.data)
      setOrders(res.data)
    })
  }, [])

  useEffect(() => {
    setShippingOrders(shippingOrders => shippingOrders)
  }, [shippingOrders])
  useEffect(() => {
    setOrders(orders => orders)
  }, [setOrders])

  const tableColumns = [
    {
      title: 'Id',
      dataIndex: 'Id',
      key: 'Id'
    },
    {
      title: 'Ship Id',
      render: (text, record) => <>{record.Ship[0].Id}</>,
      key: 'OrderId'
    },
    {
      title: 'Paid status',
      render: (text, record) => renderSwitch(record.Ship[0].ShipStatus),
      key: 'Paid status'
    }
  ]
  const renderSwitch = param => {
    switch (param) {
      case 'Pending':
        return (
          <Header as='h4' color='green'>
            Pending
          </Header>
        )
      case 'Completed':
        return (
          <Header as='h4' color='red'>
            Completed
          </Header>
        )
      case 'Cancel':
        return (
          <Header as='h4' color='grey'>
            Cancel
          </Header>
        )
      default:
        return 'foo'
    }
  }
  return (
    <div>
      <h2 className='page-header'>Dashboard</h2>
      <div className='row'>
        <div className='col-6'>
          <div className='row'>
            <div className='col-6'>
              <StatusCard
                icon={'bx bx-shopping-bag'}
                count={orders.reduce(
                  (a, v) => (a = a + v.Orderdetails.length),
                  0
                )}
                title={'Total sell'}
              />
            </div>
            <div className='col-6'>
              <StatusCard
                icon={'bx bx-dollar-circle'}
                count={orders.reduce((a, v) => (a = a + v.TotalPrice), 0)}
                title={'Revenue'}
              />
            </div>
            <div className='col-6'>
              <StatusCard
                icon={'bx bx-receipt'}
                count={orders.length}
                title={'Revenue'}
              />
            </div>
          </div>
        </div>

        <div className='col-8'>
          <div className='card'>
            <div className='card__header'>
              <h3>Shipping orders</h3>
            </div>
            <div className='card__body'>
              <Table dataSource={orders} columns={tableColumns} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
