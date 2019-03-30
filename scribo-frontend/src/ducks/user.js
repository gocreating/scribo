import { combineReducers } from 'redux'
import { createActions, handleActions } from 'redux-actions'
import { call, put, takeEvery } from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { setAuth, clearAuth } from './auth'
import userApi from '../api/userApi'
import { addEntities } from './entity'
import createApiError from '../utils/createApiError'

// Action Creators
const plainActionCreators = createActions({
  SIGNUP_API_REQUEST: (user, resolve, reject) => ({ user, resolve, reject }),
  SIGNUP_API_SUCCESS: (res) => ({ res }),
  SIGNUP_API_FAILURE: (res) => ({ res }),

  SIGNIN_API_REQUEST: (credentials, resolve, reject) => ({
    credentials, resolve, reject,
  }),
  SIGNIN_API_SUCCESS: (res) => ({ res }),
  SIGNIN_API_FAILURE: (res) => ({ res }),

  LOGOUT_API_SUCCESS: (res) => ({ res }),
  LOGOUT_API_FAILURE: (res) => ({ res }),
})
const thunkActionCreators = {
  logoutApiRequest: () => async (dispatch) => {
    try {
      // userApi.logout() requires accessToken,
      // so don't clear auth before the request is fired
      let response = await userApi.logout()

      dispatch(logoutApiSuccess(response))
      return response.body
    } catch (error) {
      let response = createApiError(error)
      dispatch(logoutApiFailure(response))
      return response.body
    } finally {
      dispatch(clearAuth())
    }
  },
}

// Sagas
export const sagas = {
  *handleSignupApiRequest(action) {
    let { user, resolve, reject } = action.payload

    try {
      let response = yield call(userApi.signup, user)

      yield put(signupApiSuccess(response))
      yield put(push('/user/signin'))
      resolve && (yield call(resolve, response.body))
    } catch (error) {
      let response = createApiError(error)

      yield put(signupApiFailure(response))
      reject && (yield call(reject, response.body))
    }
  },
  *handleSigninApiRequest(action) {
    let { credentials, resolve, reject } = action.payload
    let parsedCredentials = {}

    if (credentials.emailOrUsername.indexOf('@') >= 0) {
      parsedCredentials = {
        email: credentials.emailOrUsername,
        password: credentials.password,
      }
    } else {
      parsedCredentials = {
        username: credentials.emailOrUsername,
        password: credentials.password,
      }
    }

    try {
      let response = yield call(userApi.signin, parsedCredentials)
      let {
        accessToken,
        ttl,
        tokenCreatedAt,
        user,
      } = response.body

      yield put(setAuth(
        accessToken,
        ttl,
        tokenCreatedAt,
        user
      ))
      yield put(signinApiSuccess(response))
      yield put(push(`/@${user.username}`))
      resolve && (yield call(resolve, response.body))
    } catch (error) {
      let response = createApiError(error)

      yield put(signinApiFailure(response))
      reject && (yield call(reject, response.body))
    }
  },
}
export const rootSaga = {
  *onSignupApiRequest() {
    yield takeEvery(signupApiRequest, sagas.handleSignupApiRequest)
  },
  *onSigninApiRequest() {
    yield takeEvery(signinApiRequest, sagas.handleSigninApiRequest)
  },
}

export const {
  signupApiRequest,
  signupApiSuccess,
  signupApiFailure,

  signinApiRequest,
  signinApiSuccess,
  signinApiFailure,

  logoutApiSuccess,
  logoutApiFailure,
} = plainActionCreators
export const {
  logoutApiRequest,
} = thunkActionCreators

// Reducer
const defaultState = {
  entities: {},
  context: {
    signup: {
      isPending: false,
      isFulfilled: false,
      isRejected: false,
    },
    signin: {
      isPending: false,
      isFulfilled: false,
      isRejected: false,
    },
  },
}
const entitiesReducer = handleActions({
  [addEntities]: (state, { payload: { entities } }) => ({
    ...state,
    ...entities.users,
  }),
}, defaultState.entities)
const contextReducer = handleActions({
  [signupApiRequest]: (state) => ({
    ...state,
    signup: {
      ...state.signup,
      isPending: true,
      isFulfilled: false,
      isRejected: false,
    },
  }),
  [signupApiSuccess]: (state) => ({
    ...state,
    signup: {
      ...state.signup,
      isPending: false,
      isFulfilled: true,
    },
  }),
  [signupApiFailure]: (state) => ({
    ...state,
    signup: {
      ...state.signup,
      isPending: false,
      isRejected: true,
    },
  }),
  [signinApiRequest]: (state) => ({
    ...state,
    signin: {
      ...state.signin,
      isPending: true,
      isFulfilled: false,
      isRejected: false,
    },
  }),
  [signinApiSuccess]: (state) => ({
    ...state,
    signin: {
      ...state.signin,
      isPending: false,
      isFulfilled: true,
    },
  }),
  [signinApiFailure]: (state) => ({
    ...state,
    signin: {
      ...state.signin,
      isPending: false,
      isRejected: true,
    },
  }),
}, defaultState.context)

export default combineReducers({
  entities: entitiesReducer,
  context: contextReducer,
})

export let selectors = {
  getSignupContext: (state) => (state.context.signup || {}),
  getSigninContext: (state) => (state.context.signin || {}),
}
