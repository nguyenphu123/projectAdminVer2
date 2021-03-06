import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from 'react-awesome-modal'
import { ToastContainer, toast } from 'react-toastify'

import 'semantic-ui-css/semantic.min.css'
import {
  Divider,
  Grid,
  Image,
  Header,
  Label,
  Icon,
  Segment,
  Tab,
  Button
} from 'semantic-ui-react'

import Table from 'antd/lib/table'
import 'antd/lib/table/style/css'
import { Input } from 'antd'

const Search = Input.Search

class Customers extends React.Component {
  constructor () {
    super()

    this.state = {
      user: [],
      visibility: false,
      currentItem: {},
      isLoading: true
    }
    this.onView = this.onView.bind(this)
    this.onSubmitDisable = this.onSubmitDisable.bind(this)
  }

  componentWillMount () {
    axios({
      method: 'GET',
      url: '/api/user-management/users'
    }).then(res => {
      console.log(res)
      console.log(res.data)

      this.setState({
        isLoading: false,
        user: res.data.filter(
          item => item.RoleId === 'd00d3c17-6180-4a32-884c-976cd044ce7b'
        )
      })
    })
  }
  onView (item) {
    this.setState({
      visibility: !this.state.visibility,
      currentItem: item
    })
  }
  onSubmitDisable (UserInformation) {
    const authData = {
      Id: UserInformation.Id,
      UserName: UserInformation.UserName,
      PassWord: UserInformation.PassWord,
      RankId: UserInformation.RankId,
      RoleId: UserInformation.RoleId,
      Name: UserInformation.Name,
      Phone: UserInformation.Phone,
      Address: UserInformation.Address,
      Gender: UserInformation.Gender,
      Point: 0,
      Email: UserInformation.Email
    }
    console.log(authData)
    axios({
      method: 'put',
      url: '/api/user-management/users',
      headers: { 'content-type': 'application/json' },
      data: authData
    })
      .then(res => {
        toast.success('Disable successful')
      })
      .catch(function (error) {
        console.log('Show error notification!')
        return Promise.reject(error)
      })
  }

  handleSearch = searchText => {
    const filteredEvents = this.state.user.filter(({ Name }) => {
      Name = Name.toLowerCase()
      return Name.includes(searchText.toLowerCase())
    })

    this.setState({
      user: filteredEvents
    })
  }

  render () {
    const tableColumns = [
      {
        title: 'UserName',
        dataIndex: 'UserName',
        key: 'UserName'
      },

      {
        title: 'Name',
        dataIndex: 'Name',
        key: 'Name'
      },
      {
        title: 'Phone',
        dataIndex: 'Phone',
        key: 'Phone'
      },
      {
        title: 'Gender',
        render: (text, record) => (record.Gender ? <> male </> : <>female</>),

        key: 'Gender'
      },
      {
        title: 'Point',
        dataIndex: 'Point',
        key: 'Point'
      },
      {
        title: 'View detail',
        key: 'action',
        render: (text, record) => (
          <Button type='primary' onClick={() => this.onView(record)}>
            View detail
          </Button>
        )
      },
      {
        title: 'Disable',
        key: 'action',
        render: (text, record) =>
          record.Point === 0 ? (
            <></>
          ) : (
            <Button type='primary' onClick={() => this.onSubmitDisable(record)}>
              Disable
            </Button>
          )
      }
    ]

    if (this.state.isLoading) {
      return <>Still loading...</>
    } else {
      const panes = [
        {
          menuItem: { key: 'about', icon: 'info circle', content: 'About' },
          render: () => (
            <Tab.Pane attached={false}>
              <Header floated='right' as='h6' icon></Header>

              <Header as='h4' color='grey'>
                Basic Information
              </Header>
              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Header as='h5' floated='left' color='black'>
                    Gender:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    {this.state.currentItem.Gender ? <> Male</> : <>Female</>}
                  </Header>
                </Segment>
              </div>

              <Header as='h4' color='grey'>
                Contact Information
              </Header>
              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Header as='h5' floated='left' color='black'>
                    Phone number:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    {this.state.currentItem.Phone}
                  </Header>
                </Segment>
              </div>
              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Header as='h5' floated='left' color='black'>
                    Emali:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    {this.state.currentItem.Email}
                  </Header>
                </Segment>
              </div>
              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Header as='h5' floated='left' color='black'>
                    Address:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    {this.state.currentItem.Address}
                  </Header>
                </Segment>
              </div>
            </Tab.Pane>
          )
        }
      ]

      return (
        <div>
          <h2 className='page-header'>customers</h2>
          <Modal
            visible={this.state.visibility}
            width='1200'
            height='800'
            effect='fadeInUp'
            onClickAway={() => this.onView({})}
          >
            <div>
              <a href='javascript:void(0);' onClick={() => this.onView({})}>
                Close
              </a>
            </div>

            <div style={{ marginLeft: '10px', marginTop: '10px' }}>
              <Grid>
                <Grid.Column width={3}></Grid.Column>
                <Grid.Column width={11}>
                  <Header as='h1'>{this.state.currentItem.Name}</Header>
                  <Header as='h5'>
                    <Segment style={{ border: '0px' }}>
                      <Grid columns={2}>
                        <Grid.Column>
                          <Icon name=' user outline' />
                          {this.state.currentItem.UserName}
                        </Grid.Column>
                        <Grid.Column>
                          <Icon name=' map marker alternate' />
                          {this.state.currentItem.Address}
                        </Grid.Column>
                      </Grid>

                      <Divider vertical></Divider>
                    </Segment>
                  </Header>
                  <Tab
                    menu={{
                      color: 'green',
                      attached: false,
                      tabular: false,
                      secondary: true,
                      pointing: true
                    }}
                    panes={panes}
                  />
                </Grid.Column>
                <Grid.Column width={2}>
                  <Label color={'green'} key={'green'}>
                    Active
                  </Label>
                </Grid.Column>
              </Grid>
            </div>
          </Modal>
          <div className='row'>
            <div className='col-12'>
              <div className='card'>
                <div className='card__body'>
                  <Search
                    placeholder='Enter name'
                    onSearch={this.handleSearch}
                    style={{ width: 200 }}
                  />

                  <Table dataSource={this.state.user} columns={tableColumns} />
                </div>
              </div>
            </div>
          </div>
          <ToastContainer autoClose={5000} />
        </div>
      )
    }
  }
}
export default Customers
