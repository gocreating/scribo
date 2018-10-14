import ApiClient from './ApiClient'
import ApiBaseUrl from '../constants/ApiBaseUrl'
import config from '../config'

class ImgurApi extends ApiClient {
  create(image) {
    return this.post('/image', {
      files: {
        image,
      },
      accessToken: `Client-ID ${config.imgur.clientID}`,
    })
  }
}

let imgurApi = new ImgurApi(ApiBaseUrl.IMGUR)

export default imgurApi
