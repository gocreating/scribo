import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Header, Segment } from 'semantic-ui-react'
import { selectors as postSelectors } from '../../ducks/post'
import AppLayout from '../../layouts/AppLayout'
import DisplayRenderer from '../../editor/renderers/DisplayRenderer'
import { postReadApiRequest } from '../../ducks/post'

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
      postRead,
    } = this.props

    let result = await postRead(userId, postId)

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

export default withRouter(connect(({ posts }, { match }) => {
  let { userId, postId } = match.params
  let post = postSelectors.getPost(posts, postId)

  return {
    userId,
    postId,
    post,
  }
}, {
  postRead: postReadApiRequest,
})(ShowPage))
