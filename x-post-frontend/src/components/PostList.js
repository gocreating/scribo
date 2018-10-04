import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors as authSelector } from '../ducks/auth'
import {
  postListApiRequest,
  selectors as postSelector,
} from '../ducks/post'
import PostAbstract from './PostAbstract'

class PostList extends Component {
  static propTypes = {
    posts: PropTypes.array,
    postList: PropTypes.func,
  }

  componentDidMount() {
    this.fetchPosts()
  }

  fetchPosts = async () => {
    let {
      postList,
      userId,
    } = this.props
    let result = await postList(userId)

    if (result.error) {
      return alert(result.error.message)
    }
  }

  render() {
    let { posts } = this.props

    return (
      posts.map(post => (
        <PostAbstract
          key={post.id}
          post={post}
        />
      ))
    )
  }
}

export default connect(({ auth, posts }) => ({
  userId: authSelector.getLoggedUserId(auth),
  posts: postSelector.getPosts(posts),
}), {
  postList: postListApiRequest,
})(PostList)
