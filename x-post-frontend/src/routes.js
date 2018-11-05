let routes = [{
  exact: true,
  path: '/',
  component: () => import('./pages/basic/HomePage'),
}, {
  exact: true,
  path: '/theme',
  component: () => import('./pages/basic/ThemePage'),
}, {
  exact: true,
  path: '/donation',
  component: () => import('./pages/basic/DonationPage'),
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
  exact: true,
  path: '/@:username',
  component: () => import('./pages/post/ListPage'),
}, {
  path: '/@:username/:postSlug',
  component: () => import('./pages/post/ShowPage'),
}, {
  path: '/post/:postId/edit',
  component: () => import('./pages/post/EditPage'),
}, {
  path: '*',
  component: () => import('./pages/basic/NotFoundPage'),
}]

export default routes
