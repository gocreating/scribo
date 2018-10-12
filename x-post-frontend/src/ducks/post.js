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
  SET_PAGE: (pageId, postIds) => ({ pageId, postIds }),
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
              title: true,
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
      dispatch(setPage(1, result))
      return response.body
    } catch (error) {
      let response = createApiError(error)
      dispatch(postListApiFailure(response))
      return response.body
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
      dispatch(postListApiRequest(userId))
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
  setPage,
} = plainActionCreators
export const {
  postCreateApiRequest,
  postListApiRequest,
  postReadApiRequest,
  postUpdateApiRequest,
  postDeleteApiRequest,
} = thunkActionCreators

// Reducer
const defaultState = {
  pages: {},
}
export default handleActions({
  [addEntities]: (state, { payload: { entities } }) => ({
    ...state,
    ...entities.posts,
  }),
  [setPage]: (state, { payload: { pageId, postIds } }) => ({
    ...state,
    pages: {
      ...state.pages,
      [pageId]: {
        elements: postIds,
      },
    },
  }),
}, defaultState)

export let selectors = {
  getPosts: (state) => {
    let page = state.pages['1'] || {}
    let elements = page.elements || []
    let posts = elements.map(postId => state[postId])

    return posts
  },
  getPost: (state, postId) => (state[postId] || {}),
}
