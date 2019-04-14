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

  POST_LIST_MIXED_API_REQUEST: (pageId, resolve, reject) => ({
    pageId, resolve, reject,
  }),
  POST_LIST_MIXED_API_SUCCESS: (res, pageId) => ({ res, pageId }),
  POST_LIST_MIXED_API_FAILURE: (res, pageId) => ({ res, pageId }),

  POST_LIST_BY_USERNAME_API_REQUEST: (username, pageId, resolve, reject) => ({
    username, pageId, resolve, reject,
  }),
  POST_LIST_BY_USERNAME_API_SUCCESS: (res, username, pageId) => ({
    res, username, pageId,
  }),
  POST_LIST_BY_USERNAME_API_FAILURE: (res, username, pageId) => ({
    res, username, pageId,
  }),

  POST_CREATE_API_REQUEST: (post, resolve, reject) => ({ post, resolve, reject }),
  POST_CREATE_API_SUCCESS: (res) => ({ res }),
  POST_CREATE_API_FAILURE: (res) => ({ res }),

  POST_READ_API_REQUEST: (userId, postId, resolve, reject) => ({
    userId, postId, resolve, reject,
  }),
  POST_READ_API_SUCCESS: (res) => ({ res }),
  POST_READ_API_FAILURE: (res) => ({ res }),

  POST_READ_BY_USERNAME_AND_SLUG_API_REQUEST: (username, postSlug, resolve, reject) => ({
    username, postSlug, resolve, reject,
  }),
  POST_READ_BY_USERNAME_AND_SLUG_API_SUCCESS: (res, username, postSlug) => ({
    res, username, postSlug,
  }),
  POST_READ_BY_USERNAME_AND_SLUG_API_FAILURE: (res, username, postSlug) => ({
    res, username, postSlug,
  }),

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

  SET_MIXED_PAGE: (pageId, postIds) => ({
    pageId, postIds,
  }),
  SET_USER_PAGE: (username, pageId, meta, postIds) => ({
    username, pageId, meta, postIds,
  }),
  REDIRECT_TO_NEW_POST: () => {},
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
}
// Sagas
export const sagas = {
  *handlePostListMixedApiRequest(action) {
    let { pageId, resolve, reject } = action.payload

    try {
      let response = yield call(postApi.listMixed)
      let { result, entities } = normalize(response.body, [postSchema])

      yield put(postListMixedApiSuccess(response, pageId))
      yield put(addEntities(entities))
      yield put(setMixedPage(1, result))
      resolve && (yield call(resolve, response.body))
    } catch (error) {
      let response = createApiError(error)

      yield put(postListMixedApiFailure(response, pageId))
      reject && (yield call(reject, response.body))
    }
  },
  *handlePostListByUsernameApiRequest(action) {
    let { username, pageId, resolve, reject } = action.payload

    try {
      let response = yield call(postApi.listByUsername, username, {
        params: {
          pageId,
        },
      })
      let { posts, meta } = response.body
      let { result, entities } = normalize(posts, [postSchema])

      yield put(postListByUsernameApiSuccess(response, username, pageId))
      yield put(addEntities(entities))
      yield put(setUserPage(username, pageId, meta, result))
      resolve && (yield call(resolve, response.body))
    } catch (error) {
      let response = createApiError(error)

      yield put(postListByUsernameApiFailure(response, username, pageId))
      reject && (yield call(reject, response.body))
    }
  },
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
  *handlePostReadByUsernameAndSlugApiRequest(action) {
    let { username, postSlug, resolve, reject } = action.payload

    try {
      let response = yield call(postApi.readByUsernameAndSlug, username, postSlug)
      let { entities } = normalize(response.body, postSchema)

      entities.posts = zipSeriesPostsOrder(entities.posts)
      yield put(postReadByUsernameAndSlugApiSuccess(response, username, postSlug))
      yield put(addEntities(entities))
      resolve && (yield call(resolve, response.body))
    } catch (error) {
      let response = createApiError(error)

      yield put(postReadByUsernameAndSlugApiFailure(response, username, postSlug))
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
  *handleRedirectToNewPost(action) {
    let isAuth = yield select(({ auth }) => authSelectors.getIsAuth(auth))

    if (isAuth) {
      yield put(push('/post/new'))
    } else {
      yield put(push('/user/signin'))
    }
  }
}
export const rootSaga = {
  *onPostListMixedApiRequest() {
    yield takeEvery(
      postListMixedApiRequest,
      sagas.handlePostListMixedApiRequest
    )
  },
  *onPostListByUsernameApiRequest() {
    yield takeEvery(
      postListByUsernameApiRequest,
      sagas.handlePostListByUsernameApiRequest
    )
  },
  *onPostCreateApiRequest() {
    yield takeEvery(postCreateApiRequest, sagas.handlePostCreateApiRequest)
  },
  *onPostReadApiRequest() {
    yield takeEvery(postReadApiRequest, sagas.handlePostReadApiRequest)
  },
  *onPostReadByUsernameAndSlugApiRequest() {
    yield takeEvery(
      postReadByUsernameAndSlugApiRequest,
      sagas.handlePostReadByUsernameAndSlugApiRequest
    )
  },
  *onPostUpdateApiRequest() {
    yield takeEvery(postUpdateApiRequest, sagas.handlePostUpdateApiRequest)
  },
  *onPostDeleteApiRequest() {
    yield takeEvery(postDeleteApiRequest, sagas.handlePostDeleteApiRequest)
  },
  *onRedirectToNewPost() {
    yield takeEvery(redirectToNewPost, sagas.handleRedirectToNewPost)
  },
}

export const {
  postListApiSuccess,
  postListApiFailure,

  postListMixedApiRequest,
  postListMixedApiSuccess,
  postListMixedApiFailure,

  postListByUsernameApiRequest,
  postListByUsernameApiSuccess,
  postListByUsernameApiFailure,

  postCreateApiRequest,
  postCreateApiSuccess,
  postCreateApiFailure,

  postReadApiRequest,
  postReadApiSuccess,
  postReadApiFailure,

  postReadByUsernameAndSlugApiRequest,
  postReadByUsernameAndSlugApiSuccess,
  postReadByUsernameAndSlugApiFailure,

  postUpdateApiRequest,
  postUpdateApiSuccess,
  postUpdateApiFailure,

  postDeleteApiRequest,
  postDeleteApiSuccess,
  postDeleteApiFailure,

  setMixedPage,
  setUserPage,
  redirectToNewPost,
} = plainActionCreators
export const {
  postListApiRequest,
} = thunkActionCreators

// Reducer
const defaultState = {
  entities: {},
  mixedPages: {},
  userPages: {},
  context: {
    listMixed: {},
    listByUsername: {},
    entities: {},
    create: {
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
}, defaultState.userPages)

const contextReducer = handleActions({
  [postListMixedApiRequest]: (state, { payload: { pageId } }) => {
    let ctxListMixedOfPage = state.listMixed[pageId] || {}

    return {
      ...state,
      listMixed: {
        ...state.listMixed,
        [pageId]: {
          ...ctxListMixedOfPage,
          isPending: true,
          isFulfilled: false,
          isRejected: false,
        },
      },
    }
  },
  [postListMixedApiSuccess]: (state, { payload: { pageId } }) => {
    let ctxListMixedOfPage = state.listMixed[pageId] || {}

    return {
      ...state,
      listMixed: {
        ...state.listMixed,
        [pageId]: {
          ...ctxListMixedOfPage,
          isPending: false,
          isFulfilled: true,
        },
      },
    }
  },
  [postListMixedApiFailure]: (state, { payload: { pageId } }) => {
    let ctxListMixedOfPage = state.listMixed[pageId] || {}

    return {
      ...state,
      listMixed: {
        ...state.listMixed,
        [pageId]: {
          ...ctxListMixedOfPage,
          isPending: false,
          isRejected: true,
        },
      },
    }
  },
  [postListByUsernameApiRequest]: (state, { payload: { username, pageId } }) => {
    let ctxListByUsernameOfUsername = state.listByUsername[username] || {}
    let ctxListByUsernameOfUsernameAndPage = (
      ctxListByUsernameOfUsername[pageId] || {}
    )

    return {
      ...state,
      listByUsername: {
        ...state.listByUsername,
        [username]: {
          ...ctxListByUsernameOfUsername,
          [pageId]: {
            ...ctxListByUsernameOfUsernameAndPage,
            isPending: true,
            isFulfilled: false,
            isRejected: false,
          },
        },
      },
    }
  },
  [postListByUsernameApiSuccess]: (state, { payload: { username, pageId } }) => {
    let ctxListByUsernameOfUsername = state.listByUsername[username] || {}
    let ctxListByUsernameOfUsernameAndPage = (
      ctxListByUsernameOfUsername[pageId] || {}
    )

    return {
      ...state,
      listByUsername: {
        ...state.listByUsername,
        [username]: {
          ...ctxListByUsernameOfUsername,
          [pageId]: {
            ...ctxListByUsernameOfUsernameAndPage,
            isPending: false,
            isFulfilled: true,
          },
        },
      },
    }
  },
  [postListByUsernameApiFailure]: (state, { payload: { username, pageId } }) => {
    let ctxListByUsernameOfUsername = state.listByUsername[username] || {}
    let ctxListByUsernameOfUsernameAndPage = (
      ctxListByUsernameOfUsername[pageId] || {}
    )

    return {
      ...state,
      listByUsername: {
        ...state.listByUsername,
        [username]: {
          ...ctxListByUsernameOfUsername,
          [pageId]: {
            ...ctxListByUsernameOfUsernameAndPage,
            isPending: false,
            isRejected: true,
          },
        },
      },
    }
  },
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
  [postReadByUsernameAndSlugApiRequest]: (state, {
    payload: { username, postSlug },
  }) => {
    let postKey = `${username},${postSlug}`
    let ctxEntity = state.entities[postKey] || {}

    return {
      ...state,
      entities: {
        [postKey]: {
          ...ctxEntity,
          isPending: true,
          isFulfilled: false,
          isRejected: false,
        },
      },
    }
  },
  [postReadByUsernameAndSlugApiSuccess]: (state, {
    payload: { username, postSlug },
  }) => {
    let postKey = `${username},${postSlug}`
    let ctxEntity = state.entities[postKey] || {}

    return {
      ...state,
      entities: {
        [postKey]: {
          ...ctxEntity,
          isPending: false,
          isFulfilled: true,
        },
      },
    }
  },
  [postReadByUsernameAndSlugApiFailure]: (state, {
    payload: { username, postSlug },
  }) => {
    let postKey = `${username},${postSlug}`
    let ctxEntity = state.entities[postKey] || {}

    return {
      ...state,
      entities: {
        [postKey]: {
          ...ctxEntity,
          isPending: false,
          isRejected: true,
        },
      },
    }
  },
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
  getListMixedContext: (state, pageId=1) => (state.context.listMixed[pageId] || {}),
  getListByUsernameContext: (state, username, pageId=1) => {
    let ctxUsername = state.context.listByUsername[username] || {}
    let ctxUsernameOfPage = ctxUsername[pageId] || {}

    return ctxUsernameOfPage
  },
  getCreateContext: (state) => (state.context.create || {}),
  getReadContext: (state) => (state.context.read || {}),
  getEntitiesContext: (state, username, postSlug) => (
    state.context.entities[`${username},${postSlug}`] || {}
  ),
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
    if (filteredPostIds.length > 1) {
      throw new Error('Duplicate (username, slug) pair, cannot retrieve post correctly.')
    }
    let postId = filteredPostIds[0]

    return posts.entities[postId]
  },
}
