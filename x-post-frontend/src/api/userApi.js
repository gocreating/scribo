import ApiClient from './ApiClient'

class UserApi extends ApiClient {
  signup(user) {
    return this.post('/app-users', { data: user })
  }
  signin(user) {
    return this.post('/app-users/login', { data: user })
  }
}

let userApi = new UserApi()

export default userApi
