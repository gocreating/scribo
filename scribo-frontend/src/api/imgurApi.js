import ApiClient from './ApiClient'
import ApiBaseUrl from '../constants/ApiBaseUrl'
import config from '../config'

class ImgurApi extends ApiClient {
  create(image, onProgress) {
    let req = this.post('/image', {
      files: {
        image,
      },
      accessToken: `Client-ID ${config.imgur.clientID}`,
    })

    if (onProgress) {
      return req.on('progress', onProgress)
    }
    return req
  }
}

let imgurApi = new ImgurApi(ApiBaseUrl.IMGUR)

export default imgurApi
