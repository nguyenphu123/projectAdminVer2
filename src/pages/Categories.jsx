import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Modal from 'react-awesome-modal'
import ImageUploading from 'react-images-uploading'

import Table from '../components/table/Table'
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
      ImageList: []
    }
    this.onView = this.onView.bind(this)
  }

  componentWillMount () {
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
    })
  }

  render () {
    const customerTableHead = ['Id', 'Name']
    const renderHead = (item, index) => <th key={index}>{item}</th>
    const maxNumber = 1
    const onChange = (imageList, addUpdateIndex) => {
      // data for submit
      console.log(imageList, addUpdateIndex)
      this.setState({
        ImageList: imageList
      })
    }

    const renderBody = (item, index) => (
      <tr key={index} onClick={() => this.onView(item)}>
        <td>{item.Id}</td>

        <td>{item.Name}</td>

        {/* {item.SubCategories.length === 0 ? null : (
      <td>
       
      </td>
    )} */}
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
                    Name:
                  </Header>
                  <Header as='h5' floated='right' color='grey'>
                    {this.state.currentItem.Name}
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

              <Table
                limit='1000'
                headData={customerTableHead}
                renderHead={(item, index) => renderHead(item, index)}
                bodyData={this.state.currentItem.SubCategories}
                renderBody={(item, index) => renderBody(item, index)}
              />
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
            <Divider horizontal> Upload your image here</Divider>
            <ImageUploading
              multiple
              value={this.state.ImageList}
              onChange={this.onChange}
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
                          <img src={image.data_url} alt='' />
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
          </Segment>

          <div className='row'>
            <div className='col-12'>
              <div className='card'>
                <div className='card__body'>
                  {this.state.Categories === [] ? null : (
                    <Table
                      limit='1000'
                      headData={customerTableHead}
                      renderHead={(item, index) => renderHead(item, index)}
                      bodyData={this.state.Categories}
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
export default Categories
