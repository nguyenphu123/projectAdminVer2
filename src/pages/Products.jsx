import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import Modal from 'react-awesome-modal'
import MyTable from '../components/table/Table'
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
  Dropdown,
  Button,
  Form
} from 'semantic-ui-react'
import NumberFormat from 'react-number-format'
import { ToastContainer, toast } from 'react-toastify'

import Table from 'antd/lib/table'
import 'antd/lib/table/style/css'
import { notification, Space } from 'antd'

import { RMIUploader } from 'react-multiple-image-uploader'
import ImageUploading from 'react-images-uploading'
import './Product.css'
import { useFaker } from 'react-fakers'
import { Input } from 'antd'

const Search = Input.Search

var faker = require('faker')

var randomstring = require('randomstring')

class Products extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      product: [],
      visibility: false,
      currentItem: {},
      isLoading: true,
      AddVisibility: false,
      categories: [],
      Name: '',
      Price: 0,
      CurrentPrice: 0,
      CategoryId: '',
      ColorId: '',
      SizeId: '',
      Description: 'Good',
      Tag: '',
      Quantity: 0,
      Colors: [],
      Sizes: [],
      Elements: [],
      ImageList: [],
      Tags: [],
      ProdcutTags: [],
      edit: false,
      LoadingOnProduct: false,
      LoadingOnElement: false,
      updateImages: []
    }
    this.onView = this.onView.bind(this)
    this.onViewAddProduct = this.onViewAddProduct.bind(this)
    this.onAddElement = this.onAddElement.bind(this)

    // this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    axios({
      method: 'GET',
      url: '/api/product-management?sort=up&pageIndex=1&pageSize=1000'
    }).then(res => {
      console.log(res)
      console.log(res.data)
      axios({
        method: 'GET',
        url: '/api/category-management'
      }).then(res => {
        console.log(res)
        console.log(res.data)
        for (let index = 0; index < res.data.length; index++) {
          const element = {
            key: res.data[index].Id,
            text: res.data[index].Name,
            value: res.data[index].Id
          }
          if (res.data[index].SubCategories.length !== 0) {
            for (
              let jindex = 0;
              jindex < res.data[index].SubCategories.length;
              jindex++
            ) {
              const element = {
                key: res.data[index].SubCategories[jindex].Id,
                text: res.data[index].SubCategories[jindex].Name,
                value: res.data[index].SubCategories[jindex].Id
              }

              this.state.categories.push(element)

              //   this.setState({
              //     categories: this.state.categories.push(element)
              //   })
            }
          }
          this.state.categories.push(element)

          //   this.setState({
          //     categories: this.state.categories.push(element)
          //   })
        }
      })
      axios({
        method: 'GET',
        url: '/api/tag-management'
      }).then(res => {
        console.log(res)
        console.log(res.data)
        for (let index = 0; index < res.data.length; index++) {
          const element = {
            key: res.data[index].Id,
            text: res.data[index].Name,
            value: res.data[index].Id
          }
          this.state.Tags.push(element)

          //   this.setState({
          //     categories: this.state.categories.push(element)
          //   })
        }
      })
      axios({
        method: 'GET',
        url: '/api/color-management'
      }).then(res => {
        console.log(res)
        console.log(res.data)
        for (let index = 0; index < res.data.length; index++) {
          const element = {
            key: res.data[index].Id,
            text: res.data[index].Name,
            value: res.data[index].Id
          }
          this.state.Colors.push(element)

          //   this.setState({
          //     categories: this.state.categories.push(element)
          //   })
        }
      })
      axios({
        method: 'GET',
        url: '/api/size-management'
      }).then(res => {
        console.log(res)
        console.log(res.data)
        for (let index = 0; index < res.data.length; index++) {
          const element = {
            key: res.data[index].Id,
            text: res.data[index].Name,
            value: res.data[index].Id
          }
          this.state.Sizes.push(element)

          //   this.setState({
          //     categories: this.state.categories.push(element)
          //   })
        }
      })

      this.setState({
        isLoading: false,
        product: res.data
      })
    })
  }
  onView (item) {
    this.setState({
      visibility: !this.state.visibility,
      currentItem: item
    })
  }
  onViewAddProduct () {
    this.setState({
      AddVisibility: !this.state.AddVisibility
    })
  }
  onAddElement () {
    this.setState(
      {
        LoadingOnElement: true
      },
      function () {
        const element = {
          Quantity: this.state.Quantity,
          ColorId: this.state.ColorId,
          SizeId: this.state.SizeId
        }
        const check_index = this.state.Elements.findIndex(
          item =>
            item.ColorId === this.state.ColorId &&
            item.SizeId === this.state.SizeId
        )
        if (check_index !== -1) {
          this.state.Elements[check_index].Quantity = this.state.Quantity
          this.setState({
            LoadingOnElement: false
          })
        } else {
          this.state.Elements.push(element)
          this.setState({
            LoadingOnElement: false
          })
        }
      }
    )
  }
  onAddCurrentElement () {
    this.setState(
      {
        LoadingOnElement: true
      },
      function () {
        const element = {
          Quantity: this.state.Quantity,
          ColorId: this.state.ColorId,
          SizeId: this.state.SizeId
        }
        const check_index = this.state.currentItem.Elements.findIndex(
          item =>
            item.ColorId === this.state.ColorId &&
            item.SizeId === this.state.SizeId
        )
        if (check_index !== -1) {
          this.state.currentItem.Elements[
            check_index
          ].Quantity = this.state.Quantity
          this.setState({
            LoadingOnElement: false
          })
        } else {
          this.state.currentItem.Elements.push(element)
          this.setState({
            LoadingOnElement: false
          })
        }
      }
    )
  }
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
    console.log(name + ':' + value)
    if (name === 'Tag') {
      const check_index = this.state.Tags.findIndex(
        item => item.value === value
      )
      if (check_index !== -1) {
      } else {
        this.state.ProdcutTags.push({
          Id: value,
          Name: this.state.Tags[check_index].text
        })
      }
    }
  }
  onUpload = data => {
    this.state.files.push(data)
    console.log('Upload files', data)
  }
  onSelect = data => {
    console.log('Select files', data)
  }
  onRemove = id => {
    console.log('Remove image id', id)
  }

  handleSubmit = () => {
    this.setState({
      LoadingOnProduct: true
    })

    var Await = true
    const imageUrls = []
    for (let index = 0; index < this.state.ImageList.length; index++) {
      const element = this.state.ImageList[index].data_url

      const data = new FormData()
      data.append('file', element)
      data.append('upload_preset', 'ml_default')
      data.append('cloud_name', 'shopproject')
      fetch('  	https://api.cloudinary.com/v1_1/shopproject/image/upload', {
        method: 'post',
        body: data
      })
        .then(resp => resp.json())
        .then(response => {
          const imageURL = {
            ImageUrl: response.url,
            Alt: 'image'
          }
          imageUrls.push(imageURL)

          if (index === this.state.ImageList.length) {
            Await = false
          }
        })
        .catch(err => console.log(err))
    }

    setTimeout(() => {
      this.onSubmitToDb(imageUrls)
    }, 10000)
  }
  onSubmitToDb = imageUrls => {
    const data = {
      Name: this.state.Name,
      Price: this.state.Price,
      CurrentPrice: this.state.CurrentPrice,
      Code: randomstring.generate(4),
      CategoryId: this.state.CategoryId,
      Description: this.state.Description,
      ImageStorages: imageUrls,
      Tags: this.state.ProdcutTags,
      Elements: this.state.Elements,
      Status: true,
      Star: 0
    }

    axios({
      method: 'post',
      url: '/api/product-management',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(data)
    }).then(res => {
      data.Id = res.data

      this.state.product.push(data)
      this.setState({
        LoadingOnProduct: false
      })
      notification['success']({
        message: 'add product',
        description: 'add successfully.',
        duration: 10
      })
    })
  }
  onSubmitChange = () => {
    const data = {
      Name:
        this.state.Name === '' ? this.state.currentItem.Name : this.state.Name,
      Price:
        this.state.Price === 0
          ? parseFloat(this.state.currentItem.Price)
          : parseFloat(this.state.Price),
      CurrentPrice:
        this.state.CurrentPrice === 0
          ? parseFloat(this.state.currentItem.CurrentPrice)
          : parseFloat(this.state.CurrentPrice),
      Code: this.state.currentItem.Code,
      CategoryId: this.state.currentItem.CategoryId,
      Description:
        this.state.Description === ''
          ? this.state.currentItem.Description
          : this.state.Description,
      ImageStorages:
        this.state.updateImages.length === 0
          ? this.state.currentItem.ImageStorages
          : this.state.updateImages,
      Tags: this.state.currentItem.Tags,

      Status: true,
      DateTime: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' '),
      Star:
        this.state.currentItem.Star === 'NaN' ? 0 : this.state.currentItem.Star
    }

    axios({
      method: 'put',
      url: '/api/product-management',
      headers: { 'content-type': 'application/json' },
      data: JSON.stringify(data)
    }).then(res => {
      console.log(res)
      this.setState({
        Name: '',
        Price: '',
        CurrentPrice: '',
        Description: ''
      })
    })
  }
  handleSearch = searchText => {
    const filteredEvents = this.state.product.filter(({ Name }) => {
      Name = Name.toLowerCase()
      return Name.includes(searchText.toLowerCase())
    })

    this.setState({
      product: filteredEvents
    })
  }

  render () {
    const { value } = this.state
    const maxNumber = 100
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
        title: 'Price',
        render: (text, record) => (
          <NumberFormat
            value={record.Price}
            className='foo'
            displayType={'text'}
            thousandSeparator={true}
            prefix={''}
            renderText={(value, props) => <div {...props}>{value}VND</div>}
          />
        ),

        key: 'Price',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.Price - b.Price
      },
      {
        title: 'Current Price',
        render: (text, record) => (
          <NumberFormat
            value={record.CurrentPrice}
            className='foo'
            displayType={'text'}
            thousandSeparator={true}
            prefix={''}
            renderText={(value, props) => <div {...props}>{value}VND</div>}
          />
        ),
        key: 'Current Price',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.CurrentPrice - b.CurrentPrice
      },
      {
        title: 'Description',
        dataIndex: 'Description',
        key: 'Description'
      },
      {
        title: 'Code',
        dataIndex: 'Code',
        key: 'Code'
      },
      {
        title: 'Star',
        dataIndex: 'Star',
        key: 'Star'
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => <Button type='primary'>Action</Button>
      }
    ]
    const tableColumnsElement = [
      {
        title: 'Color',
        render: (text, record) => returnColorName(record.ColorId),

        key: 'ColorId'
      },
      {
        title: 'Size',
        render: (text, record) => returnSizeName(record.SizeId),
        key: 'SizeId'
      },
      {
        title: 'Quantity',
        dataIndex: 'Quantity',
        key: 'Quantity'
      },

      {
        title: 'Action',
        key: 'action',
        render: (text, record) => <Button type='primary'>Action</Button>
      }
    ]

    const returnColorName = Id => {
      const check_index = this.state.Colors.findIndex(item => item.value === Id)
      if (check_index !== -1) {
        console.log(this.state.Colors[check_index])
        return <>{this.state.Colors[check_index].text}</>
      }
    }
    const returnSizeName = Id => {
      const check_index = this.state.Sizes.findIndex(item => item.value === Id)
      if (check_index !== -1) {
        return <>{this.state.Sizes[check_index].text}</>
      }
    }
    const returnCategory = Id => {
      const check_index = this.state.categories.findIndex(
        item => item.value === Id
      )
      if (check_index !== -1) {
        return <>{this.state.categories[check_index].text}</>
      }
    }

    const setEdit = () => {
      this.setState({
        edit: !this.state.edit
      })
    }
    if (this.state.isLoading) {
      return <>Still loading...</>
    } else {
      const panes = [
        {
          menuItem: { key: 'about', icon: 'info circle', content: 'About' },
          render: () => (
            <Tab.Pane attached={false}>
              <Header floated='right' as='h6' icon>
                <Icon name='settings' onClick={setEdit} />
              </Header>

              <Header as='h4' color='grey'>
                Basic Information
              </Header>

              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Header as='h5' floated='left' color='black'>
                    Category:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    {returnCategory(this.state.currentItem.CategoryId)}
                  </Header>
                </Segment>
              </div>
              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Form.Input
                    fluid
                    label='Price'
                    name='Price'
                    placeholder='Price'
                    disabled={!this.state.edit}
                    value={this.state.currentItem.Price}
                    onChange={this.handleChange}
                  />
                </Segment>
              </div>

              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Form.Input
                    fluid
                    label='Current Price'
                    name='CurrentPrice'
                    placeholder='Current Price'
                    disabled={!this.state.edit}
                    value={this.state.currentItem.CurrentPrice}
                    onChange={this.handleChange}
                  />
                </Segment>
              </div>
              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Header as='h5' floated='left' color='black'>
                    Code:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    {this.state.currentItem.Code}
                  </Header>
                </Segment>
              </div>
              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Header as='h5' floated='left' color='black'>
                    Description:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    <Form.TextArea
                      label='Description'
                      name='Description'
                      placeholder='Description...'
                      disabled={!this.state.edit}
                      value={this.state.currentItem.Description}
                      onChange={this.handleChange}
                    />
                  </Header>
                </Segment>
              </div>
            </Tab.Pane>
          )
        },
        {
          menuItem: { key: 'images', icon: 'image', content: 'Image' },
          render: () => (
            <Tab.Pane attached={false}>
              <Form.Group inline>
                <ImageUploading
                  multiple
                  value={this.state.currentItem.ImageStorages}
                  onChange={(imageList, addUpdateIndex) => {
                    // data for submit
                    console.log(imageList, addUpdateIndex)
                    this.setState({
                      updateImages: imageList
                    })
                  }}
                  maxNumber={this.maxNumber}
                  dataURLKey='data_url'
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps
                  }) => (
                    <Segment placeholder>
                      <Header icon>
                        <div className='upload__image-wrapper'>
                          {imageList.map((image, index) => (
                            <div key={index} className='image-item'>
                              <img
                                style={{ width: '100px', height: '100px' }}
                                src={image.data_url}
                                alt=''
                              />
                              <div className='image-item__btn-wrapper'>
                                <Button
                                  inverted
                                  color='blue'
                                  style={{ marginTop: '10px' }}
                                  onClick={() => onImageUpdate(index)}
                                >
                                  Update
                                </Button>
                                <Button
                                  inverted
                                  color='blue'
                                  style={{ marginTop: '10px' }}
                                  onClick={() => onImageRemove(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Header>
                      <Button
                        fluid
                        icon='upload'
                        style={isDragging ? { color: 'red' } : null}
                        onClick={onImageUpload}
                        {...dragProps}
                      ></Button>
                    </Segment>
                  )}
                </ImageUploading>
              </Form.Group>
            </Tab.Pane>
          )
        },
        {
          menuItem: { key: 'element', icon: 'eye', content: 'Element' },
          render: () => (
            <Tab.Pane attached={false}>
              <Form.Group inline>
                <Form.Select
                  fluid
                  name='ColorId'
                  label='Color'
                  options={this.state.Colors}
                  placeholder='Color'
                  onChange={this.handleChange}
                />
                <Form.Select
                  fluid
                  name='SizeId'
                  label='Size'
                  options={this.state.Sizes}
                  placeholder='Size'
                  onChange={this.handleChange}
                />
                <Form.Input
                  label='Quantity'
                  name='Quantity'
                  placeholder='Quantity'
                  onChange={this.handleChange}
                />

                <Button onClick={this.onAddCurrentElement}>Add</Button>
              </Form.Group>
              {this.state.LoadingOnElement ? (
                <img
                  src={
                    'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
                  }
                  alt='promotion-banner1'
                />
              ) : (
                <Table
                  dataSource={this.state.currentItem.Elements}
                  columns={tableColumnsElement}
                />
              )}
            </Tab.Pane>
          )
        }
      ]

      return (
        <div>
          <h2 className='page-header'>products</h2>
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
                    <Header as='h1'>
                      <Form.Input
                        fluid
                        label='Name'
                        name='Name'
                        placeholder='Name'
                        disabled={!this.state.edit}
                        value={this.state.currentItem.Name}
                        onChange={this.handleChange}
                      />
                      {this.state.LoadingOnProduct ? (
                        <img
                          src={
                            'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
                          }
                          alt='promotion-banner1'
                          style={{ height: '50px', width: '50px' }}
                        />
                      ) : null}
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
          <Button onClick={() => this.onViewAddProduct()}>Add product</Button>
          <Modal
            visible={this.state.AddVisibility}
            width='1000'
            height='900'
            effect='fadeInUp'
            onClickAway={() => this.onViewAddProduct()}
          >
            <div style={{ marginLeft: '10px', marginTop: '10px' }}>
              <Header as='h1'>Add product</Header>
              {this.state.LoadingOnProduct ? (
                <img
                  src={
                    'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
                  }
                  alt='promotion-banner1'
                  style={{ height: '50px', width: '50px' }}
                />
              ) : null}

              <Segment basic textAlign='center'>
                <Form>
                  <Form.Group widths='equal'>
                    <Form.Input
                      fluid
                      label='Name'
                      name='Name'
                      placeholder='Name'
                      onChange={this.handleChange}
                    />

                    <Form.Input
                      fluid
                      label='Price'
                      name='Price'
                      placeholder='Price'
                      onChange={this.handleChange}
                    />

                    <Form.Input
                      fluid
                      name='CurrentPrice'
                      label='Current Price'
                      placeholder='Current Price'
                      onChange={this.handleChange}
                    />

                    <Form.Select
                      fluid
                      name='CategoryId'
                      label='Category'
                      options={this.state.categories}
                      placeholder='Category'
                      onChange={this.handleChange}
                    />
                    <Form.Select
                      fluid
                      name='Tag'
                      label='Tag'
                      options={this.state.Tags}
                      placeholder='Tag'
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <Form.Select
                      fluid
                      name='ColorId'
                      label='Color'
                      options={this.state.Colors}
                      placeholder='Color'
                      onChange={this.handleChange}
                    />
                    <Form.Select
                      fluid
                      name='SizeId'
                      label='Size'
                      options={this.state.Sizes}
                      placeholder='Size'
                      onChange={this.handleChange}
                    />
                    <Form.Input
                      label='Quantity'
                      name='Quantity'
                      placeholder='Quantity'
                      onChange={this.handleChange}
                    />

                    <Button onClick={this.onAddElement}>Add</Button>
                    {this.state.LoadingOnElement ? (
                      <img
                        src={
                          'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
                        }
                        alt='promotion-banner1'
                      />
                    ) : (
                      <Table
                        dataSource={this.state.Elements}
                        columns={tableColumnsElement}
                      />
                    )}
                  </Form.Group>

                  <Form.TextArea
                    label='Description'
                    name='Description'
                    placeholder='Description...'
                    onChange={this.handleChange}
                  />

                  <Divider horizontal> Upload your image here</Divider>
                  <ImageUploading
                    multiple
                    value={this.state.ImageList}
                    onChange={(imageList, addUpdateIndex) => {
                      // data for submit
                      console.log(imageList, addUpdateIndex)
                      this.setState({
                        ImageList: imageList
                      })
                    }}
                    maxNumber={this.maxNumber}
                    dataURLKey='data_url'
                  >
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps
                    }) => (
                      <Segment placeholder>
                        <Header icon>
                          <div className='upload__image-wrapper'>
                            {imageList.map((image, index) => (
                              <div key={index} className='image-item'>
                                <img
                                  style={{ width: '100px', height: '100px' }}
                                  src={image.data_url}
                                  alt=''
                                />
                                <div className='image-item__btn-wrapper'>
                                  <Button
                                    inverted
                                    color='blue'
                                    style={{ marginTop: '10px' }}
                                    onClick={() => onImageUpdate(index)}
                                  >
                                    Update
                                  </Button>
                                  <Button
                                    inverted
                                    color='blue'
                                    style={{ marginTop: '10px' }}
                                    onClick={() => onImageRemove(index)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Header>
                        <Button
                          fluid
                          icon='upload'
                          style={isDragging ? { color: 'red' } : null}
                          onClick={onImageUpload}
                          {...dragProps}
                        ></Button>
                      </Segment>
                    )}
                  </ImageUploading>
                  <Button onClick={this.handleSubmit} content='Save' />
                </Form>
              </Segment>
            </div>
            <div>
              <a
                href='javascript:void(0);'
                onClick={() => this.onViewAddProduct()}
              >
                Close
              </a>
            </div>
          </Modal>
          <div className='row'>
            <div className='col-12'>
              <div className='card'>
                <div className='card__body'>
                  <Search
                    placeholder='Enter Title'
                    onSearch={this.handleSearch}
                    style={{ width: 200 }}
                  />

                  {this.state.LoadingOnProduct ? (
                    <img
                      src={
                        'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
                      }
                      alt='promotion-banner1'
                    />
                  ) : (
                    <Table
                      dataSource={this.state.product}
                      columns={tableColumns}
                    />
                  )}
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
export default Products
