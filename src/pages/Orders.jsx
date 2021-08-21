import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from 'react-awesome-modal'
import NumberFormat from 'react-number-format'

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
import Moment from 'moment'
import { DatePicker } from 'antd'
const dateFormat = 'DD/MM/YYYY'

const Search = Input.Search

class Orders extends React.Component {
  constructor () {
    super()

    this.state = {
      Orders: []
    }
    this.reset = this.reset.bind(this)
  }

  handleDatePickerChange = (date, dateString, id) => {
    if (dateString === '') {
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
    } else {
      axios({
        method: 'GET',
        url: '/api/order-management/orders'
      }).then(res => {
        console.log(res)
        console.log(res.data)
        let sorting = res.data.filter(
          item => Moment(item.Date).format('DD/MM/YYYY') === dateString
        )

        this.setState({
          Orders: sorting
        })
      })
    }
  }

  reset () {
    this.setState({
      Orders: []
    })

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
        key: 'Date',
        defaultSortOrder: 'descend',
        sorter: (a, b) =>
          new Date(
            Moment(a.Date)
              .format('DD/MM/YYYY')
              .split('/')
              .reverse()
          ) -
          new Date(
            Moment(b.Date)
              .format('DD/MM/YYYY')
              .split('/')
              .reverse()
          ),

        render: (text, record) => (
          <>{Moment(record.Date).format('DD/MM/YYYY')}</>
        )
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
      }

      // {
      //   title: 'Action',
      //   key: 'action',
      //   render: (text, record) => (
      //     <Button type='primary' onClick={() => this.onUpdate(record)}>
      //       Update
      //     </Button>
      //   )
      // }
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
                  <Button type='primary' onClick={() => this.reset()}>
                    Reset
                  </Button>
                  <DatePicker
                    onChange={(date, dateString) =>
                      this.handleDatePickerChange(date, dateString, 1)
                    }
                    format={'DD/MM/YYYY'}
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
