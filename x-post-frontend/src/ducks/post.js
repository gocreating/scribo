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
  SET_PAGE: (pageId, postIds) => ({ pageId, postIds }),
})
const thunkActionCreators = {
  postListApiRequest: (userId) => async (dispatch) => {
    try {
      let response = await postApi.list(userId, {
        params: {
          filter: { include: 'author' },
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
}

export const {
  postCreateApiSuccess,
  postCreateApiFailure,
  postListApiSuccess,
  postListApiFailure,
  setPage,
} = plainActionCreators
export const {
  postCreateApiRequest,
  postListApiRequest,
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
}
