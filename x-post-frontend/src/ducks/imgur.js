import { createActions } from 'redux-actions'
import imgurApi from '../api/imgurApi'
import createApiError from '../utils/createApiError'

// Action Creators
const plainActionCreators = createActions({
  IMGUR_IMAGE_CREATE_API_SUCCESS: (res) => ({ res }),
  IMGUR_IMAGE_CREATE_API_FAILURE: (res) => ({ res }),
})
const thunkActionCreators = {
  imgurImageCreateApiRequest: (image) => async (dispatch) => {
    try {
      let response = await imgurApi.create(image)
      dispatch(imgurImageCreateApiSuccess(response))
      return response.body
    } catch (error) {
      let response = createApiError(error)
      dispatch(imgurImageCreateApiFailure(response))
      return response.body
    }
  },
}

export const {
  imgurImageCreateApiSuccess,
  imgurImageCreateApiFailure,
} = plainActionCreators
export const {
  imgurImageCreateApiRequest,
} = thunkActionCreators
