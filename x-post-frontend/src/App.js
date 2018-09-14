import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
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

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          {asyncRoutes}
        </Switch>
      </Router>
    )
  }
}

export default App
