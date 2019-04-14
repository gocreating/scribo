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
  static propTypes = {
    post: PropTypes.object,
    postRead: PropTypes.func,
    postUpdate: PropTypes.func,
  }

  handleInitialize = (cb) => {
    let { postRead, loggedUser, postId } = this.props

    postRead(loggedUser.id, postId, (result) => {
      cb(this.props.post)
    }, (result) => {
      alert(result.error.message)
    })
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
    let { post, isInitializing, isSaveOnly, isPending, isFulfilled } = this.props
    let isLoading = post.isNotExist || !post.blocks || isInitializing

    return (
      <AppLayout
        placeholder={false} 
        container={false}
        loading={isLoading}
        title="編輯文章"
      >
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
  let ctxRead = postSelectors.getReadContext(posts)
  let ctxUpdate = postSelectors.getUpdateContext(posts)
  let { postId } = match.params
  let post = postSelectors.getPost(posts, postId)

  return {
    loggedUser,
    postId,
    post,
    isInitializing: ctxRead.isPending,
    isSaveOnly: ctxUpdate.isSaveOnly,
    isPending: ctxUpdate.isPending,
    isFulfilled: ctxUpdate.isFulfilled,
  }
}, {
  postRead: postReadApiRequest,
  postUpdate: postUpdateApiRequest,
  push,
})(EditPage))
