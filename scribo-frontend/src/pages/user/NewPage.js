import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'
import { push } from 'connected-react-router'
import AppLayout from '../../layouts/AppLayout'
import SignupForm from '../../forms/user/SignupForm'
import { signupApiRequest } from '../../ducks/user'

class NewPage extends Component {
  static propTypes = {
    signup: PropTypes.func,
    push: PropTypes.func,
  }

  handleSubmit = async (data) => {
    let result = await this.props.signup(data)

    if (result.error) {
      return alert(result.error.message)
    }
    this.props.push('/user/signin')
  }

  render() {
    return (
      <AppLayout>
        <Segment basic>
          <Header>
            Signup
          </Header>
          <SignupForm onSubmit={this.handleSubmit} />
        </Segment>
      </AppLayout>
    )
  }
}

export default connect(null, {
  signup: signupApiRequest,
  push,
})(NewPage)
