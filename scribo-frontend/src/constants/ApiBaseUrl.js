const envMap = {
  development: 'http://localhost:4000/api',
  test: '',
  production: 'https://scribo-backend.herokuapp.com/api',
}

export default {
  MAIN: envMap[process.env.NODE_ENV],
  IMGUR: 'https://api.imgur.com/3',
}
