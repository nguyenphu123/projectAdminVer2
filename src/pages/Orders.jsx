import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from 'react-awesome-modal'
import NumberFormat from 'react-number-format'
import MyTable from '../components/table/Table'
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

class Orders extends React.Component {
  constructor () {
    super()

    this.state = {
      Orders: []
    }
  }
  onUpdate = item => {
    const order = {
      Id: item.Id,
      UserId: item.UserId,
      TotalPrice: item.TotalPrice,
      AddressShipping: item.AddressShipping,
      Phone: item.Phone,
      Date: item.Date,
      Status: true
      // OrderDetails: item.Orderdetails,
      // Ship: item.Ship
    }
    axios({
      method: 'put',
      url: '/api/order-management/users/orders',
      data: order
    }).then(res => {
      console.log(res)
      axios({
        method: 'GET',
        url: '/api/order-management/orders'
      }).then(res => {
        console.log(res)
        console.log(res.data)
        this.setState({
          Orders: res.data
        })
      })
    })
  }

  componentWillMount () {
    axios({
      method: 'GET',
      url: '/api/order-management/orders'
    }).then(res => {
      console.log(res)
      console.log(res.data)
      this.setState({
        Orders: res.data
      })
    })
  }
  handleSearch = searchText => {
    const filteredEvents = this.state.Orders.filter(({ AddressShipping }) => {
      AddressShipping = AddressShipping.toLowerCase()
      return AddressShipping.includes(searchText.toLowerCase())
    })

    this.setState({
      Orders: filteredEvents
    })
  }

  render () {
    const tableColumns = [
      {
        title: 'Id',
        dataIndex: 'Id',
        key: 'Id'
      },
      {
        title: 'Date',
        dataIndex: 'Date',
        key: 'Date'
      },
      {
        title: 'Total',
        render: (text, record) => (
          <NumberFormat
            value={record.TotalPrice}
            className='foo'
            displayType={'text'}
            thousandSeparator={true}
            prefix={''}
            renderText={(value, props) => <div {...props}>{value}VND</div>}
          />
        ),

        key: 'Total',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.Total - b.Total
      },
      {
        title: 'Number of products',
        render: (text, record) => <h4>{record.Orderdetails.length}</h4>,
        key: 'Number of products'
      },
      {
        title: 'address',
        dataIndex: 'AddressShipping',
        key: 'address'
      },
      {
        title: 'Paid status',
        render: (text, record) =>
          record.Status ? (
            <Header as='h4' color='green'>
              Paid
            </Header>
          ) : (
            <Header as='h4' color='red'>
              Not paid
            </Header>
          ),

        key: 'Paid status'
      },

      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Button type='primary' onClick={() => this.onUpdate(record)}>
            Action
          </Button>
        )
      }
    ]

    if (this.state.Orders === undefined || this.state.Orders === []) {
      return <>Still loading...</>
    } else {
      return (
        <div>
          <h2 className='page-header'>Orders</h2>
          <div className='row'>
            <div className='col-12'>
              <div className='card'>
                <div className='card__body'>
                  <Search
                    placeholder='Enter shipping address'
                    onSearch={this.handleSearch}
                    style={{ width: 200 }}
                  />

                  <Table
                    dataSource={this.state.Orders}
                    columns={tableColumns}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}
export default Orders
