import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { Card, Image, Header, Divider } from 'semantic-ui-react'
import { selectors as authSelector } from '../ducks/auth'
import {
  postListApiRequest,
  selectors as postSelector,
} from '../ducks/post'
import BlankPostList from '../utils/BlankPostList'

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

  gotoNewPost = () => {
    this.props.push('/post/new')
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

    if (posts.length > 0) {
      return (
        <Card.Group doubling stackable itemsPerRow={3}>
          {posts.map(post => (
            <Card key={post.id}>
              {post.headerImage && post.headerImage.src && (
                <Image
                  as={Link}
                  to={`/@${post.author.username}/${post.slug}`}
                  src={post.headerImage.src}
                />
              )}
              <Card.Content>
                <Header
                  size="huge"
                  className="post-header web-font"
                  as={Link}
                  to={`/@${post.author.username}/${post.slug}`}
                >
                  {post.title}
                  {post.subtitle && (
                    <Header.Subheader className="web-font">
                      <Divider hidden />
                      {post.subtitle}
                    </Header.Subheader>
                  )}
                </Header>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      )
    } else {
      return (
        <BlankPostList
          onInitClick={this.gotoNewPost}
        />
      )
    }
  }
}

export default connect(({ auth, posts, users }) => ({
  isAuth: authSelector.getIsAuth(auth),
  userId: authSelector.getLoggedUserId(auth),
  posts: postSelector.getPostsWithAuthor(posts, users),
}), {
  postList: postListApiRequest,
  push,
})(PostList)
