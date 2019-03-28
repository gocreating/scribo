import { rootSaga as postSagas } from './ducks/post'

let rootSaga = [
  postSagas,
]

export default {
  runSagas(sagaMiddleware) {
    rootSaga.forEach(sagas => {
      for (let name in sagas) {
        sagaMiddleware.run(sagas[name])
      }
    })
  },
}
