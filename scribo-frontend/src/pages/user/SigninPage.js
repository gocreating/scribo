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
    let { signin, push } = this.props
    let result

    if (data.emailOrUsername.indexOf('@') >= 0) {
      result = await signin({
        email: data.emailOrUsername,
        password: data.password,
      })
    } else {
      result = await signin({
        username: data.emailOrUsername,
        password: data.password,
      })
    }

    if (result.error) {
      return alert(result.error.message)
    }
    push(`/@${result.user.username}`)
  }

  render() {
    return (
      <AppLayout>
        <Segment basic>
          <Header>
            登入Scribo
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
