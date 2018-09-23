import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'
import PageLoading from './utils/PageLoading'

let routes = [{
  exact: true,
  path: '/',
  component: () => import('./pages/basic/HomePage'),
}, {
  path: '/post/new',
  component: () => import('./pages/post/NewPage'),
}, {
  path: '*',
  component: () => import('./pages/basic/NotFoundPage'),
}]

let asyncRoutes = routes.map(({ path, component, ...rest }, idx) => (
  <Route
    key={path || idx}
    path={path}
    component={Loadable({
      loader: component,
      loading: PageLoading,
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
