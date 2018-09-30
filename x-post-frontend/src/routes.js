let routes = [{
  exact: true,
  path: '/',
  component: () => import('./pages/basic/HomePage'),
}, {
  path: '/user/signup',
  component: () => import('./pages/user/NewPage'),
}, {
  path: '/user/signin',
  component: () => import('./pages/user/SigninPage'),
}, {
  path: '/post/new',
  component: () => import('./pages/post/NewPage'),
}, {
  path: '*',
  component: () => import('./pages/basic/NotFoundPage'),
}]

export default routes
