import { schema } from 'normalizr'

export const user = new schema.Entity('users')
export const post = new schema.Entity('posts', {
  author: user,
})
