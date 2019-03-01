import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { push } from 'connected-react-router'
import { Grid, Pagination } from 'semantic-ui-react'
import qs from 'query-string'
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

  componentDidUpdate(prevProps) {
    if (prevProps.pageId !== this.props.pageId) {
      this.fetchPosts()
    }
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
      pageId,
    } = this.props
    let result = await postListByUsername(username, pageId)

    if (result.error) {
      return alert(result.error.message)
    }
  }

  handlePageChange = (e, data) => {
    let { push, query } = this.props
    let search = qs.stringify({
      ...query,
      page: data.activePage,
    })

    push({ search })
  }

  render() {
    let { posts, isLoading, pageId, meta } = this.props

    return (
      <AppLayout placeholder loading={isLoading}>
        <PostList posts={posts} />
        {!isLoading && posts.length === 0 && (
          <BlankPostList onInitClick={this.gotoNewPost} />
        )}
        {meta.total > meta.limit && (
          <Grid centered>
            <Pagination
              text
              activePage={pageId}
              totalPages={Math.ceil(meta.total / meta.limit)}
              onPageChange={this.handlePageChange}
            />
          </Grid>
        )}
      </AppLayout>
    )
  }
}

export default withRouter(connect(({
  auth, posts, users,
}, {
  match, location,
}) => {
  let { username } = match.params
  let query = qs.parse(location.search)
  let pageId = query.page || 1
  let meta = postSelector.getUserPagesMeta(posts, username)

  return {
    isAuth: authSelector.getIsAuth(auth),
    username,
    posts: postSelector.getUserPostsWithAuthor(posts, users, username, pageId),
    isLoading: postSelector.getUserPostsLoadingStatus(posts, username, pageId),
    query,
    pageId,
    meta,
  }
}, {
  postListByUsername: postListByUsernameApiRequest,
  push,
})(ListPage))
