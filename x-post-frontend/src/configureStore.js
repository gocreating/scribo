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
import { createBrowserHistory } from 'history'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { reducer as formReducer } from 'redux-form'
import thunk from 'redux-thunk'
import authReducer from './ducks/auth'
import postReducer from './ducks/post'

let history = createBrowserHistory({
  basename: '/x-post',
})
let persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
}
let rootReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  posts: postReducer,
})
let persistedReducer = persistReducer(persistConfig, rootReducer)
let store = createStore(
  connectRouter(history)(persistedReducer),
  {},
  compose(
    applyMiddleware(
      thunk,
      routerMiddleware(history)
    )
  )
)
let persistor = persistStore(store)

export default {
  store: store,
  history: history,
  persistor: persistor,
}
