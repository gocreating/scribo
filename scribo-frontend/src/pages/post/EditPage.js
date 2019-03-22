import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { withRouter } from 'react-router-dom'
import { selectors as authSelectors } from '../../ducks/auth'
import { selectors as postSelectors } from '../../ducks/post'
import AppLayout from '../../layouts/AppLayout'
import NewOrEditForm from '../../forms/post/NewOrEditForm'
import Prompt from '../../components/Prompt'
import {
  postReadApiRequest,
  postUpdateApiRequest,
} from '../../ducks/post'

class EditPage extends Component {
  state = {
    isInitializing: true,
    shouldPreventTransition: true,
  }

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
    await this.setState({ isInitializing: true })

    let result = await this.fetchPost()

    await this.setState({ isInitializing: false })
    if (result) {
      cb(this.props.post)
    }
  }

  handleUpdate = async (data) => {
    let { loggedUser, push } = this.props
    let result = await this.updatePost(data)

    if (result) {
      await this.setState({ shouldPreventTransition: false })
      setImmediate(() => {
        push(`/@${loggedUser.username}/${result.slug}`)
      })
    }
  }

  handleSave = async (data) => {
    await this.updatePost(data)
  }

  render() {
    let { post } = this.props
    let { isInitializing, shouldPreventTransition } = this.state
    let isLoading = post.isNotExist || !post.blocks || isInitializing

    return (
      <AppLayout placeholder={false} container={false} loading={isLoading}>
        <Prompt
          whenTransition={shouldPreventTransition}
          message="您可能有內容尚未儲存，是否確定要離開？"
        />
        <NewOrEditForm
          seriesPostEditable
          onInitialize={this.handleInitialize}
          onSave={this.handleSave}
          onUpdate={this.handleUpdate}
          loading={isLoading}
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
