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

export default routes
