'use strict'

let env = require('../env')

module.exports = {
  db: {
    name: 'db',
    connector: 'mongodb',
    host: env.db.production.host,
    port: env.db.production.port,
    database: env.db.production.database,
    user: env.db.production.user,
    password: env.db.production.password,
  },
}
