import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectors as authSelector } from '../ducks/auth'
import {
  postListApiRequest,
  postDeleteApiRequest,
  selectors as postSelector,
} from '../ducks/post'
import PostAbstract from './PostAbstract'

class PostList extends Component {
  static propTypes = {
    isAuth: PropTypes.bool,
    posts: PropTypes.array,
    postList: PropTypes.func,
  }

  componentDidMount() {
    let { isAuth } = this.props

    if (isAuth) {
      this.fetchPosts()
    }
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

  deletePost = async (postId) => {
    if (!window.confirm('sure?')) {
      return
    }

    let {
      postDelete,
      userId,
    } = this.props
    let result = await postDelete(userId, postId)

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
          onDetele={this.deletePost.bind(this, post.id)}
        />
      ))
    )
  }
}

export default connect(({ auth, posts }) => ({
  isAuth: authSelector.getIsAuth(auth),
  userId: authSelector.getLoggedUserId(auth),
  posts: postSelector.getPosts(posts),
}), {
  postList: postListApiRequest,
  postDelete: postDeleteApiRequest,
})(PostList)
