import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import AppLayout from '../../layouts/AppLayout'
import PostList from '../../components/PostList'
import BlankPostList from '../../utils/BlankPostList'
import { selectors as authSelector } from '../../ducks/auth'
import {
  postListByUsernameApiRequest,
  selectors as postSelector,
} from '../../ducks/post'

class ListPage extends Component {
  static propTypes = {
    isAuth: PropTypes.bool,
    posts: PropTypes.array,
    postListByUsername: PropTypes.func,
  }

  componentDidMount() {
    this.fetchPosts()
  }

  gotoNewPost = () => {
    let { isAuth, push } = this.props

    if (isAuth) {
      push('/post/new')
    } else {
      push('/user/signin')
    }
  }

  fetchPosts = async () => {
    let {
      postListByUsername,
      username,
    } = this.props
    let result = await postListByUsername(username)

    if (result.error) {
      return alert(result.error.message)
    }
  }

  render() {
    let { posts } = this.props

    return (
      <AppLayout placeholder>
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <BlankPostList onInitClick={this.gotoNewPost} />
        )}
      </AppLayout>
    )
  }
}

export default withRouter(connect(({ auth, posts, users }, { match }) => ({
  isAuth: authSelector.getIsAuth(auth),
  username: match.params.username,
  posts: postSelector.getPostsWithAuthor(posts, users),
}), {
  postListByUsername: postListByUsernameApiRequest,
  push,
})(ListPage))
