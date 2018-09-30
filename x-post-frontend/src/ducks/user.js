import { createActions } from 'redux-actions'
import { setAuth, clearAuth } from './auth'
import userApi from '../api/userApi'

// Action Creators
const plainActionCreators = createActions({
  SIGNUP_API_SUCCESS: (res) => ({ res }),
  SIGNUP_API_FAILURE: (res) => ({ res }),
  SIGNIN_API_SUCCESS: (res) => ({ res }),
  SIGNIN_API_FAILURE: (res) => ({ res }),
  LOGOUT_API_SUCCESS: (res) => ({ res }),
  LOGOUT_API_FAILURE: (res) => ({ res }),
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
      let {
        userId,
        accessToken,
        ttl,
        tokenCreatedAt,
      } = response.body

      dispatch(setAuth(
        userId,
        accessToken,
        ttl,
        tokenCreatedAt
      ))
      dispatch(signinApiSuccess(response))
      return response.body
    } catch ({ response }) {
      dispatch(signinApiFailure(response))
      return response.body
    }
  },
  logoutApiRequest: () => async (dispatch) => {
    try {
      let response = await userApi.logout()
      dispatch(clearAuth())
      dispatch(logoutApiSuccess(response))
      return response.body
    } catch ({ response }) {
      dispatch(logoutApiFailure(response))
      return response.body
    }
  },
}

export const {
  signupApiSuccess,
  signupApiFailure,
  signinApiSuccess,
  signinApiFailure,
  logoutApiSuccess,
  logoutApiFailure,
} = plainActionCreators
export const {
  signupApiRequest,
  signinApiRequest,
  logoutApiRequest,
} = thunkActionCreators
