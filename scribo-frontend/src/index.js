import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import * as serviceWorker from './serviceWorker';
import configureStore from './configureStore'
import App from './App'

serviceWorker.unregister();

let { store, history, persistor } = configureStore

persistor.subscribe(() => {
  const { bootstrapped } = persistor.getState()
  if (bootstrapped) {
    ReactDOM.hydrate((
      <Provider store={store}>
        <App history={history} />
      </Provider>
    ), document.getElementById('root'))
  }
})

// ReactDOM.render((
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <App history={history} />
//     </PersistGate>
//   </Provider>
// ), document.getElementById('root'))
