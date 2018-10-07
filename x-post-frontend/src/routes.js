let routes = [{
  exact: true,
  path: '/',
  component: () => import('./pages/basic/HomePage'),
}, {
  exact: true,
  path: '/user/signup',
  component: () => import('./pages/user/NewPage'),
}, {
  exact: true,
  path: '/user/signin',
  component: () => import('./pages/user/SigninPage'),
}, {
  exact: true,
  path: '/post/new',
  component: () => import('./pages/post/NewPage'),
}, {
  path: '/user/:userId/post/:postId',
  component: () => import('./pages/post/ShowPage'),
}, {
  path: '*',
  component: () => import('./pages/basic/NotFoundPage'),
}]

export default routes
