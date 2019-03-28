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

  handleInitialize = async (cb) => {
    await this.setState({ isInitializing: true })

    let result = await this.fetchPost()

    await this.setState({ isInitializing: false })
    if (result) {
      cb(this.props.post)
    }
  }

  handleUpdate = (post) => {
    let { postUpdate, postId } = this.props

    postUpdate(postId, post, false, null, (result) => {
      alert(result.error.message)
    })
  }

  handleSave = (post) => {
    let { postUpdate, postId } = this.props

    postUpdate(postId, post, true, null, (result) => {
      alert(result.error.message)
    })
  }

  render() {
    let { post, isSaveOnly, isPending, isFulfilled } = this.props
    let { isInitializing } = this.state
    let isLoading = post.isNotExist || !post.blocks || isInitializing

    return (
      <AppLayout placeholder={false} container={false} loading={isLoading}>
        {!isFulfilled && (
          <Prompt message="您可能有內容尚未儲存，是否確定要離開？" />
        )}
        <NewOrEditForm
          seriesPostEditable
          isSaving={isSaveOnly && isPending}
          isUpdating={!isSaveOnly && isPending}
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
  let ctx = postSelectors.getUpdateContext(posts)
  let { postId } = match.params
  let post = postSelectors.getPost(posts, postId)

  return {
    loggedUser,
    postId,
    post,
    isSaveOnly: ctx.isSaveOnly,
    isPending: ctx.isPending,
    isFulfilled: ctx.isFulfilled,
  }
}, {
  postRead: postReadApiRequest,
  postUpdate: postUpdateApiRequest,
  push,
})(EditPage))
