import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import Modal from 'react-awesome-modal'
import Table from '../components/table/Table'
import 'semantic-ui-css/semantic.min.css'
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
import ImageUploading from 'react-images-uploading'
import './Product.css'
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
      ProdcutTags: []
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
    const element = {
      Quantity: this.state.Quantity,
      Color: this.state.ColorId,
      Size: this.state.SizeId
    }
    this.state.Elements.push(element)
    console.log(this.state.Elements)
  }
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value })
    console.log(name + ':' + value)
    if (name === 'Tag') {
      this.state.ProdcutTags.push({
        Id: value
      })
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
    const Id = uuidv4()
    const imageUrls = []
    var Await = true
    for (let index = 0; index < this.state.ImageList.length; index++) {
      const element = this.state.ImageList[index].data_url
      console.log(this.state.ImageList[index])

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
        })
        .catch(err => console.log(err))
      if (index === this.state.ImageList.length - 1) {
        Await = false
      }
    }
    if (!Await) {
      const data = {
        Id: Id,
        Name: this.state.Name,
        Price: this.state.Price,
        CurrenPrice: this.state.CurrentPrice,
        Code: randomstring.generate(4),
        CategoryId: this.state.CategoryId,
        Description: this.state.Description,
        ImageStorage: imageUrls,
        Tags: this.state.ProdcutTags,
        Status: true,
        Star: 0
      }
      console.log(data)
      axios({
        method: 'post',
        url: '/api/product-management',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(data)
      }).then(res => {
        console.log(res)
      })
    }
  }
  render () {
    const { value } = this.state
    const maxNumber = 100
    console.log(this.state.ImageList)

    const columns = [
      'Id',

      'Name',

      'Price (x 1000 VND)',

      'Star',

      'Description',

      'Code',

      'CurrentPrice (x 1000 VND)',

      'CategoryId',

      'Status',

      'DateTime'
    ]

    const renderHead = (item, index) => <th key={index}>{item}</th>

    const renderBody = (item, index) => (
      <tr key={index} onClick={() => this.onView(item)}>
        <td>{item.Id}</td>
        <td>{item.Name}</td>
        <td>{item.Price},000 VND</td>
        <td>{item.Star}</td>
        <td>{item.Description}</td>
        <td>{item.Code}</td>
        <td>{item.CurrentPrice},000 VND</td>
        <td>{item.CategoryId}</td>
        <td>{item.Status}</td>
        <td>{item.Status}</td>
        <td>{item.DateTime}</td>
      </tr>
    )
    const elements = ['Color', 'Size', 'Quantity']

    const renderBodyElements = (item, index) => (
      <tr key={index}>
        <td>{item.Color}</td>
        <td>{item.Size}</td>
        <td>{item.Quantity}</td>
        {/* <td>Edit</td> */}
      </tr>
    )

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
                  <Header as='h5' floated='left' color='black'>
                    Category:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    {this.state.currentItem.CategoryId}
                  </Header>
                </Segment>
              </div>
              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Header as='h5' floated='left' color='black'>
                    Price:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    {this.state.currentItem.Price}
                  </Header>
                </Segment>
              </div>

              <div style={{ width: '300px' }}>
                <Segment style={{ border: '0px' }} clearing>
                  <Header as='h5' floated='left' color='black'>
                    Current Price:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    {this.state.currentItem.CurrentPrice}
                  </Header>
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
                    {this.state.currentItem.Description}
                  </Header>
                </Segment>
              </div>
            </Tab.Pane>
          )
        },
        {
          menuItem: { key: 'elemwnt', icon: 'eye', content: 'Element' },
          render: () => (
            <Tab.Pane attached={false}>
              <Table
                limit='1000'
                headData={elements}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={this.state.currentItem.Elements}
                renderBody={(item, index) => renderBodyElements(item, index)}
              />
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
                <Grid.Column width={3}>
                  <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                </Grid.Column>
                <Grid.Column width={11}>
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
              <Segment basic textAlign='center'>
                <Form onSubmit={this.handleSubmit}>
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
                      name='TagId'
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

                    <Table
                      limit='1000'
                      headData={elements}
                      renderHead={(item, index) => renderHead(item, index)}
                      bodyData={this.state.Elements}
                      renderBody={(item, index) =>
                        renderBodyElements(item, index)
                      }
                    />
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
                  <Form.Button content='Save' />
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
                  <Table
                    limit='1000'
                    headData={columns}
                    renderHead={(item, index) => renderHead(item, index)}
                    bodyData={this.state.product}
                    renderBody={(item, index) => renderBody(item, index)}
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
export default Products
