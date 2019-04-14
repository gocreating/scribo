import React, { Component } from 'react'
import { connect } from 'react-redux'
import AppLayout from '../../layouts/AppLayout'
import PostList from '../../components/PostList'
import BlankPostList from '../../components/BlankPostList'
import {
  postListMixedApiRequest,
  selectors as postSelector,
} from '../../ducks/post'

class HomePage extends Component {
  componentDidMount() {
    this.fetchPosts()
  }

  fetchPosts = async () => {
    this.props.postListMixed(1, null, (result) => {
      alert(result.error.message)
    })
  }

  render() {
    let { posts, isLoading } = this.props

    return (
      <AppLayout placeholder loading={isLoading}>
        <PostList showAuthor posts={posts} />
        {!isLoading && posts.length === 0 && (
          <BlankPostList subHeader="There is no post." />
        )}
      </AppLayout>
    )
  }
}

export default connect(({ posts, users }) => ({
  posts: postSelector.getMixedPostsWithAuthor(posts, users.entities),
  isLoading: postSelector.getListMixedContext(posts, 1).isPending,
}), {
  postListMixed: postListMixedApiRequest,
})(HomePage)
