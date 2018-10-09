import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { selectors } from '../../ducks/auth'
import AppLayout from '../../layouts/AppLayout'
import NewOrEditForm from '../../forms/post/NewOrEditForm'
import { postCreateApiRequest } from '../../ducks/post'

class NewPage extends Component {
  static propTypes = {
    postCreate: PropTypes.func,
    push: PropTypes.func,
  }

  handleCreate = async (data) => {
    let {
      postCreate,
      userId,
      push,
    } = this.props
    let result = await postCreate(userId, data)

    if (result.error) {
      return alert(result.error.message)
    }
    push('/')
  }

  render() {
    return (
      <AppLayout placeholder>
        <NewOrEditForm onCreate={this.handleCreate} />
      </AppLayout>
    )
  }
}

export default connect(({ auth }) => ({
  userId: selectors.getLoggedUserId(auth),
}), {
  postCreate: postCreateApiRequest,
  push,
})(NewPage)
