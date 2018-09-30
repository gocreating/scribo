import { createActions } from 'redux-actions'
import userApi from '../api/userApi'

// Action Creators
const plainActionCreators = createActions({
  SIGNUP_API_SUCCESS: (res) => ({ res }),
  SIGNUP_API_FAILURE: (res) => ({ res }),
  SIGNIN_API_SUCCESS: (res) => ({ res }),
  SIGNIN_API_FAILURE: (res) => ({ res }),
})
const thunkActionCreators = {
  signupApiRequest: (user) => async (dispatch) => {
    try {
      let response = await userApi.signup(user)
      dispatch(signupApiSuccess(response))
      return response.body
    } catch ({ response }) {
      dispatch(signupApiFailure(response))
      return response.body
    }
  },
  signinApiRequest: (user) => async (dispatch) => {
    try {
      let response = await userApi.signin(user)
      dispatch(signinApiSuccess(response))
      return response.body
    } catch ({ response }) {
      dispatch(signinApiFailure(response))
      return response.body
    }
  },
}

export const {
  signupApiSuccess,
  signupApiFailure,
  signinApiSuccess,
  signinApiFailure,
} = plainActionCreators
export const {
  signupApiRequest,
  signinApiRequest,
} = thunkActionCreators
