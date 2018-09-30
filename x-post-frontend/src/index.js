import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import registerServiceWorker from './registerServiceWorker'
import configureStore from './configureStore'
import App from './App'

let { store, history, persistor } = configureStore()

ReactDOM.render((
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App history={history} />
    </PersistGate>
  </Provider>
), document.getElementById('root'))
registerServiceWorker()
