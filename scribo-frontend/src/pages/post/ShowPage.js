import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  Message,
  Grid,
  Divider,
  Container,
  Header,
  List,
  Image,
  Segment,
  Label,
} from 'semantic-ui-react'
import { push } from 'connected-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { selectors as authSelectors } from '../../ducks/auth'
import { selectors as postSelectors } from '../../ducks/post'
import AppLayout from '../../layouts/AppLayout'
import DisplayRenderer from '../../editor/renderers/DisplayRenderer'
import PageLoading from '../../components/PageLoading'
import Timestamp from '../../components/Timestamp'
import DisqusThread from '../../components/DisqusThread'
import {
  postReadByUsernameAndSlugApiRequest,
  postDeleteApiRequest,
} from '../../ducks/post'
import './ShowPage.scss'

class ShowPage extends Component {
  static propTypes = {
    username: PropTypes.string,
    postSlug: PropTypes.string,
    post: PropTypes.object,
    seriesPosts: PropTypes.arrayOf(PropTypes.object),
    isLoading: PropTypes.bool,
    isAuth: PropTypes.bool,
    loggedUserId: PropTypes.string,
    postReadByUsernameAndSlug: PropTypes.func,
    postDelete: PropTypes.func,
    push: PropTypes.func,
  }

  componentDidMount() {
    this.fetchPost()
  }

  componentDidUpdate(prevProps) {
    let { username, postSlug } = this.props

    if (
      username !== prevProps.username ||
      postSlug !== prevProps.postSlug
    ) {
      this.fetchPost()
    }
  }

  handleDeletePostClick = () => {
    this.deletePost()
  }

  fetchPost = () => {
    let {
      postReadByUsernameAndSlug,
      username,
      postSlug,
    } = this.props

    postReadByUsernameAndSlug(username, postSlug)
  }

  deletePost = () => {
    let {
      postDelete,
      post,
      push,
      username,
    } = this.props

    if (post.seriesCount > 0) {
      alert(`本文章包含 ${post.seriesCount} 篇系列文章，請移除所有系列文章後再刪除。`)
      return
    }
    if (!window.confirm('sure?')) {
      return
    }

    postDelete(post.authorId, post.id, () => {
      push(`/@${username}`)
    }, (result) => {
      alert(result.error.message)
    })
  }

  render() {
    let {
      username,
      post,
      seriesPosts,
      isLoading,
      isError,
      isAuth,
      loggedUserId,
    } = this.props
    let headerImage = post.headerImage || {}
    let createdAt = post.customCreatedAt || post.createdAt
    let updatedAt = post.customUpdatedAt || post.updatedAt
    let isUpdated = (
      createdAt &&
      updatedAt &&
      moment(updatedAt).diff(createdAt) > 1000
    )

    if (isError) {
      return (
        <AppLayout placeholder title="無法顯示文章">
          <Message negative>
            <Message.Header>無法顯示文章</Message.Header>
            <p>很抱歉，您所瀏覽的文章可能不存在。</p>
          </Message>
        </AppLayout>
      )
    }

    return (
      <AppLayout
        placeholder={false}
        container={false}
        title={post.title}
      >
        <div className="post-header-container">
          {headerImage.src && (
            <Image
              fluid
              centered
              src={headerImage.src}
            />
          )}
          {post.title && (
            <Divider hidden />
          )}
          <Container>
            {post.title && (
              <Header size="huge" className="post-header web-font">
                {post.title}
                {post.subtitle && (
                  <Header.Subheader className="web-font">
                    <Divider hidden />
                    {post.subtitle}
                  </Header.Subheader>
                )}
              </Header>
            )}
            {post.title && (
              <Divider hidden section />
            )}
          </Container>
        </div>
        <Container>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={12}>
                <div className="white background">
                  <PageLoading active={isLoading} />
                  {!isLoading && (
                    <Segment padded="very" attached="top">
                      <DisplayRenderer blocks={post.blocks} />
                    </Segment>
                  )}
                </div>
              </Grid.Column>
              <Grid.Column width={4}>
                {isAuth && loggedUserId === post.authorId && (
                  <List link>
                    <List.Item
                      as={Link}
                      to={`/post/${post.id}/edit`}
                    >
                      編輯文章
                    </List.Item>
                    <List.Item
                      as={Link}
                      to="#"
                      onClick={this.handleDeletePostClick}
                    >
                      刪除文章
                    </List.Item>
                  </List>
                )}
                <List horizontal relaxed size="big">
                  <List.Item>
                    <Image avatar src={`${process.env.PUBLIC_URL}/img/default-avatar.png`} />
                    <List.Content>
                      <List.Header>
                        <Link to={`/@${username}`}>{username}</Link>
                      </List.Header>
                    </List.Content>
                  </List.Item>
                </List>

                <List relaxed>
                  {!isLoading && (
                    <List.Item>
                      <List.Icon style={{ borderBottom: 0 }}>
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </List.Icon>
                      <List.Content>
                        <p>
                          <Timestamp prefix="發表於 " relative>
                            {createdAt}
                          </Timestamp>
                          {isUpdated && ([
                            <br key="0" />,
                            <Timestamp key="1" prefix="最後更新於 " relative>
                              {updatedAt}
                            </Timestamp>
                          ])}
                        </p>
                      </List.Content>
                    </List.Item>
                  )}
                </List>
              </Grid.Column>
            </Grid.Row>
            {seriesPosts.length > 0 && (
              <Grid.Row>
                <Grid.Column width={12}>
                  <Segment secondary padded="very" color="blue">
                    <List divided relaxed="very" size="big">
                      {seriesPosts.map((seriesPost, idx) => (
                        <List.Item key={seriesPost.id}>
                          <List.Content>
                            <Label style={{ float:'right' }}>
                              # {idx + 1}
                            </Label>
                            <List.Header
                              as={Link}
                              to={`/@${username}/${seriesPost.slug}`}
                              className="web-font"
                            >
                              {seriesPost.title}
                            </List.Header>
                            <span className="web-font">
                              {seriesPost.subtitle}
                            </span>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List>
                  </Segment>
                </Grid.Column>
              </Grid.Row>
            )}
            <Grid.Row>
              <Grid.Column width={12}>
                {post.blocks && (
                  <DisqusThread
                    id={`post-id-${post.id}`}
                    path={`/@${username}/${post.slug}`}
                  />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </AppLayout>
    )
  }
}

export default withRouter(connect(({ posts, users, auth }, { match }) => {
  let {
    username,
    postSlug,
  } = match.params
  let post = postSelectors.getPostByUsernameAndSlug(
    posts, users.entities, username, postSlug
  )
  let ctxPost = postSelectors.getEntitiesContext(posts, username, postSlug)
  let seriesPosts = post.seriesPosts || []

  seriesPosts.sort((a, b) => a.order - b.order)

  return {
    username,
    postSlug,
    post,
    seriesPosts,
    isLoading: ctxPost.isPending,
    isError: ctxPost.isRejected,
    isAuth: authSelectors.getIsAuth(auth),
    loggedUserId: authSelectors.getLoggedUserId(auth),
  }
}, {
  postReadByUsernameAndSlug: postReadByUsernameAndSlugApiRequest,
  postDelete: postDeleteApiRequest,
  push,
})(ShowPage))
