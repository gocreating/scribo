import superagent from 'superagent'
import ApiBaseUrl from '../constants/ApiBaseUrl'
import configureStore from '../configureStore'
import { selectors } from '../ducks/auth'

let methods = ['get', 'post', 'put', 'patch', 'del']

export default class ApiClient {
  accessToken = null

  constructor(base = ApiBaseUrl.MAIN) {
    methods.forEach((method) => {
      this[method] = (path, {
        params,
        data,
        files,
        accessToken,
      } = {}) => {
        let request = superagent[method](`${base}${path}`)
        let state = configureStore.store.getState()
        let storedToken = selectors.getAccessToken(state.auth)
        let token = (
          accessToken ||
          this.accessToken ||
          storedToken
        )
        if (token) {
          request = request.set('Authorization', token)
        }

        if (params) {
          request = request.query(params)
        }

        if (data) {
          request = request.send(data)
        }

        if (files) {
          let formData = new FormData()
          Object.keys(files).forEach((name) => {
            formData.append(name, files[name])
          })
          request = request.send(formData)
        }

        return request
      }
    })
  }

  setAccessToken(accessToken) {
    this.accessToken = accessToken
  }
}
