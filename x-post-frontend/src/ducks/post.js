import { createActions } from 'redux-actions'
import postApi from '../api/postApi'

// Action Creators
const plainActionCreators = createActions({
  POST_CREATE_API_SUCCESS: (res) => ({ res }),
  POST_CREATE_API_FAILURE: (res) => ({ res }),
})
const thunkActionCreators = {
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
} = plainActionCreators
export const {
  postCreateApiRequest,
} = thunkActionCreators
