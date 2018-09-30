import superagent from 'superagent'
import ApiBaseUrl from '../constants/ApiBaseUrl'

let methods = ['get', 'post', 'put', 'patch', 'del']

export default class ApiClient {
  constructor(base = ApiBaseUrl.MAIN) {
    methods.forEach((method) => {
      this[method] = (path, { params, data, files } = {}) => {
        let request = superagent[method](`${base}${path}`)

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
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
