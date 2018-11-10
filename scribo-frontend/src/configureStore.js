import {
  combineReducers,
  createStore,
  compose,
  applyMiddleware,
} from 'redux'
import {
  connectRouter,
  routerMiddleware,
} from 'connected-react-router'
import { createHashHistory } from 'history'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { reducer as formReducer } from 'redux-form'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import authReducer from './ducks/auth'
import userReducer from './ducks/user'
import postReducer from './ducks/post'

let history = createHashHistory()
let persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
}
let rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  users: userReducer,
  posts: postReducer,
})
let persistedReducer = persistReducer(persistConfig, rootReducer)
let logger = createLogger({
  diff: true,
  collapsed: true,
})
let middlewares = []

if (process.env.NODE_ENV === 'development') {
  middlewares = [
    thunk,
    logger,
    routerMiddleware(history),
  ]
} else {
  middlewares = [
    thunk,
    routerMiddleware(history),
  ]
}

let store = createStore(
  connectRouter(history)(persistedReducer),
  {},
  compose(applyMiddleware(...middlewares))
)
let persistor = persistStore(store)

export default {
  store: store,
  history: history,
  persistor: persistor,
}
