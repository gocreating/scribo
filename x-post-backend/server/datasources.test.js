'use strict'

let env = require('../env')

module.exports = {
  db: {
    name: 'db',
    connector: 'mongodb',
    host: env.db.test.host,
    port: env.db.test.port,
    database: env.db.test.database,
    user: env.db.test.user,
    password: env.db.test.password,
  },
}
