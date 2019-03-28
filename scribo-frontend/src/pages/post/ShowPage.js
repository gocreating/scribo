import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  Grid,
  Divider,
  Container,
  Header,
  List,
  Image,
  Segment,
  Label,
} from 'semantic-ui-react'
import qs from 'query-string'
import { push } from 'connected-react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTags, faFolder } from '@fortawesome/free-solid-svg-icons'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { selectors as authSelectors } from '../../ducks/auth'
import { selectors as postSelectors } from '../../ducks/post'
import AppLayout from '../../layouts/AppLayout'
import DisplayRenderer from '../../editor/renderers/DisplayRenderer'
// import DonationForm from '../../forms/post/DonationForm'
import DonationMessage from '../../components/DonationMessage'
import PageLoading from '../../components/PageLoading'
import Timestamp from '../../components/Timestamp'
import DisqusThread from '../../components/DisqusThread'
import {
  postReadApiRequest,
  postReadByUsernameAndSlugApiRequest,
  postDeleteApiRequest,
} from '../../ducks/post'
import './ShowPage.scss'

class ShowPage extends Component {
  static propTypes = {
    post: PropTypes.object,
    postRead: PropTypes.func,
  }

  state = {
    isMessageVisible: false,
  }

  componentDidMount() {
    let { query } = this.props
    let { donationSuccessCode, donationErrorCode } = query

    if (donationErrorCode || donationSuccessCode) {
      this.setState({ isMessageVisible: true })
    }
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

  handleMessageDismiss = () => {
    this.setState({ isMessageVisible: false })
  }

  handleDeletePostClick = () => {
    this.deletePost()
  }

  fetchPost = async () => {
    let {
      userId,
      postId,
      username,
      postSlug,
      postReadByUsernameAndSlug,
      postRead,
    } = this.props

    let result = {}

    if (username) {
      result = await postReadByUsernameAndSlug(username, postSlug)
    }
    if (userId) {
      result = await postRead(userId, postId)
    }

    if (result.error) {
      return alert(result.error.message)
    }
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
      query,
      username,
      post,
      seriesPosts,
      isLoading,
      isAuth,
      loggedUserId,
      // accessToken,
    } = this.props
    let { isMessageVisible } = this.state
    let { donationSuccessCode, donationErrorCode } = query
    let headerImage = post.headerImage || {}
    let createdAt = post.customCreatedAt || post.createdAt
    let updatedAt = post.customUpdatedAt || post.updatedAt
    let isUpdated = (
      createdAt &&
      updatedAt &&
      moment(updatedAt).diff(createdAt) > 1000
    )

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
            <DonationMessage
              visible={isMessageVisible}
              successCode={donationSuccessCode}
              errorCode={donationErrorCode}
              onDismiss={this.handleMessageDismiss}
            />
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

                  {/* <List.Item>
                    <List.Icon style={{ borderBottom: 0 }}>
                      <FontAwesomeIcon icon={faFolder} />
                    </List.Icon>
                    <List.Content>
                      <List.Header>Categories</List.Header>
                      <List.List>
                        <List.Item>Coding</List.Item>
                        <List.Item>Life</List.Item>
                      </List.List>
                    </List.Content>
                  </List.Item> */}

                  {/* <List.Item>
                    <List.Icon style={{ borderBottom: 0 }}>
                      <FontAwesomeIcon icon={faTags} />
                    </List.Icon>
                    <List.Content>
                      <List.Header>Tags</List.Header>
                      <List.Description>
                        <Label.Group>
                          <Label size="small"># nodejs</Label>
                          <Label size="small"># css</Label>
                        </Label.Group>
                      </List.Description>
                    </List.Content>
                  </List.Item> */}

                  {/* <Divider section />
                  <DonationForm
                    getHint={(amount) => (
                      `Donate NT$ ${amount} to Author`
                    )}
                    getRemindInfo={(amount) => (
                      'Part of the donation will be used ' +
                      'for hosting scribo service. ' +
                      'If you have any problem, ' +
                      'please contact: gocreating@gmail.com'
                    )}
                    getLinkPath={(amount) => (
                      `/api/payments/ecpay/donation?` +
                      `amount=${amount}&` +
                      `recipient=${username}&` +
                      `postId=${post.id}&` +
                      `access_token=${accessToken}`
                    )}
                  /> */}

                  {/* Share Links */}
                  {/* Vote up / vote down */}
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
                    title={post.title}
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

export default withRouter(connect(({ posts, users, auth }, { match, location }) => {
  let query = qs.parse(location.search)
  let {
    username,
    postSlug,
    userId,
    postId,
  } = match.params
  let post = {}
  let isLoading = false

  if (username) {
    post = postSelectors.getPostByUsernameAndSlug(posts, users, username, postSlug)
  }
  if (userId) {
    post = postSelectors.getPost(posts, postId)
  }
  if (post.isNotExist || !post.blocks) {
    isLoading = true
  }

  let seriesPosts = post.seriesPosts || []

  seriesPosts.sort((a, b) => a.order - b.order)

  return {
    query,
    username,
    postSlug,
    userId,
    postId,
    post,
    seriesPosts,
    isLoading,
    isAuth: authSelectors.getIsAuth(auth),
    loggedUserId: authSelectors.getLoggedUserId(auth),
    // accessToken: authSelectors.getAccessToken(auth),
  }
}, {
    postRead: postReadApiRequest,
    postReadByUsernameAndSlug: postReadByUsernameAndSlugApiRequest,
    postDelete: postDeleteApiRequest,
    push,
  })(ShowPage))
