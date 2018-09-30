import ApiClient from './ApiClient'

class UserApi extends ApiClient {
  signup(user) {
    return this.post('/app-users', { data: user })
  }
}

let userApi = new UserApi()

export default userApi
