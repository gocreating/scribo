const envMap = {
  development: 'http://localhost:4000/api',
  test: '',
  production: 'https://x-post.herokuapp.com/api',
}

export default {
  MAIN: envMap[process.env.NODE_ENV],
}
