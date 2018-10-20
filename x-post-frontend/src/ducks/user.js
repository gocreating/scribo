import { createActions, handleActions } from 'redux-actions'
import { setAuth, clearAuth } from './auth'
import userApi from '../api/userApi'
import { addEntities } from './entity'
import createApiError from '../utils/createApiError'

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
    } catch (error) {
      let response = createApiError(error)
      dispatch(signupApiFailure(response))
      return response.body
    }
  },
  signinApiRequest: (credentials) => async (dispatch) => {
    try {
      let response = await userApi.signin(credentials)
      let {
        accessToken,
        ttl,
        tokenCreatedAt,
        user,
      } = response.body

      dispatch(setAuth(
        accessToken,
        ttl,
        tokenCreatedAt,
        user
      ))
      dispatch(signinApiSuccess(response))
      return response.body
    } catch (error) {
      let response = createApiError(error)
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
    } catch (error) {
      let response = createApiError(error)
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

// Reducer
const defaultState = {}
export default handleActions({
  [addEntities]: (state, { payload: { entities } }) => ({
    ...state,
    ...entities.users,
  }),
}, defaultState)
