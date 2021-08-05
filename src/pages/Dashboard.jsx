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
    axios({
      method: 'GET',
      url: '/api/ship-management'
    }).then(res => {
      console.log(res)
      console.log(res.data)
      setShippingOrders(res.data)
    })
  }, [])
  useEffect(() => {
    axios({
      method: 'GET',
      url: '/api/ship-management'
    }).then(res => {
      console.log(res)
      console.log(res.data)
      setShippingOrders(res.data)
    })
  }, [])

  useEffect(() => {
    setShippingOrders(shippingOrders => shippingOrders)
  }, [shippingOrders])
  useEffect(() => {
    setOrders(orders => orders)
  }, [setOrders])

  const onUpdate = (Id, OrderId) => {
    const ship = {
      Id: Id,
      OrderId: OrderId,
      CompanyName: 'FPT',
      ShipStatus: 'Completed'
    }
    axios({
      method: 'put',
      url: '/api/ship-management',
      data: ship
    }).then(res => {
      console.log(res)
      axios({
        method: 'GET',
        url: '/api/ship-management'
      }).then(res => {
        console.log(res)
        console.log(res.data)
        setShippingOrders(res.data)
      })
    })
  }
  const tableColumns = [
    {
      title: 'Id',
      dataIndex: 'Id',
      key: 'Id'
    },
    {
      title: 'OrderId',
      dataIndex: 'OrderId',
      key: 'OrderId'
    },
    {
      title: 'Paid status',
      render: (text, record) =>
        record.Status === 'Pending' ? (
          <Header as='h4' color='green'>
            Pending
          </Header>
        ) : (
          <Header as='h4' color='red'>
            Complete
          </Header>
        ),

      key: 'Paid status'
    },

    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type='primary'
          onClick={() => onUpdate(record.Id, record.OrderId)}
        >
          Action
        </Button>
      )
    }
  ]

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
              <Table dataSource={shippingOrders} columns={tableColumns} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
