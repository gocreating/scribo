// https://github.com/paularmstrong/normalizr/blob/master/examples/redux/src/redux/modules/commits.js

import { createActions } from 'redux-actions'

// Action Creators
const plainActionCreators = createActions({
  ADD_ENTITIES: (entities) => ({ entities }),
})

export const {
  addEntities,
} = plainActionCreators
