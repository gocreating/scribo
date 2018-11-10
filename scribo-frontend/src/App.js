import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'
import LoadingPage from './pages/basic/LoadingPage'
import routes from './routes'

let asyncRoutes = routes.map(({ path, component, ...rest }, idx) => (
  <Route
    key={path || idx}
    path={path}
    component={Loadable({
      loader: component,
      loading: LoadingPage,
      delay: 300,
    })}
    {...rest}
  />
))

let App = ({ history }) => (
  <ConnectedRouter history={history}>
    <Switch>
      {asyncRoutes}
    </Switch>
  </ConnectedRouter>
);

export default App
