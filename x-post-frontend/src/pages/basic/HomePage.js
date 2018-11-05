import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppLayout from '../../layouts/AppLayout'
import PostList from '../../components/PostList'
import BlankPostList from '../../utils/BlankPostList'
import {
  postListMixedApiRequest,
  selectors as postSelector,
} from '../../ducks/post'

class HomePage extends Component {
  componentDidMount() {
    this.fetchPosts()
  }

  fetchPosts = async () => {
    let { postListMixed } = this.props
    let result = await postListMixed()

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
          <BlankPostList subHeader="There is no post." />
        )}
      </AppLayout>
    )
  }
}

export default connect(({ posts, users }) => ({
  posts: postSelector.getMixedPostsWithAuthor(posts, users),
}), {
  postListMixed: postListMixedApiRequest,
})(HomePage)
