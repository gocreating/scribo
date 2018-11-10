import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import AppLayout from '../../layouts/AppLayout'
import PostList from '../../components/PostList'
import BlankPostList from '../../components/BlankPostList'
import { selectors as authSelector } from '../../ducks/auth'
import {
  postListByUsernameApiRequest,
  selectors as postSelector,
} from '../../ducks/post'

class ListPage extends Component {
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
    let { posts, isLoading } = this.props

    return (
      <AppLayout placeholder loading={isLoading}>
        <PostList posts={posts} />
        {!isLoading && posts.length === 0 && (
          <BlankPostList onInitClick={this.gotoNewPost} />
        )}
      </AppLayout>
    )
  }
}

export default withRouter(connect(({ auth, posts, users }, { match }) => {
  let { username } = match.params

  return {
    isAuth: authSelector.getIsAuth(auth),
    username,
    posts: postSelector.getUserPostsWithAuthor(posts, users, username),
    isLoading: postSelector.getUserPostsLoadingStatus(posts, username),
  }
}, {
  postListByUsername: postListByUsernameApiRequest,
  push,
})(ListPage))
