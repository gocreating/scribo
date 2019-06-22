import express from 'express'
import path from 'path'
import Loadable from 'react-loadable'
// import {
//   combineReducers,
//   createStore,
//   compose,
//   applyMiddleware,
// } from 'redux'
// import { persistStore, getStoredState } from 'redux-persist'
// import { CookieStorage, NodeCookiesWrapper } from 'redux-persist-cookie-storage'
// import Cookies from 'cookies'
import render from './render'
// import {
//   connectRouter,
//   routerMiddleware,
// } from 'connected-react-router'
// import sagaManager from '../src/sagaManager'
// import authReducer from '../src/ducks/auth'
// import userReducer from '../src/ducks/user'
// import postReducer from '../src/ducks/post'
// import { createMemoryHistory } from 'history'


// let history = createMemoryHistory()
// let ruducers = combineReducers({
//   router: connectRouter(history),
//   form: formReducer,
//   auth: authReducer,
//   users: userReducer,
//   posts: postReducer,
// })

// let sagaMiddleware = createSagaMiddleware()
// let logger = createLogger({
//   diff: true,
//   collapsed: true,
// })
// let middlewares = []

// if (process.env.NODE_ENV === 'development') {
//   middlewares = [
//     sagaMiddleware,
//     thunk,
//     logger,
//     routerMiddleware(history),
//   ]
// } else {
//   middlewares = [
//     sagaMiddleware,
//     thunk,
//     routerMiddleware(history),
//   ]
// }

// sagaManager.runSagas(sagaMiddleware)


const app = express()
const PORT = process.env.PORT || 8000

// const configurePersistor = async (store) => {
//   return new Promise((resolve) => {
//     const persistor = persistStore(store, {}, () => {
//       resolve(persistor)
//     })
//   })
// }

// app.use(Cookies.express())
// app.use(async (req, res) => {
//   const cookieJar = new NodeCookiesWrapper(new Cookies(req, res))

//   const persistConfig = {
//     key: 'root',
//     storage: new CookieStorage(cookieJar/*, options */),
//     stateReconciler(inboundState, originalState) {
//       // Ignore state from cookies, only use preloadedState from window object
//       return originalState
//     }
//   }

//   const rootReducer = persistCombineReducers(persistConfig, ruducers)

//   // Initialize store without preloaded state
//   const store = createStore(
//     connectRouter(history)(rootReducer),
//     {},
//     compose(applyMiddleware(...middlewares))
//   )

//   // Wait until persistor has completed deserialization
//   const persistor = await configurePersistor(store)

//   // Force cookies to be set
//   await persistor.flush()

//   req.persistor = persistor
// })

app.use(express.Router().get('/', render))
app.use(express.static(path.resolve(__dirname, '../build')))
app.use(render)

// Loadable listener to make sure that all of your loadable components are already loaded
// https://github.com/jamiebuilds/react-loadable#preloading-all-your-loadable-components-on-the-server
Loadable.preloadAll().then(() => {
  app.listen(PORT, console.log(`App listening on port ${PORT}!`))
})
