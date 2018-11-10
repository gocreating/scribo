import { createActions, handleActions } from 'redux-actions'
import { normalize } from 'normalizr'
import postApi from '../api/postApi'
import { addEntities } from './entity'
import { post as postSchema } from '../schema'
import createApiError from '../utils/createApiError'

// Action Creators
const plainActionCreators = createActions({
  POST_LIST_API_SUCCESS: (res) => ({ res }),
  POST_LIST_API_FAILURE: (res) => ({ res }),
  POST_CREATE_API_SUCCESS: (res) => ({ res }),
  POST_CREATE_API_FAILURE: (res) => ({ res }),
  POST_READ_API_SUCCESS: (res) => ({ res }),
  POST_READ_API_FAILURE: (res) => ({ res }),
  POST_UPDATE_API_SUCCESS: (res) => ({ res }),
  POST_UPDATE_API_FAILURE: (res) => ({ res }),
  POST_DELETE_API_SUCCESS: (res) => ({ res }),
  POST_DELETE_API_FAILURE: (res) => ({ res }),
  POST_LIST_MIXED_API_SUCCESS: (res) => ({ res }),
  POST_LIST_MIXED_API_FAILURE: (res) => ({ res }),
  POST_LIST_BY_USERNAME_API_SUCCESS: (res) => ({ res }),
  POST_LIST_BY_USERNAME_API_FAILURE: (res) => ({ res }),
  POST_READ_BY_USERNAME_AND_SLUG_API_SUCCESS: (res) => ({ res }),
  POST_READ_BY_USERNAME_AND_SLUG_API_FAILURE: (res) => ({ res }),
  SET_MIXED_PAGE: (pageId, postIds) => ({
    pageId, postIds,
  }),
  SET_MIXED_PAGE_LOADING_STATUS: (pageId, isLoading) => ({
    pageId, isLoading,
  }),
  SET_USER_PAGE: (username, pageId, postIds) => ({
    username, pageId, postIds,
  }),
  SET_USER_PAGE_LOADING_STATUS: (username, pageId, isLoading) => ({
    username, pageId, isLoading,
  }),
  SET_POST_LOADING_STATUS: (postId, isLoading) => ({
    postId, isLoading,
  }),
})
const thunkActionCreators = {
  postListApiRequest: (userId) => async (dispatch) => {
    try {
      let response = await postApi.list(userId, {
        params: {
          filter: {
            include: 'author',
            fields: {
              id: true,
              authorId: true,
              slug: true,
              headerImage: true,
              title: true,
              subtitle: true,
              abstractBlocks: true,
              createdAt: true,
              updatedAt: true,
            },
            order: 'updatedAt DESC',
          },
        },
      })
      dispatch(postListApiSuccess(response))
      let { result, entities } = normalize(response.body, [postSchema])
      dispatch(addEntities(entities))
      dispatch(setMixedPage(1, result))
      return response.body
    } catch (error) {
      let response = createApiError(error)
      dispatch(postListApiFailure(response))
      return response.body
    }
  },
  postListMixedApiRequest: (username) => async (dispatch) => {
    dispatch(setMixedPageLoadingStatus(1, true))
    try {
      let response = await postApi.listMixed()
      dispatch(postListMixedApiSuccess(response))
      let { result, entities } = normalize(response.body, [postSchema])
      dispatch(addEntities(entities))
      dispatch(setMixedPage(1, result))
      return response.body
    } catch (error) {
      let response = createApiError(error)
      dispatch(postListMixedApiFailure(response))
      return response.body
    } finally {
      dispatch(setMixedPageLoadingStatus(1, false))
    }
  },
  postListByUsernameApiRequest: (username) => async (dispatch) => {
    dispatch(setUserPageLoadingStatus(username, 1, true))
    try {
      let response = await postApi.listByUsername(username)
      dispatch(postListByUsernameApiSuccess(response))
      let { result, entities } = normalize(response.body, [postSchema])
      dispatch(addEntities(entities))
      dispatch(setUserPage(username, 1, result))
      return response.body
    } catch (error) {
      let response = createApiError(error)
      dispatch(postListByUsernameApiFailure(response))
      return response.body
    } finally {
      dispatch(setUserPageLoadingStatus(username, 1, false))
    }
  },
  postCreateApiRequest: (userId, post) => async (dispatch) => {
    try {
      let response = await postApi.create(userId, post)
      dispatch(postCreateApiSuccess(response))
      return response.body
    } catch ({ response }) {
      dispatch(postCreateApiFailure(response))
      return response.body
    }
  },
  postReadApiRequest: (userId, postId) => async (dispatch) => {
    try {
      let response = await postApi.read(userId, postId)
      dispatch(postReadApiSuccess(response))
      let { entities } = normalize(response.body, postSchema)
      dispatch(addEntities(entities))
      return response.body
    } catch (error) {
      let response = createApiError(error)
      dispatch(postReadApiFailure(response))
      return response.body
    }
  },
  postReadByUsernameAndSlugApiRequest: (username, postSlug) => async (dispatch) => {
    let response = null

    try {
      response = await postApi.readByUsernameAndSlug(username, postSlug, {
        params: {
          filter: {
            include: 'author',
          },
        },
      })
      dispatch(postReadByUsernameAndSlugApiSuccess(response))
      let { entities } = normalize(response.body, postSchema)
      dispatch(addEntities(entities))
      return response.body
    } catch (error) {
      let response = createApiError(error)
      dispatch(postReadByUsernameAndSlugApiFailure(response))
      return response.body
    } finally {
      dispatch(setPostLoadingStatus(response.body.id, false))
    }
  },
  postUpdateApiRequest: (userId, postId, post) => async (dispatch) => {
    try {
      let response = await postApi.update(userId, postId, post)
      dispatch(postUpdateApiSuccess(response))
      return response.body
    } catch ({ response }) {
      dispatch(postUpdateApiFailure(response))
      return response.body
    }
  },
  postDeleteApiRequest: (userId, postId) => async (dispatch) => {
    try {
      let response = await postApi.delete(userId, postId)

      dispatch(postDeleteApiSuccess(response))
      return response.body || {}
    } catch ({ response }) {
      dispatch(postDeleteApiFailure(response))
      return response.body || {}
    }
  },
}

