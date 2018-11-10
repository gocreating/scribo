import ApiClient from './ApiClient'

class PostApi extends ApiClient {
  list(userId, ...rest) {
    return this.get(`/app-users/${userId}/posts`, ...rest)
  }
  create(userId, post) {
    return this.post(`/app-users/${userId}/posts`, { data: post })
  }
  read(userId, postId) {
    return this.get(`/app-users/${userId}/posts/${postId}`)
  }
  update(userId, postId, post) {
    return this.put(`/app-users/${userId}/posts/${postId}`, { data: post })
  }
  delete(userId, postId) {
    return this.del(`/app-users/${userId}/posts/${postId}`)
  }
  listMixed(...rest) {
    return this.get('/posts/mixed', ...rest)
  }
  listByUsername(username, ...rest) {
    return this.get(`/app-users/username/${username}/posts`, ...rest)
  }
  readByUsernameAndSlug(username, postSlug, ...rest) {
    return this.get(`/app-users/username/${username}/posts/${postSlug}`, ...rest)
  }
}

let postApi = new PostApi()

export default postApi
