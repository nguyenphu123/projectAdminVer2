import React, { Component } from 'react'
import axios from 'axios'
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import LoginAction from '../redux/actions/LoginAction'
var SHA256 = require('crypto-js/sha256')
class Login extends Component {
  state = { name: '', password: '', login: false }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })
  handleSubmit = () => {
    const { name, password } = this.state
    const authData = {
      UserName: name,
      Password: SHA256(password).toString()
    }

    if (name && password) {
      axios({
        method: 'post',
        url: '/api/login-management',
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(authData)
      })
        .then(res => {
          console.log(res)

          if (
            res.data === null ||
            res.data.Point === 0 ||
            res.data.RoleId !== '6e870632-c295-4e9f-969f-d09ae2db13f9'
          ) {
            toast.warn(
              'Account does not exist or you do not have permission to login'
            )
            console.log(res)
          } else {
            console.log(res)

            this.setState({ login: true })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      toast.warn('Please fill all required information')
    }
  }

  render () {
    const { name, password } = this.state
    if (this.state.login) {
      return (
        <>
          <Redirect to={'/dashboard'} />
        </>
      )
    } else {
      return (
        <>
          <Grid
            textAlign='center'
            style={{ height: '100vh' }}
            verticalAlign='middle'
          >
            <Grid.Column style={{ maxWidth: 450 }}>
              <Header as='h2' color='teal' textAlign='center'>
                Log-in to your account
              </Header>
              <Form onSubmit={this.handleSubmit} size='large'>
                <Segment stacked>
                  <Form.Input
                    fluid
                    icon='user'
                    iconPosition='left'
                    placeholder='UserName'
                    name='name'
                    value={name}
                    onChange={this.handleChange}
                  />
                  <Form.Input
                    fluid
                    icon='lock'
                    iconPosition='left'
                    placeholder='Password'
                    type='password'
                    name='password'
                    value={password}
                    onChange={this.handleChange}
                  />

                  <Button content='Submit' color='teal' fluid size='large'>
                    Login
                  </Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
          <ToastContainer autoClose={5000} />
        </>
      )
    }
  }
}
export default Login