export const {
  postListApiSuccess,
  postListApiFailure,
  postCreateApiSuccess,
  postCreateApiFailure,
  postReadApiSuccess,
  postReadApiFailure,
  postUpdateApiSuccess,
  postUpdateApiFailure,
  postDeleteApiSuccess,
  postDeleteApiFailure,
  postListMixedApiSuccess,
  postListMixedApiFailure,
  postListByUsernameApiStart,
  postListByUsernameApiSuccess,
  postListByUsernameApiFailure,
  postReadByUsernameAndSlugApiSuccess,
  postReadByUsernameAndSlugApiFailure,
  setMixedPage,
  setMixedPageLoadingStatus,
  setUserPage,
  setUserPageLoadingStatus,
  setPostLoadingStatus,
} = plainActionCreators
export const {
  postListApiRequest,
  postCreateApiRequest,
  postReadApiRequest,
  postUpdateApiRequest,
  postDeleteApiRequest,
  postListMixedApiRequest,
  postListByUsernameApiRequest,
  postReadByUsernameAndSlugApiRequest,
} = thunkActionCreators

// Reducer
const defaultState = {
  mixedPages: {},
  userPages: {},
}
export default handleActions({
  [addEntities]: (state, { payload: { entities } }) => ({
    ...state,
    ...entities.posts,
  }),
  [setMixedPage]: (state, { payload: { pageId, postIds } }) => {
    let mixedPage = state.mixedPages[pageId] || {}

    return {
      ...state,
      mixedPages: {
        ...state.mixedPages,
        [pageId]: {
          ...mixedPage,
          elements: postIds,
        },
      },
    }
  },
  [setMixedPageLoadingStatus]: (state, { payload: { pageId, isLoading } }) => {
    let mixedPage = state.mixedPages[pageId] || {}

    return {
      ...state,
      mixedPages: {
        ...state.mixedPages,
        [pageId]: {
          ...mixedPage,
          isLoading,
        },
      },
    }
  },
  [setUserPage]: (state, {
    payload: { username, pageId, postIds },
  }) => {
    let userPages = state.userPages[username] || {}
    let userPage = userPages[pageId] || {}

    return {
      ...state,
      userPages: {
        ...state.userPages,
        [username]: {
          ...userPages,
          [pageId]: {
            ...userPage,
            elements: postIds,
          },
        },
      },
    }
  },
  [setUserPageLoadingStatus]: (state, {
    payload: { username, pageId, isLoading },
  }) => {
    let userPages = state.userPages[username] || {}
    let userPage = userPages[pageId] || {}

    return {
      ...state,
      userPages: {
        ...state.userPages,
        [username]: {
          ...userPages,
          [pageId]: {
            ...userPage,
            isLoading,
          },
        },
      },
    }
  },
  [setPostLoadingStatus]: (state, { payload: { postId, isLoading } }) => {
    let post = state[postId] || {}

    return {
      ...state,
      [postId]: {
        ...post,
        isLoading,
      }
    }
  },
}, defaultState)

export let selectors = {
  getMixedPage: (state, pageId) => {
    let mixedPage = state.mixedPages[pageId] || {}

    return mixedPage
  },
  getUserPage: (state, username, pageId) => {
    let userPages = state.userPages[username] || {}
    let userPage = userPages[pageId] || {}

    return userPage
  },
  getMixedPosts(state) {
    let mixedPage = this.getMixedPage(state, '1')
    let elements = mixedPage.elements || []
    let posts = elements.map(postId => state[postId])

    return posts
  },
  getUserPosts(state, username) {
    let userPage = this.getUserPage(state, username, '1')
    let elements = userPage.elements || []
    let posts = elements.map(postId => state[postId])

    return posts
  },
  getMixedPostsLoadingStatus(state) {
    let mixedPage = this.getMixedPage(state, '1')
    let isLoading = mixedPage.isLoading || false

    return isLoading
  },
  getUserPostsLoadingStatus(state, username) {
    let userPage = this.getUserPage(state, username, '1')
    let isLoading = userPage.isLoading || false

    return isLoading
  },
  getMixedPostsWithAuthor(state, userEntity) {
    let posts = this.getMixedPosts(state)

    return posts.map(post => ({
      ...post,
      author: userEntity[post.authorId],
    }))
  },
  getUserPostsWithAuthor(state, userEntity, username) {
    let posts = this.getUserPosts(state, username)

    return posts.map(post => ({
      ...post,
      author: userEntity[post.authorId],
    }))
  },
  getPost: (state, postId) => (state[postId] || { isNotExist: true }),
  getPostByUsernameAndSlug: (posts, users, username, postSlug) => {
    let defaultPost = { isNotExist: true }
    let filteredUserIds = Object
      .keys(users)
      .filter(userId => users[userId].username === username)

    if (filteredUserIds.length === 0) {
      return defaultPost
    }

    let userId = filteredUserIds[0]
    let filteredPostIds = Object
      .keys(posts)
      .filter(postId => {
        let post = posts[postId]

        return (
          post.slug === postSlug &&
          post.authorId === userId
        )
      })

    if (filteredPostIds.length === 0) {
      return defaultPost
    }

    let postId = filteredPostIds[0]

    return posts[postId]
  },
}
