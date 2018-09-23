import React from 'react'
import ReactDOM from 'react-dom'
import {
  combineReducers,
  createStore,
  compose,
  applyMiddleware,
} from 'redux'
import { Provider } from 'react-redux'
import {
  connectRouter,
  routerMiddleware,
} from 'connected-react-router'
import { createBrowserHistory } from 'history'
import { reducer as formReducer } from 'redux-form'
import thunk from 'redux-thunk'
import registerServiceWorker from './registerServiceWorker'
import App from './App'

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

ReactDOM.render((
  <Provider store={store}>
    <App history={history} />
  </Provider>
), document.getElementById('root'))
registerServiceWorker()
