import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from 'react-awesome-modal'

import Table from '../components/table/Table'

import customerList from '../assets/JsonData/customers-list.json'
const customerTableHead = [
  'Id',
  'UserName',
  'RankId',
  'RoleId',
  'Name',
  'Phone',
  'Email',
  'Address',
  'Gender',
  'Status',
  'Point'
]
const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
  <a>
    <tr key={index}>
      <td>{item.Id}</td>
      <td>{item.UserName}</td>
      <td>{item.RankId}</td>
      <td>{item.RoleId}</td>
      <td>{item.Name}</td>
      <td>{item.Phone}</td>
      <td>{item.Email}</td>
      <td>{item.Address}</td>
      <td>{item.Gender}</td>
      <td>{item.Status}</td>
      <td>{item.Point}</td>
    </tr>
  </a>
)

class Orders extends React.Component {
  constructor () {
    super()

    this.state = {
      user: []
    }
  }

  componentWillMount () {
    axios({
      method: 'GET',
      url: '/api/user-management/users'
    }).then(res => {
      console.log(res)
      console.log(res.data)
      this.setState({
        Orders: res.data
      })
    })
  }

  render () {
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
                  {this.state.user === [] ? null : (
                    <Table
                      limit='1000'
                      headData={customerTableHead}
                      renderHead={(item, index) => renderHead(item, index)}
                      bodyData={this.state.Orders}
                      renderBody={(item, index) => renderBody(item, index)}
                    />
                  )}
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
