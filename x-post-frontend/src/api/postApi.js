import ApiClient from './ApiClient'

class PostApi extends ApiClient {
  create(userId, post) {
    return this.post(`/app-users/${userId}/posts`, { data: post })
  }
}

let postApi = new PostApi()

export default postApi
