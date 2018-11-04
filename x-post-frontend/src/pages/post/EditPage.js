import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { withRouter } from 'react-router-dom'
import { selectors as authSelectors } from '../../ducks/auth'
import { selectors as postSelectors } from '../../ducks/post'
import AppLayout from '../../layouts/AppLayout'
import NewOrEditForm from '../../forms/post/NewOrEditForm'
import {
  postReadApiRequest,
  postUpdateApiRequest,
} from '../../ducks/post'

class EditPage extends Component {
  static propTypes = {
    post: PropTypes.object,
    postRead: PropTypes.func,
    postUpdate: PropTypes.func,
  }

  fetchPost = async () => {
    let {
      loggedUser,
      postId,
      postRead,
    } = this.props
    let result = await postRead(loggedUser.id, postId)

    if (result.error) {
      return alert(result.error.message)
    }
    return result
  }

  updatePost = async (post) => {
    let { loggedUser, postId, postUpdate } = this.props
    let result = await postUpdate(loggedUser.id, postId, post)

    if (result.error) {
      return alert(result.error.message)
    }
    return result
  }

  handleInitialize = async (cb) => {
    let result = await this.fetchPost()

    if (result) {
      cb(this.props.post)
    }
  }

  handleUpdate = async (data) => {
    let { loggedUser, push } = this.props
    let result = await this.updatePost(data)

    if (result) {
      push(`/@${loggedUser.username}/${result.slug}`)
    }
  }

  handleSave = async (data) => {
    await this.updatePost(data)
  }

  render() {
    return (
      <AppLayout placeholder={false} container={false}>
        <NewOrEditForm
          onInitialize={this.handleInitialize}
          onSave={this.handleSave}
          onUpdate={this.handleUpdate}
        />
      </AppLayout>
    )
  }
}

export default withRouter(connect(({ auth, posts }, { match }) => {
  let loggedUser = authSelectors.getLoggedUser(auth)
  let { postId } = match.params
  let post = postSelectors.getPost(posts, postId)

  return {
    loggedUser,
    postId,
    post,
  }
}, {
  postRead: postReadApiRequest,
  postUpdate: postUpdateApiRequest,
  push,
})(EditPage))
