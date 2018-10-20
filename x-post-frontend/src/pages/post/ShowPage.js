import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Header, Segment } from 'semantic-ui-react'
import { selectors as postSelectors } from '../../ducks/post'
import AppLayout from '../../layouts/AppLayout'
import DisplayRenderer from '../../editor/renderers/DisplayRenderer'
import {
  postReadApiRequest,
  postReadByUsernameAndSlugApiRequest,
} from '../../ducks/post'

class ShowPage extends Component {
  static propTypes = {
    post: PropTypes.object,
    postRead: PropTypes.func,
  }

  componentDidMount() {
    this.fetchPost()
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

  render() {
    let { post } = this.props

    return (
      <AppLayout placeholder>
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

export default withRouter(connect(({ posts, users }, { match }) => {
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
  }
}, {
  postRead: postReadApiRequest,
  postReadByUsernameAndSlug: postReadByUsernameAndSlugApiRequest,
})(ShowPage))
