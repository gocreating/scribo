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
import { reducer as formReducer } from 'redux-form'
import thunk from 'redux-thunk'

let history = createBrowserHistory()
let rootReducer = combineReducers({
  form: formReducer,
})
let store = createStore(
  connectRouter(history)(rootReducer),
  {},
  compose(
    applyMiddleware(
      thunk,
      routerMiddleware(history)
    )
  )
)

export default () => {
  return {
    store: store,
    history: history,
  }
}
