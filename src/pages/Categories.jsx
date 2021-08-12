import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from 'react-awesome-modal'
import ImageUploading from 'react-images-uploading'

import MyTable from '../components/table/Table'
import {
  Divider,
  Grid,
  Image,
  Header,
  Label,
  Button,
  Checkbox,
  Icon,
  Segment,
  Tab,
  Form
} from 'semantic-ui-react'
import { RMIUploader } from 'react-multiple-image-uploader'
import { ToastContainer, toast } from 'react-toastify'
import Table from 'antd/lib/table'

import customerList from '../assets/JsonData/customers-list.json'

class Categories extends React.Component {
  constructor () {
    super()

    this.state = {
      Categories: [],
      visibility: false,
      isLoading: true,
      currentItem: {},
      Name: '',
      ParrentId: '',
      ImageList: [],
      edit: false,
      parrentCategories: []
    }
    this.onView = this.onView.bind(this)
  }

  componentWillMount () {
    axios({
      method: 'GET',
      url: '/api/category-management'
    }).then(res => {
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index]
        if (res.data[index].SubCategories.length !== 0) {
          for (
            let jindex = 0;
            jindex < res.data[index].SubCategories.length;
            jindex++
          ) {
            const subelement = res.data[index].SubCategories[jindex]

            this.state.Categories.push(subelement)
          }
        }
        this.state.Categories.push(element)
        this.state.parrentCategories.push(element)
      }
      this.setState({
        isLoading: false
      })
    })
  }
  onView (item) {
    if (this.state.visibility) {
      this.setState({
        visibility: !this.state.visibility,
        currentItem: {},
        ParrentId: ''
      })
    } else {
      this.setState({
        visibility: !this.state.visibility,
        currentItem: item,
        ParrentId: item.Id
      })
    }
  }
  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  handleSubmit = () => {
    let check_index = this.state.Categories.findIndex(
      item => item.Name === this.state.Name
    )
    if (check_index !== -1) {
      toast.warn('add new category failed, duplicate name')
    } else {
      const data = {
        Name: this.state.Name,
        ParrentId: this.state.ParrentId
      }
      console.log(data)
      axios({
        method: 'post',
        url: '/api/category-management',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(data)
      }).then(res => {
        console.log(res)
        axios({
          method: 'GET',
          url: '/api/category-management'
        }).then(res => {
          console.log(res)
          console.log(res.data)
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index]
            if (res.data[index].SubCategories.length !== 0) {
              for (
                let jindex = 0;
                jindex < res.data[index].SubCategories.length;
                jindex++
              ) {
                const subelement = res.data[index].SubCategories[jindex]

                this.state.Categories.push(subelement)
              }
            }
            this.state.Categories.push(element)
            this.state.parrentCategories.push(element)
          }
          this.setState({
            isLoading: false
          })

          toast.success('add new category successfully')
        })
      })
    }
  }
  onSubmitChange = () => {
    let check_index = this.state.Categories.findIndex(
      item => item.Name === this.state.Name
    )
    if (check_index !== -1) {
      toast.warn('update category failed, duplicate name')
    } else {
      const data = {
        Id: this.state.currentItem.Id,
        Name:
          this.state.newName === ''
            ? this.state.currentItem.Name
            : this.state.newName,
        ParentId: this.state.currentItem.ParrentId,
        Status: true
      }

      axios({
        method: 'put',
        url: '/api/category-management',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(data)
      }).then(res => {
        console.log(res)
        this.setState({
          Name: ''
        })
        axios({
          method: 'GET',
          url: '/api/category-management'
        }).then(res => {
          console.log(res)
          console.log(res.data)
          this.setState({
            isLoading: false,
            Categories: res.data
          })
          toast.success('update category successfully')
        })
      })
    }
  }
  onSubmitDisable = () => {
    const data = {
      Id: this.state.currentItem.Id,
      Name: this.state.currentItem.Name,
      ParentId: this.state.currentItem.ParrentId,
      Status: false
    }

    axios({
      method: 'put',
      url: '/api/category-management',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(data)
    }).then(res => {
      console.log(res)
      this.setState({
        Name: ''
      })
      axios({
        method: 'GET',
        url: '/api/category-management'
      }).then(res => {
        console.log(res)
        console.log(res.data)
        this.setState({
          Categories: res.data
        })
        axios({
          method: 'GET',
          url: '/api/category-management/' + this.state.currentItem.Id
        }).then(res => {
          console.log(res)
          console.log(res.data)
          array.forEach(item => {
            let data = {
              Id: item.Id,
              ModifiedProduct: {
                Name: item.Name,

                Price: parseFloat(item.Price),

                CurrentPrice: parseFloat(item.CurrentPrice),

                Code: item.Code,
                CategoryId: item.CategoryId,
                Description: item.Description,

                ImageStorages: item.ImageStorages,
                Tags: item.Tags,

                Status: false,
                DateTime: new Date()
                  .toISOString()
                  .slice(0, 19)
                  .replace('T', ' '),
                Star: item.Star === 'NaN' ? 0 : item.Star
              }
            }
            axios({
              method: 'put',
              url: '/api/product-management',
              headers: { 'content-type': 'application/json' },
              data: JSON.stringify(data)
            }).then(res => {
              console.log(res)
            })
          })
          this.setState({
            isLoading: false
          })
        })

        toast.success('update category successfully')
      })
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
        title: 'Name',
        dataIndex: 'Name',
        key: 'Name'
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Button type='primary' onClick={() => this.onView(record)}>
            View Detail
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
              <Header floated='right' as='h6' icon>
                <Icon name='settings' />
              </Header>

              <Header as='h4' color='grey'>
                Basic Information
              </Header>

              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Form.Input
                    fluid
                    label='Name'
                    name='newName'
                    placeholder='Name'
                    disabled={!this.state.edit}
                    value={this.state.currentItem.Name}
                    onChange={this.handleChange}
                  />
                </Segment>
                <Segment basic textAlign='center'>
                  <Form onSubmit={this.handleSubmit}>
                    <Form.Input
                      fluid
                      label='Name'
                      name='Name'
                      placeholder='Name'
                      onChange={this.handleChange}
                    />
                    <Form.Button content='Submit' />
                  </Form>
                </Segment>
              </div>
            </Tab.Pane>
          )
        }
      ]

      return (
        <div>
          <h2 className='page-header'>Categories</h2>
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
                  <Form>
                    <Header as='h1'>{this.state.currentItem.Name}</Header>
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
                    {this.state.edit ? (
                      <Button size='big' onClick={this.onSubmitChange} primary>
                        Save
                      </Button>
                    ) : null}
                  </Form>
                </Grid.Column>
                <Grid.Column width={2}>
                  <Label color={'green'} key={'green'}>
                    Active
                  </Label>
                </Grid.Column>
              </Grid>
            </div>
          </Modal>
          <Segment basic textAlign='center'>
            <Form onSubmit={this.handleSubmit}>
              <Form.Input
                fluid
                label='Name'
                name='Name'
                placeholder='Name'
                onChange={this.handleChange}
              />
              <Form.Button content='Submit' />
            </Form>
          </Segment>

          <div className='row'>
            <div className='col-12'>
              <div className='card'>
                <div className='card__body'>
                  <Table
                    dataSource={this.state.Categories}
                    columns={tableColumns}
                  />
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
export default Categories
