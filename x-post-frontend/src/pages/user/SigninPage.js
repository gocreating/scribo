import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'
import { push } from 'connected-react-router'
import AppLayout from '../../layouts/AppLayout'
import SigninForm from '../../forms/user/SigninForm'
import { signinApiRequest } from '../../ducks/user'

class NewPage extends Component {
  static propTypes = {
    signin: PropTypes.func,
    push: PropTypes.func,
  }

  handleSubmit = async (data) => {
    let result = await this.props.signin(data)

    if (result.error) {
      return alert(result.error.message)
    }
    this.props.push('/')
  }

  render() {
    return (
      <AppLayout>
        <Segment basic>
          <Header>
            Signin
          </Header>
          <SigninForm onSubmit={this.handleSubmit} />
        </Segment>
      </AppLayout>
    )
  }
}

export default connect(null, {
  signin: signinApiRequest,
  push,
})(NewPage)
