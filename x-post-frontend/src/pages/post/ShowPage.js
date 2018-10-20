import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Header, Menu, Segment } from 'semantic-ui-react'
import { push } from 'connected-react-router'
import { selectors as authSelectors } from '../../ducks/auth'
import { selectors as postSelectors } from '../../ducks/post'
import AppLayout from '../../layouts/AppLayout'
import DisplayRenderer from '../../editor/renderers/DisplayRenderer'
import {
  postReadApiRequest,
  postReadByUsernameAndSlugApiRequest,
  postDeleteApiRequest,
} from '../../ducks/post'

class ShowPage extends Component {
  static propTypes = {
    post: PropTypes.object,
    postRead: PropTypes.func,
  }

  componentDidMount() {
    this.fetchPost()
  }

  handleDeletePostClick = () => {
    this.deletePost()
  }

  fetchPost = async () => {
    let {
      userId,
      postId,
      username,
      postSlug,
      postReadByUsernameAndSlug,
      postRead,
    } = this.props

    let result = {}

    if (username) {
      result = await postReadByUsernameAndSlug(username, postSlug)
    }
    if (userId) {
      result = await postRead(userId, postId)
    }

    if (result.error) {
      return alert(result.error.message)
    }
  }

  deletePost = async () => {
    if (!window.confirm('sure?')) {
      return
    }

    let {
      postDelete,
      post,
      push,
    } = this.props
    let result = await postDelete(post.authorId, post.id)

    if (result.error) {
      return alert(result.error.message)
    }
    push('/')
  }

  render() {
    let {
      post,
      isAuth,
      loggedUserId,
    } = this.props

    return (
      <AppLayout placeholder>
        {isAuth && loggedUserId === post.authorId && (
          <Menu inverted compact>
            <Menu.Item as={Link} to={`/post/${post.id}/edit`} name="Edit" />
            <Menu.Item onClick={this.handleDeletePostClick} name="Delete" />
          </Menu>
        )}
        <Header size="huge">{post.title}</Header>
        {post.subtitle && (
          <Header sub>{post.subtitle}</Header>
        )}
        <Segment>
          <DisplayRenderer blocks={post.blocks} />
        </Segment>
      </AppLayout>
    )
  }
}

export default withRouter(connect(({ posts, users, auth }, { match }) => {
  let {
    username,
    postSlug,
    userId,
    postId,
  } = match.params
  let post = {}

  if (username) {
    post = postSelectors.getPostByUsernameAndSlug(posts, users, username, postSlug)
  }
  if (userId) {
    post = postSelectors.getPost(posts, postId)
  }

  return {
    username,
    postSlug,
    userId,
    postId,
    post,
    isAuth: authSelectors.getIsAuth(auth),
    loggedUserId: authSelectors.getLoggedUserId(auth),
  }
}, {
  postRead: postReadApiRequest,
  postReadByUsernameAndSlug: postReadByUsernameAndSlugApiRequest,
  postDelete: postDeleteApiRequest,
  push,
})(ShowPage))
