import { combineReducers } from 'redux'
import { createActions, handleActions } from 'redux-actions'
import { select, call, put, takeEvery } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { normalize } from 'normalizr'
import postApi from '../api/postApi'
import { addEntities } from './entity'
import { post as postSchema } from '../schema'
import { selectors as authSelectors } from './auth'
import createApiError from '../utils/createApiError'
import zipSeriesPostsOrder from '../utils/zipSeriesPostsOrder'

// Action Creators
const plainActionCreators = createActions({
  POST_LIST_API_SUCCESS: (res) => ({ res }),
  POST_LIST_API_FAILURE: (res) => ({ res }),
  POST_CREATE_API_REQUEST: (post, resolve, reject) => ({ post, resolve, reject }),
  POST_CREATE_API_SUCCESS: (res) => ({ res }),
  POST_CREATE_API_FAILURE: (res) => ({ res }),
  POST_READ_API_REQUEST: (userId, postId, resolve, reject) => ({
    userId, postId, resolve, reject,
  }),
  POST_READ_API_SUCCESS: (res) => ({ res }),
  POST_READ_API_FAILURE: (res) => ({ res }),
  POST_UPDATE_API_REQUEST: (postId, post, isSaveOnly, resolve, reject) => ({
    postId, post, isSaveOnly, resolve, reject,
  }),
  POST_UPDATE_API_SUCCESS: (res) => ({ res }),
  POST_UPDATE_API_FAILURE: (res) => ({ res }),
  POST_DELETE_API_REQUEST: (userId, postId, resolve, reject) => ({
    userId, postId, resolve, reject,
  }),
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
  SET_USER_PAGE: (username, pageId, meta, postIds) => ({
    username, pageId, meta, postIds,
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
  postListByUsernameApiRequest: (username, pageId) => async (dispatch) => {
    dispatch(setUserPageLoadingStatus(username, pageId, true))
    try {
      let response = await postApi.listByUsername(username, {
        params: {
          pageId,
        },
      })
      dispatch(postListByUsernameApiSuccess(response))
      let { posts, meta } = response.body
      let { result, entities } = normalize(posts, [postSchema])
      dispatch(addEntities(entities))
      dispatch(setUserPage(username, pageId, meta, result))
      return response.body
    } catch (error) {
      let response = createApiError(error)
      dispatch(postListByUsernameApiFailure(response))
      return response.body
    } finally {
      dispatch(setUserPageLoadingStatus(username, pageId, false))
    }
  },
  postReadByUsernameAndSlugApiRequest: (username, postSlug) => async (dispatch) => {
    let response = null

    try {
      response = await postApi.readByUsernameAndSlug(username, postSlug)
      dispatch(postReadByUsernameAndSlugApiSuccess(response))
      let { entities } = normalize(response.body, postSchema)
      entities.posts = zipSeriesPostsOrder(entities.posts)
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
}
// Sagas
export const sagas = {
  *handlePostCreateApiRequest(action) {
    let { post, resolve, reject } = action.payload

    try {
      let loggedUser = yield select(({ auth }) => authSelectors.getLoggedUser(auth))
      let response = yield call(postApi.create, loggedUser.id, post)
      let { slug } = response.body

      yield put(postCreateApiSuccess(response))
      yield put(push(`/@${loggedUser.username}/${slug}`))
      resolve && (yield call(resolve, response.body))
    } catch (error) {
      let response = createApiError(error)

      yield put(postCreateApiFailure(response))
      reject && (yield call(reject, response.body))
    }
  },
  *handlePostReadApiRequest(action) {
    let { userId, postId, resolve, reject } = action.payload

    try {
      let response = yield call(postApi.read, userId, postId)
      let { entities } = normalize(response.body, postSchema)

      entities.posts = zipSeriesPostsOrder(entities.posts)
      yield put(postReadApiSuccess(response))
      yield put(addEntities(entities))
      resolve && (yield call(resolve, response.body))
    } catch (error) {
      let response = createApiError(error)

      yield put(postReadApiFailure(response))
      reject && (yield call(reject, response.body))
    }
  },
  *handlePostUpdateApiRequest(action) {
    let { postId, post, isSaveOnly, resolve, reject } = action.payload

    try {
      let loggedUser = yield select(({ auth }) => authSelectors.getLoggedUser(auth))
      let response = yield call(postApi.update, loggedUser.id, postId, post)
      let { slug } = response.body

      yield put(postUpdateApiSuccess(response))

      if (!isSaveOnly) {
        yield put(push(`/@${loggedUser.username}/${slug}`))
      }
      resolve && (yield call(resolve, response.body))
    } catch (error) {
      let response = createApiError(error)

      yield put(postUpdateApiFailure(response))
      reject && (yield call(reject, response.body))
    }
  },
  *handlePostDeleteApiRequest(action) {
    let { userId, postId, resolve, reject } = action.payload

    try {
      let response = yield call(postApi.delete, userId, postId)

      yield put(postDeleteApiSuccess(response))
      resolve && (yield call(resolve, response.body))
    } catch (error) {
      let response = createApiError(error)

      yield put(postDeleteApiFailure(response))
      reject && (yield call(reject, response.body))
    }
  },
}
export const rootSaga = {
  *onPostCreateApiRequest() {
    yield takeEvery(postCreateApiRequest, sagas.handlePostCreateApiRequest)
  },
  *onPostReadApiRequest() {
    yield takeEvery(postReadApiRequest, sagas.handlePostReadApiRequest)
  },
  *onPostUpdateApiRequest() {
    yield takeEvery(postUpdateApiRequest, sagas.handlePostUpdateApiRequest)
  },
  *onPostDeleteApiRequest() {
    yield takeEvery(postDeleteApiRequest, sagas.handlePostDeleteApiRequest)
  },
}

export const {
  postListApiSuccess,
  postListApiFailure,
  postCreateApiRequest,
  postCreateApiSuccess,
  postCreateApiFailure,
  postReadApiRequest,
  postReadApiSuccess,
  postReadApiFailure,
  postUpdateApiRequest,
  postUpdateApiSuccess,
  postUpdateApiFailure,
  postDeleteApiRequest,
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
  postListMixedApiRequest,
  postListByUsernameApiRequest,
  postReadByUsernameAndSlugApiRequest,
} = thunkActionCreators

// Reducer
const defaultState = {
  entities: {},
  mixedPages: {},
  userPages: {},
  context: {
    create: {
      post: {},
      isPending: false,
      isFulfilled: false,
      isRejected: false,
    },
    read: {
      isPending: false,
      isFulfilled: false,
      isRejected: false,
    },
    update: {
      isSaveOnly: false,
      isPending: false,
      isFulfilled: false,
      isRejected: false,
    },
  },
}
const defaultUserPagesMeta = {
  total: 1,
  pageId: 1,
  limit: 1,
}

const entitiesReducer = handleActions({
  [addEntities]: (state, { payload: { entities } }) => ({
    ...state,
    ...entities.posts,
  }),
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
}, defaultState.entities)

const mixedPagesReducer = handleActions({
  [setMixedPage]: (state, { payload: { pageId, postIds } }) => {
    let mixedPage = state[pageId] || {}

    return {
      ...state,
      [pageId]: {
        ...mixedPage,
        elements: postIds,
      }
    }
  },
  [setMixedPageLoadingStatus]: (state, { payload: { pageId, isLoading } }) => {
    let mixedPage = state[pageId] || {}

    return {
      ...state,
      [pageId]: {
        ...mixedPage,
        isLoading,
      },
    }
  },
}, defaultState.mixedPages)

const userPagesReducer = handleActions({
  [setUserPage]: (state, {
    payload: { username, pageId, meta, postIds },
  }) => {
    let userPages = state[username] || {}
    let userPage = userPages[pageId] || {}

    return {
      ...state,
      [username]: {
        ...userPages,
        [pageId]: {
          ...userPage,
          elements: postIds,
        },
        meta,
      },
    }
  },
  [setUserPageLoadingStatus]: (state, {
    payload: { username, pageId, isLoading },
  }) => {
    let userPages = state[username] || {}
    let userPage = userPages[pageId] || {}

    return {
      ...state,
      [username]: {
        ...userPages,
        [pageId]: {
          ...userPage,
          isLoading,
        },
      },
    }
  },
}, defaultState.userPages)

const contextReducer = handleActions({
  [postCreateApiRequest]: (state) => ({
    ...state,
    create: {
      ...state.create,
      isPending: true,
      isFulfilled: false,
      isRejected: false,
    },
  }),
  [postCreateApiSuccess]: (state) => ({
    ...state,
    create: {
      ...state.create,
      isPending: false,
      isFulfilled: true,
    },
  }),
  [postCreateApiFailure]: (state) => ({
    ...state,
    create: {
      ...state.create,
      isPending: false,
      isRejected: true,
    },
  }),
  [postReadApiRequest]: (state) => ({
    ...state,
    read: {
      ...state.read,
      isPending: true,
      isFulfilled: false,
      isRejected: false,
    },
  }),
  [postReadApiSuccess]: (state) => ({
    ...state,
    read: {
      ...state.read,
      isPending: false,
      isFulfilled: true,
    },
  }),
  [postReadApiFailure]: (state) => ({
    ...state,
    read: {
      ...state.read,
      isPending: false,
      isRejected: true,
    },
  }),
  [postUpdateApiRequest]: (state, { payload: { isSaveOnly } }) => ({
    ...state,
    update: {
      ...state.update,
      isSaveOnly,
      isPending: true,
      isFulfilled: false,
      isRejected: false,
    },
  }),
  [postUpdateApiSuccess]: (state) => ({
    ...state,
    update: {
      ...state.update,
      isPending: false,
      isFulfilled: true,
    },
  }),
  [postUpdateApiFailure]: (state) => ({
    ...state,
    update: {
      ...state.update,
      isPending: false,
      isRejected: true,
    },
  }),
}, defaultState.context)

export default combineReducers({
  entities: entitiesReducer,
  mixedPages: mixedPagesReducer,
  userPages: userPagesReducer,
  context: contextReducer,
})

export let selectors = {
  getCreateContext: (state) => (state.context.create || {}),
  getReadContext: (state) => (state.context.read || {}),
  getUpdateContext: (state) => (state.context.update || {}),
  getMixedPage: (state, pageId) => {
    let mixedPage = state.mixedPages[pageId] || {}

    return mixedPage
  },
  getUserPage: (state, username, pageId) => {
    if (!pageId) {
      pageId = '1'
    } else {
      pageId = pageId.toString()
    }

    let userPages = state.userPages[username] || {}
    let userPage = userPages[pageId] || {}

    return userPage
  },
  getUserPagesMeta: (state, username) => {
    let userPages = state.userPages[username] || {}

    return userPages.meta || defaultUserPagesMeta
  },
  getMixedPosts(state) {
    let mixedPage = this.getMixedPage(state, '1')
    let elements = mixedPage.elements || []
    let posts = elements.map(postId => state.entities[postId])

    return posts
  },
  getUserPosts(state, username, page) {
    let userPage = this.getUserPage(state, username, page)
    let elements = userPage.elements || []
    let posts = elements.map(postId => state.entities[postId])

    return posts
  },
  getMixedPostsLoadingStatus(state) {
    let mixedPage = this.getMixedPage(state, '1')
    let isLoading = mixedPage.isLoading || false

    return isLoading
  },
  getUserPostsLoadingStatus(state, username, pageId) {
    let userPage = this.getUserPage(state, username, pageId)
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
  getUserPostsWithAuthor(state, userEntity, username, page = 1) {
    let posts = this.getUserPosts(state, username, page)

    return posts.map(post => ({
      ...post,
      author: userEntity[post.authorId],
    }))
  },
  getPost: (state, postId) => (state.entities[postId] || { isNotExist: true }),
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
      .keys(posts.entities)
      .filter(postId => {
        let post = posts.entities[postId]

        return (
          post.slug === postSlug &&
          post.authorId === userId
        )
      })

    if (filteredPostIds.length === 0) {
      return defaultPost
    }

    let postId = filteredPostIds[0]

    return posts.entities[postId]
  },
}
