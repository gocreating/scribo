import ApiClient from './ApiClient'

class PostApi extends ApiClient {
  list(userId) {
    return this.get(`/app-users/${userId}/posts`)
  }
  create(userId, post) {
    return this.post(`/app-users/${userId}/posts`, { data: post })
  }
}

let postApi = new PostApi()

export default postApi
